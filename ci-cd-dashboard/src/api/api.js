// src/api/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // backend server URL

// 🧩 1️⃣ Fetch all saved pipelines from DB
export const getPipelines = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pipelines`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pipelines:", error.message);
    return [];
  }
};

// 🧩 2️⃣ Trigger a new pipeline run
export const runPipeline = async (steps) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/run-pipeline`, { steps });
    return response.data;
  } catch (error) {
    console.error("Error running pipeline:", error.message);
    return { status: "failed", error: error.message };
  }
};

// 🧩 3️⃣ Fetch a single pipeline by run_id
export const getPipelineById = async (runId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pipelines/${runId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pipeline ${runId}:`, error.message);
    return null;
  }
};
