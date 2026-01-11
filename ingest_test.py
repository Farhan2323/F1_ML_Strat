import fastf1
import pandas as pd

fastf1.Cache.enable_cache('cache') 

print("Loading 2023 Bahrain Grand Prix data...")
session = fastf1.get_session(2023, 'Bahrain', 'R')
session.load()

laps = session.laps

ver_laps = laps.pick_driver('VER')

columns_needed = [
    'LapNumber', 
    'LapTime', 
    'Compound',     # Soft, Medium, Hard
    'TyreLife',     # How old are the tires?
    'FreshTyre',    # Was it a new set?
    'Stint',        # Which stint of the race?
    'TrackStatus'   # 1 = Green, anything else = SC/VSC/Yellow
]

clean_laps = ver_laps.pick_quicklaps().reset_index()
clean_laps['LapTimeSeconds'] = clean_laps['LapTime'].dt.total_seconds()

print(f"\nExtracted {len(clean_laps)} clean laps for Verstappen.")
print(clean_laps[columns_needed + ['LapTimeSeconds']].head())

clean_laps[columns_needed + ['LapTimeSeconds']].to_csv("verstappen_bahrain_2023.csv")
print("\nSaved to verstappen_bahrain_2023.csv")