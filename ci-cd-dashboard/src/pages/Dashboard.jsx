// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getPipelines, runPipeline, getPipelineById } from "../api/api";
import PipelineForm from "../components/PipelineForm";
import PipelineList from "../components/PipelineList";

export default function Dashboard() {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const logRef = useRef(null);

  // 1️⃣ Connect WebSocket
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);

    newSocket.on("connect", () =>
      console.log("🟢 Connected to backend via WebSocket")
    );
    newSocket.on("disconnect", () =>
      console.log("🔴 Disconnected from backend")
    );

    return () => newSocket.disconnect();
  }, []);

  // 2️⃣ Fetch existing pipelines
  const fetchPipelines = async () => {
    try {
      const data = await getPipelines();
      setPipelines(data);
    } catch (err) {
      console.error("Failed to fetch pipelines:", err.message);
    }
  };

  // 3️⃣ Listen for pipeline events
  useEffect(() => {
    if (!socket) return;
    fetchPipelines();

    socket.on("pipeline:start", (data) => {
      setLogs((prev) => [
        ...prev,
        `🚀 Pipeline ${data.runId} started (${data.totalSteps} steps)...`,
      ]);
    });

    socket.on("pipeline:step", (data) => {
      setLogs((prev) => [...prev, `▶️ Step ${data.stepNum}: ${data.command}`]);
    });

    socket.on("pipeline:log", (data) => {
      // ✅ Preserve raw terminal formatting
      setLogs((prev) => [...prev, data.output]);
    });

    socket.on("pipeline:error", (data) => {
      setLogs((prev) => [
        ...prev,
        `❌ Error in Step ${data.stepNum}: ${data.message}`,
      ]);
    });

    socket.on("pipeline:complete", (data) => {
      setLogs((prev) => [
        ...prev,
        `✅ Pipeline ${data.runId} finished with status: ${data.status}`,
      ]);
      fetchPipelines();
      setLoading(false);
    });

    return () => {
      socket.off("pipeline:start");
      socket.off("pipeline:step");
      socket.off("pipeline:log");
      socket.off("pipeline:error");
      socket.off("pipeline:complete");
    };
  }, [socket]);

  // 🪄 Auto-scroll log area
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // 4️⃣ Run pipeline
  const handleRunPipeline = async (steps) => {
    setLogs([]);
    setLoading(true);
    try {
      await runPipeline(steps);
    } catch (err) {
      console.error("Pipeline run failed:", err.message);
      setLogs((prev) => [...prev, "❌ Failed to trigger pipeline."]);
      setLoading(false);
    }
  };

  // 5️⃣ View saved logs
  const handleViewLogs = async (runId) => {
    try {
      const data = await getPipelineById(runId);
      setSelectedPipeline(data);
    } catch (err) {
      console.error("Error fetching pipeline details:", err.message);
    }
  };

  // 6️⃣ Render
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      {/* ✅ Removed duplicate heading */}

      <PipelineForm onRun={handleRunPipeline} />

      {loading && (
        <p className="text-blue-600 text-center font-semibold animate-pulse">
          ⏳ Running pipeline...
        </p>
      )}

      {logs.length > 0 && (
        <pre
          ref={logRef}
          className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg my-4 h-80 overflow-y-auto whitespace-pre-wrap border border-gray-700"
          style={{ lineHeight: "1.4" }}
        >
          {logs.join("\n")}
        </pre>
      )}

      <PipelineList pipelines={pipelines} onView={handleViewLogs} />

      {selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-3">
              🧩 Logs for Run ID: {selectedPipeline.run_id}
            </h2>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm max-h-96 overflow-y-auto whitespace-pre-wrap border border-gray-700">
              {selectedPipeline.logs.map((log, idx) => (
                <div key={idx}>
                  <p>
                    <b>▶️ {log.command}</b>
                  </p>
                  <pre>{log.output.trim()}</pre>
                  <hr className="my-2 border-gray-700" />
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedPipeline(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




