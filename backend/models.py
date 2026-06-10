from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ModelConfig(BaseModel):
    name: str
    provider: str
    api_key: str

class DebateRequest(BaseModel):
    prompt: str
    models: List[ModelConfig]
    judge: ModelConfig

class DebateResponse(BaseModel):
    final_decree: str

class DebateState(BaseModel):
    prompt: str
    selected_models: List[str]
    round_1_answers: Dict[str, str] = Field(default_factory=dict)
    round_2_critiques: Dict[str, str] = Field(default_factory=dict)
    final_decree: str = ""
    status: str = "initialized"
