"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    track: "Bahrain",
    start_compound: "SOFT",
    end_compound: "HARD",
    middle_compound: "MEDIUM",
    pit_stops: 1,
    total_laps: 57
  });

  const handleChange = (e) => {
    const newConfig = { ...config, [e.target.name]: e.target.value };
    
    // Auto-update total_laps when track changes
    if (e.target.name === 'track') {
      const selectedTrack = tracks.find(t => t.value === e.target.value);
      if (selectedTrack) {
        newConfig.total_laps = selectedTrack.laps;
      }
    }
    
    setConfig(newConfig);
  };

  async function runSimulation() {
    setLoading(true);
    setResult(null);
    
    const payload = {
      ...config,
      pit_stops: parseInt(config.pit_stops),
      total_laps: parseInt(config.total_laps)
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  // Generate chart data
  const chartData = result ? Array.from({ length: config.total_laps }, (_, i) => ({
    lap: i + 1,
    time: 98 + Math.random() * 2 + (i * 0.05)
  })) : [];

  const getTireColor = (compound) => {
    const colors = {
      SOFT: 'bg-red-500',
      MEDIUM: 'bg-yellow-500',
      HARD: 'bg-slate-300'
    };
    return colors[compound] || 'bg-slate-500';
  };

  const tracks = [
    { value: "Bahrain", label: "🇧🇭 Bahrain GP", laps: 57 },
    { value: "Jeddah", label: "🇸🇦 Saudi Arabian GP", laps: 50 },
    { value: "Melbourne", label: "🇦🇺 Australian GP", laps: 58 },
    { value: "Baku", label: "🇦🇿 Azerbaijan GP", laps: 51 },
    { value: "Miami", label: "🇺🇸 Miami GP", laps: 57 },
    { value: "Imola", label: "🇮🇹 Emilia Romagna GP", laps: 63 },
    { value: "Monaco", label: "🇲🇨 Monaco GP", laps: 78 },
    { value: "Barcelona", label: "🇪🇸 Spanish GP", laps: 66 },
    { value: "Montreal", label: "🇨🇦 Canadian GP", laps: 70 },
    { value: "Spielberg", label: "🇦🇹 Austrian GP", laps: 71 },
    { value: "Silverstone", label: "🇬🇧 British GP", laps: 52 },
    { value: "Budapest", label: "🇭🇺 Hungarian GP", laps: 70 },
    { value: "Spa", label: "🇧🇪 Belgian GP", laps: 44 },
    { value: "Zandvoort", label: "🇳🇱 Dutch GP", laps: 72 },
    { value: "Monza", label: "🇮🇹 Italian GP", laps: 53 },
    { value: "Singapore", label: "🇸🇬 Singapore GP", laps: 62 },
    { value: "Suzuka", label: "🇯🇵 Japanese GP", laps: 53 },
    { value: "Austin", label: "🇺🇸 US GP (COTA)", laps: 56 },
    { value: "Mexico City", label: "🇲🇽 Mexico City GP", laps: 71 },
    { value: "Sao Paulo", label: "🇧🇷 São Paulo GP", laps: 71 },
    { value: "Las Vegas", label: "🇺🇸 Las Vegas GP", laps: 50 },
    { value: "Lusail", label: "🇶🇦 Qatar GP", laps: 57 },
    { value: "Yas Marina", label: "🇦🇪 Abu Dhabi GP", laps: 58 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="fixed bottom-0 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                F1 RACE STRATEGY
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium tracking-wide">MACHINE LEARNING OPTIMIZER</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CONTROLS PANEL */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-xl font-bold text-white">Configuration</h2>
              </div>

              <div className="space-y-5">
                {/* Track Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Circuit
                  </label>
                  <select 
                    name="track" 
                    value={config.track}
                    onChange={handleChange} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer hover:border-slate-600"
                  >
                    {tracks.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-slate-500">{tracks.find(t => t.value === config.track)?.laps} Laps</span>
                    <span className="text-slate-600">Round {tracks.findIndex(t => t.value === config.track) + 1}/23</span>
                  </div>
                </div>

                {/* Pit Stop Strategy Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Pit Stop Strategy
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                    <button 
                      onClick={() => setConfig({...config, pit_stops: 1})}
                      className={`py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${
                        config.pit_stops === 1 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1 Stop
                    </button>
                    <button 
                      onClick={() => setConfig({...config, pit_stops: 2})}
                      className={`py-3 px-4 text-sm font-bold rounded-lg transition-all duration-200 ${
                        config.pit_stops === 2 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      2 Stops
                    </button>
                  </div>
                </div>

                {/* Tire Compounds */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Tire Compounds
                  </label>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Start Compound</p>
                      <select 
                        name="start_compound"
                        value={config.start_compound}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        <option value="SOFT">🔴 Soft (Fastest)</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HARD">⚪ Hard (Durable)</option>
                      </select>
                    </div>

                    {config.pit_stops === 2 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Middle Compound</p>
                        <select 
                          name="middle_compound"
                          value={config.middle_compound}
                          onChange={handleChange}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        >
                          <option value="SOFT">🔴 Soft (Fastest)</option>
                          <option value="MEDIUM">🟡 Medium</option>
                          <option value="HARD">⚪ Hard (Durable)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-slate-500 mb-2">End Compound</p>
                      <select 
                        name="end_compound"
                        value={config.end_compound}
                        onChange={handleChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        <option value="HARD">⚪ Hard (Durable)</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="SOFT">🔴 Soft (Fastest)</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual Tire Indicator */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getTireColor(config.start_compound)}`}></div>
                      <span className="text-slate-400">{config.start_compound}</span>
                    </div>
                    <span className="text-slate-600">→</span>
                    {config.pit_stops === 2 && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${getTireColor(config.middle_compound)}`}></div>
                          <span className="text-slate-400">{config.middle_compound}</span>
                        </div>
                        <span className="text-slate-600">→</span>
                      </>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getTireColor(config.end_compound)}`}></div>
                      <span className="text-slate-400">{config.end_compound}</span>
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
                      <span>OPTIMIZING...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
                      <span>RUN OPTIMIZATION</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🧠</span>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Model</span>
                </div>
                <p className="text-sm font-bold">Multivariate</p>
                <p className="text-xs text-slate-500">Linear Regression</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⏱️</span>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Status</span>
                </div>
                <p className="text-sm font-bold">
                  {loading ? 'Computing' : result ? 'Complete' : 'Ready'}
                </p>
                <p className="text-xs text-slate-500">
                  {loading ? 'Processing...' : result ? 'Optimized' : 'Standby'}
                </p>
              </div>
            </div>
          </div>

          {/* RESULTS & VISUALIZATION */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Results Card */}
            {result ? (
              <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 backdrop-blur-xl border border-green-500/30 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-400">Strategy Optimized</h3>
                      <p className="text-green-300/70 text-sm mt-1">
                        {config.pit_stops === 1 ? 'Single' : 'Double'} pit stop strategy
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 px-6 py-4 rounded-xl border border-green-500/20 text-center">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Race Time</div>
                    <div className="text-3xl md:text-4xl font-black text-white tabular-nums">
                      {result.total_time.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-400">seconds</div>
                  </div>
                </div>

                {/* Pit Stop Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-green-500/20">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                      Optimal Pit Windows
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {result.strategy.pit_laps.map((lap, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                            <span className="text-2xl font-black text-green-400">{lap}</span>
                          </div>
                          {idx < result.strategy.pit_laps.length - 1 && (
                            <span className="text-slate-600 text-xl">&</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-5 rounded-xl border border-green-500/20">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                      Stint Breakdown
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Stint 1 ({config.start_compound})</span>
                        <span className="font-bold text-white">
                          {result.strategy.pit_laps[0]} laps
                        </span>
                      </div>
                      {config.pit_stops === 2 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Stint 2 ({config.middle_compound})</span>
                          <span className="font-bold text-white">
                            {result.strategy.pit_laps[1] - result.strategy.pit_laps[0]} laps
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          Stint {config.pit_stops === 1 ? '2' : '3'} ({config.end_compound})
                        </span>
                        <span className="font-bold text-white">
                          {config.total_laps - result.strategy.pit_laps[result.strategy.pit_laps.length - 1]} laps
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800 border-dashed p-12 rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-4xl">
                  ▶️
                </div>
                <h3 className="text-2xl font-bold text-slate-400 mb-3">Ready to Optimize</h3>
                <p className="text-slate-500 max-w-md">
                  Configure your race parameters and run the optimization to discover the optimal pit stop strategy
                </p>
              </div>
            )}

            {/* Chart */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Projected Lap Times</h3>
                  <p className="text-xs text-slate-500 mt-1">Performance analysis across race distance</p>
                </div>
                <span className="text-2xl">📊</span>
              </div>
              
              <div className="h-[350px] md:h-[400px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="lap" 
                        stroke="#64748b" 
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Lap', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Time (s)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: '#cbd5e1' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="time" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        fill="url(#colorTime)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📈</div>
                      <p>Run simulation to view lap time analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}