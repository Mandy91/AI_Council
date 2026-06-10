from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from langchain_mistralai import ChatMistralAI
from typing import Dict, Any
from models import ModelConfig
import os

# Simulated response for testing without keys
class MockChatModel:
    def __init__(self, model_name: str):
        self.model_name = model_name
        
    def invoke(self, messages: list) -> Any:
        class MockContent:
            def __init__(self, content):
                self.content = content
        return MockContent(f"[{self.model_name}] Simulated response based on input: {messages[-1].content[:50]}...")

def get_llm(config: ModelConfig) -> BaseChatModel | MockChatModel:
    """Returns a LangChain LLM instance or a Mock instance if no key provided."""
    if not config.api_key or config.api_key.lower() == "mock":
        return MockChatModel(config.name)
        
    if config.provider.lower() == "google":
        return ChatGoogleGenerativeAI(model=config.name, google_api_key=config.api_key)
    elif config.provider.lower() == "openai":
        return ChatOpenAI(model=config.name, api_key=config.api_key)
    elif config.provider.lower() == "anthropic":
        return ChatAnthropic(model=config.name, api_key=config.api_key)
    elif config.provider.lower() == "mistral":
        return ChatMistralAI(model=config.name, mistral_api_key=config.api_key)
    else:
        # Fallback to OpenAI-compatible endpoints like Groq/SiliconFlow
        return ChatOpenAI(model=config.name, api_key=config.api_key, base_url="https://api.groq.com/openai/v1")
