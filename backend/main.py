from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from models import DebateRequest, DebateState
from graph import create_debate_graph

app = FastAPI(title="The Council API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

debate_graph = create_debate_graph()

@app.get("/")
def read_root():
    return {"status": "The Council is in session"}

@app.websocket("/ws/debate")
async def debate_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        request_data = json.loads(data)
        req = DebateRequest(**request_data)
        
        initial_state = {
            "prompt": req.prompt,
            "models_config": req.models,
            "judge_config": req.judge,
            "round_1_answers": {},
            "round_2_critiques": {},
            "final_decree": ""
        }
        
        await websocket.send_text(json.dumps({"stage": "initialized", "message": "Debate initialized"}))
        
        # We manually drive the graph to send WebSocket updates per stage
        # Since LangGraph async streams events, we can use astream
        
        async for output in debate_graph.astream(initial_state):
            for node_name, state_update in output.items():
                await websocket.send_text(json.dumps({
                    "stage": node_name,
                    "update": state_update
                }))
                
        await websocket.send_text(json.dumps({"stage": "completed", "message": "Debate completed"}))
        
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
