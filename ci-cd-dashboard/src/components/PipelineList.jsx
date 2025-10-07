// src/components/PipelineList.jsx
import React from "react";

export default function PipelineList({ pipelines, onView }) {
  if (!pipelines.length)
    return <p className="text-gray-500 text-center">No pipelines found yet.</p>;

  return (
    <div
      className="mt-4 border border-gray-200 rounded-lg shadow"
      style={{
        maxHeight: "200px",      // ✅ only ~5 rows visible
        overflowY: "auto",       // ✅ vertical scroll enabled
        overflowX: "hidden",
      }}
    >
      <table className="min-w-full bg-white rounded-lg">
        <thead
          className="bg-blue-600 text-white sticky top-0 z-10"
          style={{ position: "sticky", top: 0, backgroundColor: "#2563eb" }}
        >
          <tr>
            <th className="px-4 py-2 text-left">Run ID</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Steps</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {pipelines.map((pipe) => (
            <tr key={pipe.run_id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-sm truncate max-w-[160px]">
                {pipe.run_id}
              </td>

              <td
                className={`px-4 py-2 font-semibold ${
                  pipe.status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {pipe.status}
              </td>

              <td className="px-4 py-2">
                ✅ {pipe.successful_steps} / ❌ {pipe.failed_steps}
              </td>

              <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap">
                {pipe.created_at
                  ? new Date(pipe.created_at).toLocaleString()
                  : "—"}
              </td>

              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onView(pipe.run_id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
                >
                  View Logs
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
