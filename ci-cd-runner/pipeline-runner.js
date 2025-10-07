const { exec } = require("child_process");

// Example pipeline (steps with commands for Windows)
const pipeline = {
  steps: [
    { run: "echo Hello World" }, // prints Hello World
    { run: "dir" },              // lists files in current folder
    { run: "node --version" }    // shows Node.js version
  ]
};

// Function to run pipeline
async function runPipeline(pipeline) {
  for (let i = 0; i < pipeline.steps.length; i++) {
    const step = pipeline.steps[i];
    console.log(`\n[Step ${i + 1}] ${step.run}`);

    await new Promise((resolve, reject) => {
      exec(step.run, (error, stdout, stderr) => {
        if (stdout) console.log(stdout.trim());
        if (stderr) console.log("Error:", stderr.trim());
        if (error) reject(error);
        else resolve();
      });
    });
  }

  console.log("\n✅ Pipeline finished successfully");
}

// Run the pipeline
runPipeline(pipeline).catch(err => {
  console.log("❌ Pipeline failed:", err.message);
});
