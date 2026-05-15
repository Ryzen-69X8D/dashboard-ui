import { useState } from "react";
import apiClient from "../services/apiClient";

export function usePredict() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runPrediction(payload) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data } = await apiClient.post("/predict", payload);
      setResult(data);
      return data;
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Prediction failed";
      setError(detail);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { result, error, loading, runPrediction };
}
