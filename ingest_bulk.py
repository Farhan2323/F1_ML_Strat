import fastf1
import pandas as pd

# 1. SETUP
fastf1.Cache.enable_cache('cache') 
session = fastf1.get_session(2023, 'Bahrain', 'R')
session.load()
laps = session.laps

# 2. FILTERING (Block 2 logic)
# Pick only Green Flag laps (TrackStatus = '1')
# Also remove "In laps" and "Out laps" which are inherently slow
race_laps = laps.pick_quicklaps() # FastF1 helper that handles in/out laps + safety cars automatically
race_laps = race_laps.reset_index(drop=True)

# 3. TRANSFORMATION (Block 3 logic)
race_laps['LapTimeSeconds'] = race_laps['LapTime'].dt.total_seconds()

# Select the features we need for ML
features = [
    'Driver', 
    'LapNumber', 
    'LapTimeSeconds', 
    'Compound', 
    'TyreLife', 
    'Team'
]

final_df = race_laps[features]

# Remove any rows that might still have NaNs (empty values)
final_df = final_df.dropna()

print(f"Data ready! Shape: {final_df.shape}")
print(final_df.head())

# Save for the next step (ML)
final_df.to_csv("bahrain_2023_clean.csv", index=False)