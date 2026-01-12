import fastf1
import pandas as pd

# 1. SETUP CACHE
fastf1.Cache.enable_cache('cache')

def get_race_data(year, gp_location):
    print(f"Loading {year} {gp_location} Grand Prix...")
    session = fastf1.get_session(year, gp_location, 'R')
    session.load()
    laps = session.laps

    # 2. FILTERING
    # Pick only Green Flag laps (TrackStatus = '1') & remove in/out laps
    race_laps = laps.pick_quicklaps().reset_index(drop=True)

    # 3. TRANSFORMATION
    race_laps['LapTimeSeconds'] = race_laps['LapTime'].dt.total_seconds()

    # Select features
    features = ['Driver', 'LapNumber', 'LapTimeSeconds', 'Compound', 'TyreLife', 'Team']
    final_df = race_laps[features].dropna()
    
    # 4. ENCODING (One-Hot Encoding for Compounds)
    df_encoded = pd.get_dummies(final_df, columns=['Compound'])
    
    return df_encoded


if __name__ == "__main__":
    data = get_race_data(2023, 'Bahrain')
    print(f"Data Shape: {data.shape}")
    print(data.head())
    
    # Save to CSV so we don't have to download it every time we test the model
    data.to_csv("training_data.csv", index=False)
    print("Saved to training_data.csv")