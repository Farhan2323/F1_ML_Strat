from simulation import RaceSimulator
import matplotlib.pyplot as plt

# Initialize
sim = RaceSimulator()
results = []
best_time = float('inf')  # Start with infinity so the first result is always lower
best_lap = -1

possible_pit_laps = range(10, 51)

for pit_lap in possible_pit_laps:
    # Run the simulation
    current_total_time = sim.simulate_race(
        total_laps=57, 
        start_compound='SOFT', 
        pit_stop_lap=pit_lap, 
        end_compound='HARD'
    )
    
    # Store for plotting
    results.append(current_total_time)
    if current_total_time < best_time:
        best_time = current_total_time
        best_lap = pit_lap
    

print(f"\nOPTIMAL STRATEGY FOUND:")
print(f"Pit at Lap {best_lap}")
print(f"Total Time: {best_time:.2f}s")
print(f"Improvement over Lap 20: {5653.47 - best_time:.2f}s")

# Visualization (Bonus)
plt.figure(figsize=(10, 6))
plt.plot(possible_pit_laps, results, marker='o')
plt.title('Pit Stop Strategy Optimization')
plt.xlabel('Pit Stop Lap')
plt.ylabel('Total Race Time (s)')
plt.grid(True)
plt.savefig('strategy_optimization.png')
