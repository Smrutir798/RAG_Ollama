from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
import json
import re

class LLMClient:
    def __init__(self, model_name="llama3.1"):
        self.llm = ChatOllama(model=model_name, temperature=0.2, format="json")
    
    def invoke_agent(self, system_prompt: str, user_message: str) -> dict:
        """
        Generic method to invoke the LLM with a specific system prompt.
        Expects JSON output from the LLM.
        """
        try:
            response = self.llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message)
            ])
            
            content = response.content
            try:
                # Find JSON substring if permissible
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group(0))
                else:
                    data = json.loads(content)
                return data
            except json.JSONDecodeError:
                return {"error": "Failed to parse JSON", "raw_content": content}
                
        except Exception as e:
            print(f"LLM Error: {e}")
            return {"error": str(e)}

    def generate_response(self, query: str, context_chunks: list) -> dict:
        """
        Legacy method kept for backward compatibility if needed, 
        or we can refactor agents to use it.
        """
        # ... (Same implementation as AnswerAgent will use)
        # For now, let's keep it but rely on agents.py
        pass
