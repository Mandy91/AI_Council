# Studio Agents: The Council

## Included Agents
- **Judge Agent**: Synthesizes the transcript of the debate into a single, cohesive "Decree of the Council".
- **Debater Agents**: Top-tier LLMs (Gemini, GPT-5.4, Claude 4.6, Mistral Large, Muse Spark/Llama 4) that participate in the divergent and critique rounds.

## Maintenance Guidelines
- Update API endpoints and model names in the `backend/api_clients.py` file as newer models are released.
- The Keys Vault relies on standard header authentication. Any new LLM addition must follow the established authentication pattern in `api_clients.py`.
