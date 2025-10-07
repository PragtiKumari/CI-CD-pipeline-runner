// server.js
const express = require("express");
const { exec } = require("child_process");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 🧩 WebSocket connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 1️⃣ Health Check
app.get("/", (req, res) => {
  res.send("🚀 CI/CD Runner API with Live Logs is running!");
});

// 2️⃣ About route
app.get("/about", (req, res) => {
  res.json({
    name: "CI/CD Pipeline Runner",
    version: "2.2",
    author: "Your Name",
    description:
      "Enhanced CI/CD pipeline runner with PostgreSQL + persistent live logs via Socket.io",
  });
});

// 3️⃣ Run pipeline with real-time DB updates
app.post("/run-pipeline", async (req, res) => {
  const pipeline = req.body;
  const stepsResult = [];
  let successCount = 0;
  let failureCount = 0;
  const runId = Date.now().toString();

  // 🧩 Create pipeline record initially
  await pool.query(
    `INSERT INTO pipelines (run_id, status, total_steps, successful_steps, failed_steps, logs)
     VALUES ($1, 'running', $2, 0, 0, '[]'::jsonb)`,
    [runId, pipeline.steps.length]
  );

  io.emit("pipeline:start", { runId, totalSteps: pipeline.steps.length });

  try {
    for (let i = 0; i < pipeline.steps.length; i++) {
      const step = pipeline.steps[i];
      const stepResult = {
        step: i + 1,
        command: step.run,
        status: "pending",
        output: "",
      };

      io.emit("pipeline:step", { stepNum: i + 1, command: step.run });

      await new Promise((resolve) => {
        exec(step.run, async (error, stdout, stderr) => {
          // 🧹 Format output to look exactly like terminal (no flattening)
          let formattedOutput = stdout
            ? stdout
                .replace(/\r\n/g, "\n") // Windows → Unix line breaks
                .replace(/\r/g, "\n")
                .split("\n")
                .filter((line) => line.trim() !== "")
                .slice(0, 25) // limit lines (safety)
                .join("\n")
                .trim()
            : "";

          // 🧠 Show raw terminal-like output on dashboard (no 📜 📂 prefix)
          if (formattedOutput) {
            stepResult.output += formattedOutput + "\n";
            io.emit("pipeline:log", {
              stepNum: i + 1,
              output: formattedOutput,
            });

            // ✅ Save complete formatted logs to DB
            try {
              await pool.query(
                `UPDATE pipelines
                   SET logs = COALESCE(logs, '[]'::jsonb) || $1::jsonb
                 WHERE run_id = $2`,
                [
                  JSON.stringify([
                    { step: i + 1, command: step.run, log: formattedOutput },
                  ]),
                  runId,
                ]
              );
            } catch (dbErr) {
              console.error("❌ Live log DB update error:", dbErr.message);
            }
          }

          if (stderr) {
            stepResult.output += "Error: " + stderr.trim() + "\n";
            io.emit("pipeline:log", { stepNum: i + 1, output: stderr });
          }

          if (error) {
            stepResult.status = "failed";
            failureCount++;
            stepsResult.push(stepResult);
            io.emit("pipeline:error", {
              stepNum: i + 1,
              message: error.message,
            });
          } else {
            stepResult.status = "success";
            successCount++;
            stepsResult.push(stepResult);
          }
          resolve();
        });
      });
    }

    // 🧩 Final result summary
    const result = {
      status: failureCount > 0 ? "failed" : "success",
      steps: stepsResult,
      summary: {
        totalSteps: pipeline.steps.length,
        successfulSteps: successCount,
        failedSteps: failureCount,
        finishedAt: new Date().toISOString(),
      },
    };

    // ✅ Update final pipeline record
    await pool.query(
      `UPDATE pipelines
         SET status = $1,
             successful_steps = $2,
             failed_steps = $3,
             logs = $4,
             created_at = NOW()
       WHERE run_id = $5`,
      [
        result.status,
        successCount,
        failureCount,
        JSON.stringify(result.steps),
        runId,
      ]
    );

    io.emit("pipeline:complete", { runId, status: result.status });
    res.json(result);
  } catch (err) {
    console.error("❌ Pipeline error:", err.message);
    await pool.query(
      `UPDATE pipelines SET status='failed' WHERE run_id=$1`,
      [runId]
    );
    io.emit("pipeline:complete", { runId, status: "failed" });
    res.status(500).json({ error: err.message });
  }
});

// 4️⃣ Fetch all pipelines
app.get("/pipelines", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pipelines ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch pipelines error:", err.message);
    res.status(500).json({ error: "Failed to fetch pipelines" });
  }
});

// 5️⃣ Fetch a single pipeline by run_id
app.get("/pipelines/:runId", async (req, res) => {
  const { runId } = req.params;
  try {
    const result = await pool.query(
      "SELECT run_id, status, total_steps, successful_steps, failed_steps, logs, created_at FROM pipelines WHERE run_id = $1",
      [runId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Pipeline not found" });

    const pipeline = result.rows[0];
    if (typeof pipeline.logs === "string") {
      pipeline.logs = JSON.parse(pipeline.logs);
    }

    res.json(pipeline);
  } catch (err) {
    console.error("❌ Error fetching pipeline by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch pipeline details" });
  }
});

// 6️⃣ Start server
server.listen(3000, () => {
  console.log("🚀 Server with persistent logs running on http://localhost:3000");
});
