"use client";

import { useState } from 'react';
import { Play, Zap, TrendingUp, Clock, Flag, Settings } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    start_compound: "SOFT",
    end_compound: "HARD",
    strategy_type: "single_pit",
    total_laps: 57
  });

  async function runSimulation() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  }

  const compounds = ["SOFT", "MEDIUM", "HARD"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
            <div>
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                F1 RACE STRATEGY
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">MACHINE LEARNING OPTIMIZER</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-red-500" />
                <h2 className="text-2xl font-bold">Race Configuration</h2>
              </div>

              <div className="space-y-6">
                {/* Circuit Info */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Circuit</span>
                  </div>
                  <p className="text-xl font-bold">Bahrain International Circuit</p>
                  <p className="text-sm text-slate-400 mt-1">5.412 km • 57 Laps</p>
                </div>

                {/* Tire Strategy */}
                <div>
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
                    Tire Compound Strategy
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Start Compound</p>
                      <select 
                        value={config.start_compound}
                        onChange={(e) => setConfig({...config, start_compound: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        {compounds.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 mb-2">End Compound</p>
                      <select 
                        value={config.end_compound}
                        onChange={(e) => setConfig({...config, end_compound: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        {compounds.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.start_compound === 'SOFT' ? 'bg-red-500' : config.start_compound === 'MEDIUM' ? 'bg-yellow-500' : 'bg-slate-300'}`}></div>
                      <span>{config.start_compound}</span>
                    </div>
                    <div className="w-8 h-px bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.end_compound === 'SOFT' ? 'bg-red-500' : config.end_compound === 'MEDIUM' ? 'bg-yellow-500' : 'bg-slate-300'}`}></div>
                      <span>{config.end_compound}</span>
                    </div>
                  </div>
                </div>

                {/* Run Button */}
                <button 
                  onClick={runSimulation}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>OPTIMIZING STRATEGY...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>RUN OPTIMIZATION</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Model</span>
                </div>
                <p className="text-lg font-bold">Neural Network</p>
                <p className="text-xs text-slate-500 mt-1">Deep RL Optimizer</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span>
                </div>
                <p className="text-lg font-bold">{loading ? 'Computing' : result ? 'Complete' : 'Ready'}</p>
                <p className="text-xs text-slate-500 mt-1">{loading ? 'Processing...' : result ? 'Strategy found' : 'Awaiting input'}</p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Flag className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">Optimal Strategy Found</h3>
                    <p className="text-sm text-green-300/70">AI-Powered Race Analysis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pit Lap */}
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                    <p className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Optimal Pit Window</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-green-400 tabular-nums">
                        {result.optimal_pit_lap}
                      </span>
                      <span className="text-2xl text-slate-400 font-medium">LAP</span>
                    </div>
                    <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                        style={{width: `${(result.optimal_pit_lap / config.total_laps) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Race Time */}
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                    <p className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Projected Race Time</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white tabular-nums">
                        {result.total_race_time.toFixed(3)}
                      </span>
                      <span className="text-xl text-slate-400 font-medium">seconds</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Optimized for minimum lap time</span>
                    </div>
                  </div>

                  {/* Strategy Breakdown */}
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                    <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">Strategy Breakdown</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Stint 1 ({config.start_compound})</span>
                        <span className="font-bold text-white">{result.optimal_pit_lap} laps</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Stint 2 ({config.end_compound})</span>
                        <span className="font-bold text-white">{config.total_laps - result.optimal_pit_lap} laps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/30 backdrop-blur-xl p-12 rounded-2xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <Play className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-400 mb-3">Ready to Optimize</h3>
                <p className="text-slate-500 max-w-sm">
                  Configure your race parameters and run the optimization to discover the optimal pit stop strategy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}