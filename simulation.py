import joblib
import pandas as pd

class RaceSimulator:
    def __init__(self, model_file='f1_lap_time_model.pkl'):
        # Load the brain (Model) and the memory (Columns)
        data = joblib.load(model_file)
        self.model = data['model']
        self.model_columns = data['columns']
        
    def predict_lap_time(self, lap_number, tyre_life, compound):
        # 1. Create a dictionary for the current lap's state
        input_data = {
            'LapNumber': lap_number,
            'TyreLife': tyre_life,
            'Compound_HARD': 1 if compound == 'HARD' else 0,
            'Compound_MEDIUM': 1 if compound == 'MEDIUM' else 0,
            'Compound_SOFT': 1 if compound == 'SOFT' else 0
        }
        df = pd.DataFrame([input_data])
        df = df[self.model_columns]
        return self.model.predict(df)[0]

    def simulate_race(self, total_laps, start_compound, pit_stop_lap, end_compound):
        current_compound = start_compound
        current_tyre_life = 0  # Brand new tires
        total_race_time = 0
        
        print(f"--- Simulating Race: {start_compound} -> {end_compound} (Pit: L{pit_stop_lap}) ---")
        
        # LOOP THROUGH EVERY LAP
        for lap in range(1, total_laps + 1):
            if lap == pit_stop_lap:
                current_compound = end_compound
                current_tyre_life = 0
                total_race_time = total_race_time + 20 
            
            lapTime = self.predict_lap_time(lap, current_tyre_life, current_compound)
           
            total_race_time += lapTime
            current_tyre_life += 1
            
            print(f"Lap {lap}: {lapTime:.2f}s | Tire: {current_compound} ({current_tyre_life} laps old)")

        return total_race_time

# Run the simulation
if __name__ == "__main__":
    sim = RaceSimulator()
    # Strategy: Start on SOFT, Pit on Lap 20, Switch to HARD
    final_time = sim.simulate_race(57, 'SOFT', 20, 'HARD')
    print(f"Total Race Time: {final_time:.2f} seconds")