import asyncio
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage
from typing import TypedDict, Dict, List, Any
from models import ModelConfig
from api_clients import get_llm
import json

class GraphState(TypedDict):
    prompt: str
    models_config: List[ModelConfig]
    judge_config: ModelConfig
    round_1_answers: Dict[str, str]
    round_2_critiques: Dict[str, str]
    final_decree: str

async def async_invoke_llm(llm, prompt: str) -> str:
    # A wrapper to invoke LLM asynchronously
    try:
        # LangChain chat models support ainvoke, but since Mock doesn't, we handle it
        if hasattr(llm, 'ainvoke'):
            resp = await llm.ainvoke([HumanMessage(content=prompt)])
            return resp.content
        else:
            # Fallback for sync or mock models
            resp = llm.invoke([HumanMessage(content=prompt)])
            return resp.content
    except Exception as e:
        return f"Error connecting to model: {str(e)}"

async def divergent_round(state: GraphState) -> GraphState:
    prompt = state["prompt"]
    models = state["models_config"]
    
    tasks = []
    names = []
    for m in models:
        llm = get_llm(m)
        tasks.append(async_invoke_llm(llm, prompt))
        names.append(m.name)
        
    results = await asyncio.gather(*tasks)
    
    answers = {names[i]: results[i] for i in range(len(names))}
    return {"round_1_answers": answers}

async def critique_round(state: GraphState) -> GraphState:
    prompt = state["prompt"]
    models = state["models_config"]
    answers = state["round_1_answers"]
    
    # Compile transcript
    transcript = f"Original Prompt: {prompt}\n\nRound 1 Answers:\n"
    for m, a in answers.items():
        transcript += f"\n--- {m} ---\n{a}\n"
        
    critique_prompt = transcript + "\n\nInstruction: Review the answers from the other models. Identify logical flaws or weaknesses in their positions and refine your own stance. Provide your critique."
    
    tasks = []
    names = []
    for m in models:
        llm = get_llm(m)
        tasks.append(async_invoke_llm(llm, critique_prompt))
        names.append(m.name)
        
    results = await asyncio.gather(*tasks)
    critiques = {names[i]: results[i] for i in range(len(names))}
    return {"round_2_critiques": critiques}

async def consensus_round(state: GraphState) -> GraphState:
    prompt = state["prompt"]
    answers = state["round_1_answers"]
    critiques = state["round_2_critiques"]
    judge_config = state["judge_config"]
    
    transcript = f"Original Prompt: {prompt}\n\nRound 1 Answers:\n"
    for m, a in answers.items():
        transcript += f"\n--- {m} ---\n{a}\n"
        
    transcript += "\n\nRound 2 Critiques:\n"
    for m, c in critiques.items():
        transcript += f"\n--- {m} ---\n{c}\n"
        
    consensus_prompt = transcript + "\n\nInstruction: You are the Judge. Synthesize the transcript of this debate into a single, cohesive 'Decree of the Council'. Resolve any conflicts logically and present the absolute best final answer."
    
    judge_llm = get_llm(judge_config)
    final_decree = await async_invoke_llm(judge_llm, consensus_prompt)
    
    return {"final_decree": final_decree}

def create_debate_graph():
    workflow = StateGraph(GraphState)
    
    workflow.add_node("divergent", divergent_round)
    workflow.add_node("critique", critique_round)
    workflow.add_node("consensus", consensus_round)
    
    workflow.set_entry_point("divergent")
    workflow.add_edge("divergent", "critique")
    workflow.add_edge("critique", "consensus")
    workflow.add_edge("consensus", END)
    
    return workflow.compile()
