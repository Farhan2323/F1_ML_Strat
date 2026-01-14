"use client";

import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runSimulation() {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_compound: "SOFT",
          end_compound: "HARD",
          strategy_type: "single_pit",
          total_laps: 57
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10 font-mono">
      <h1 className="text-4xl font-bold mb-8 text-red-500">🏎️ F1 Strategy v1.0</h1>
      
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-md border border-slate-700">
        <h2 className="text-xl mb-4">Race Configuration</h2>
        <div className="mb-4 text-gray-400">
          <p>Track: Bahrain (57 Laps)</p>
          {/* The fix is here: &rarr; creates a right arrow */}
          <p>Strategy: Soft &rarr; Hard</p>
        </div>
        
        <button 
          onClick={runSimulation}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Simulating..." : "🚀 Run Simulation"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-8 bg-green-900/30 p-6 rounded-lg border border-green-500/50 max-w-md animate-fade-in">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Strategy Found!</h3>
          <div className="space-y-2">
            <p>🏆 Optimal Pit Lap: <span className="text-xl font-bold">{result.optimal_pit_lap}</span></p>
            <p>⏱️ Total Race Time: <span className="font-mono">{result.total_race_time.toFixed(2)}s</span></p>
          </div>
        </div>
      )}
    </div>
  );
}