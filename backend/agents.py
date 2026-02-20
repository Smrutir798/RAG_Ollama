import json
from llm_client import LLMClient

class RouterAgent:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client

    def route_query(self, query: str) -> str:
        """
        Decides if the query needs RAG research or is a simple conversational greeting/chitchat.
        Returns: "RAG_RESEARCH" or "DIRECT_ANSWER"
        """
        system_prompt = """
        You are an intent classifier for a medical AI.
        Classify the user's query into one of two categories:
        
        1. "RAG_RESEARCH": Steps needed to answer medical, biological, health, or factual questions.
        2. "DIRECT_ANSWER": For greetings, compliments, "who are you", or simple queries not needing external retrieval.
        
        OUTPUT FORMAT:
        { "intent": "RAG_RESEARCH" } or { "intent": "DIRECT_ANSWER" }
        """
        
        result = self.llm.invoke_agent(system_prompt, query)
        return result.get("intent", "RAG_RESEARCH") # Default to research for safety

class RetrievalAgent:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        
    def generate_queries(self, query: str) -> list:
        """
        Generates optimized search queries for the RAG engine.
        """
        system_prompt = """
        You are a medical search expert.
        Generate 3 diverse search queries to retrieve relevant medical information for the user's request.
        Focus on medical terminology, synonyms, and related conditions.
        
        OUTPUT FORMAT:
        { "queries": ["query 1", "query 2", "query 3"] }
        """
        
        result = self.llm.invoke_agent(system_prompt, query)
        return result.get("queries", [query])

class AnswerAgent:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        
    def generate_response(self, query: str, context: list, risk_level: str, intent: str = "RAG_RESEARCH") -> dict:
        """
        Synthesizes the final answer using retrieved context and risk awareness.
        """
        
        if intent == "DIRECT_ANSWER":
            system_prompt = """
            You are a helpful, friendly healthcare assistant.
            The user has asked a conversational question (greeting, identity, etc.).
            Answer politely and professionally. Do not make up medical facts.
            
            OUTPUT JSON:
            {
                "answer_summary": "Your polite response.",
                "detailed_explanation": "",
                "confidence_score": "High",
                "evidence_used": []
            }
            """
            return self.llm.invoke_agent(system_prompt, query)

        # RAG RESEARCH MODE
        context_str = "\n\n".join([f"Source ({c['source']}): {c['content']}" for c in context])
        
        system_prompt = f"""
        You are a safe, evidence-based healthcare assistant.
        Risk Level of Query: {risk_level}
        
        GOAL: Answer using ONLY the provided document context.
        
        RULES:
        1. DO NOT provide medical diagnosis or treatment.
        2. If evidence is insufficient, state that clearly.
        3. Cite sources specifically (e.g., "(WHO, 2024)").
        4. Maintain a professional, empathetic tone.
        
        OUTPUT JSON:
        {{
            "answer_summary": "Concise answer (max 3 sentences).",
            "detailed_explanation": "Thorough explanation with citations.",
            "confidence_score": "High/Medium/Low",
            "evidence_used": ["List of facts/quotes used"]
        }}
        """
        
        user_msg = f"Query: {query}\n\nDocument Context:\n{context_str}"
        return self.llm.invoke_agent(system_prompt, user_msg)
