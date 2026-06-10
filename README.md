# The Council ⚖️🤖

**The Council** is a full-stack, enterprise-ready Multi-Agent Debate (MAD) platform. It allows users to submit complex problems and orchestrate a 3-round collaborative debate between top-tier Large Language Models (LLMs) to reach a verified, logical consensus.

![The Council Dashboard Preview](https://via.placeholder.com/1200x600.png?text=The+Council+-+Multi-LLM+Mission+Control)

## Features

- **Mission Control UI**: A sleek, dark-mode dashboard built with Next.js 16 to monitor the live telemetry of the debate in real-time.
- **The Keys Vault**: A secure client-side API key manager. Keys are never persistently stored on the backend, ensuring maximum privacy.
- **Multi-LLM Orchestration**: Powered by FastAPI and LangGraph, the backend concurrently manages agents representing Google Gemini, OpenAI GPT, Anthropic Claude, Mistral, and Meta Llama.
- **Debate Workflow**:
  1. **Divergent Round**: All selected LLMs answer the problem independently.
  2. **Critique Round**: LLMs review each other's answers, finding logical flaws and refining their own stances.
  3. **Consensus Round**: A "Judge" model synthesizes the transcript into a final "Decree of the Council".

## Architecture

- **Frontend**: Next.js 16 (App Router), React, Vanilla CSS
- **Backend**: FastAPI (Python), LangGraph, LangChain, WebSockets
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed.
- (Optional) API Keys for Gemini, OpenAI, Anthropic, Mistral, or Meta if you want to run real inferences.

### Run with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Mandy91/AI_Council.git
   cd AI_Council
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Run Locally (Without Docker)

**1. Start the Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:3000`.

## Testing Offline / Mock Mode

If you don't want to use real API keys or want to test the UI flow quickly, you can use the built-in mock mode.
1. Go to the **Keys Vault** in the UI.
2. Enter the exact word `mock` as the API key for any provider.
3. Start the debate! The system will simulate the responses instantly without making network calls.

## Project Structure
```text
AI_Council/
├── backend/                  # FastAPI Application
│   ├── main.py               # WebSocket & REST endpoints
│   ├── graph.py              # LangGraph multi-agent logic
│   ├── api_clients.py        # LLM provider configurations
│   ├── models.py             # Pydantic schemas
│   └── Dockerfile            # Backend container config
├── frontend/                 # Next.js 16 Application
│   ├── src/app/              # Next.js routing & global CSS
│   ├── src/components/       # React components (MissionControl, KeysVault)
│   └── Dockerfile            # Frontend standalone container config
├── .agent/                   # Internal agent documentation
└── docker-compose.yml        # Root compose file for local orchestration
```

## License

This project is licensed under the MIT License.
