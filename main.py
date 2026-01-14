from fastapi import FastAPI
from pydantic import BaseModel
from simulation import RaceSimulator
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow the frontend to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # The address of your React app
    allow_credentials=True,
    allow_methods=["*"], # Allow all (GET, POST, etc.)
    allow_headers=["*"],
)

# Initialize the simulator ONCE when the server starts
# (loading the model takes time, we don't want to do it for every request)
sim = RaceSimulator()

class StrategyRequest(BaseModel):
    # variable_name: type
    start_compound: str
    end_compound: str
    strategy_type: str = "single_pit"  # default value
    total_laps: int = 57  # bahrain default

@app.post("/optimize")
def optimize_strategy(request: StrategyRequest):
    print(f"Received request: {request}")
    
    # We will hardcode 57 laps for Bahrain for now
    total_laps = 57
    best_time = float('inf')
    best_lap = -1
    
    # Run the optimization loop (just like in optimize.py)
    # We test pitting between Lap 10 and 50
    for pit_lap in range(10, 51):
        time = sim.simulate_race(
            total_laps, 
            request.start_compound, 
            pit_lap, 
            request.end_compound
        )
        
        if time < best_time:
            best_time = time
            best_lap = pit_lap
            
    return {
        "track": "Bahrain",
        "optimal_pit_lap": best_lap,
        "total_race_time": best_time,
        "strategy": f"{request.start_compound} -> {request.end_compound}"
    }

@app.get("/")
def home():
    return {"message": "F1 Strategy API is Online 🏎️"}