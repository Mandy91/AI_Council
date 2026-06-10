# Architecture: The Council - Multi-LLM Consensus Platform

## Overview
"The Council" is a full-stack web application designed for multi-agent collaborative debate. It orchestrates top-tier LLMs to critique each other's responses and reach a final consensus.

## Components
1. **Frontend (Next.js 16)**
   - **Mission Control**: Real-time websocket-based UI to track the debate in real time.
   - **Keys Vault**: Manages secure connection to LLM APIs from the client side without persistent storage on the backend.
   - **Artifact View**: Displays the final output "Decree of the Council".

2. **Backend (FastAPI)**
   - **WebSocket Endpoint**: Streams live updates of the LangGraph execution.
   - **LangGraph State Machine**:
     - *Node 1 (Divergent)*: Sends problem to multiple LLMs simultaneously.
     - *Node 2 (Critique)*: Sends the compiled round 1 answers to all LLMs for critique.
     - *Node 3 (Consensus)*: A Judge model synthesizes the critiques into a final answer.
   - **API Client**: Handles connections to multiple providers (OpenAI, Anthropic, Google, etc.).

## Communication Flow
- Client connects to WebSocket and submits prompt + API keys.
- FastAPI initializes a LangGraph thread.
- Graph execution yields events which are sent via WebSocket to the client.
- Final output is sent upon graph completion.
