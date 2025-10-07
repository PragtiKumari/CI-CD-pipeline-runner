// src/components/PipelineForm.jsx
import React, { useState } from "react";

export default function PipelineForm({ onRun }) {
  const [commands, setCommands] = useState(["echo Hello", "dir"]);

  const handleAddCommand = () => setCommands([...commands, ""]);

  const handleChange = (index, value) => {
    const updated = [...commands];
    updated[index] = value;
    setCommands(updated);
  };

  const handleRun = () => {
    const steps = commands
      .filter((cmd) => cmd.trim() !== "")
      .map((cmd) => ({ run: cmd }));
    onRun(steps);
  };

  return (
    <div className="bg-white border rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-blue-700">
        Run a New Pipeline
      </h2>

      {commands.map((cmd, idx) => (
        <input
          key={idx}
          value={cmd}
          onChange={(e) => handleChange(idx, e.target.value)}
          placeholder="Enter command..."
          className="w-full mb-2 p-2 border rounded"
        />
      ))}

      <div className="flex gap-3">
        <button
          onClick={handleAddCommand}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ➕ Add Command
        </button>

        <button
          onClick={handleRun}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🚀 Run Pipeline
        </button>
      </div>
    </div>
  );
}
