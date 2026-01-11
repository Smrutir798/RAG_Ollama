from agents import RouterAgent, RetrievalAgent, AnswerAgent
from llm_client import LLMClient
from rag_engine import RAGEngine

class Orchestrator:
    def __init__(self, rag_engine: RAGEngine, llm_client: LLMClient):
        self.rag = rag_engine
        self.llm = llm_client
        
        # Initialize Agents
        self.router = RouterAgent(llm_client)
        self.retriever = RetrievalAgent(llm_client)
        self.answer_gen = AnswerAgent(llm_client)

    async def process_query(self, query: str, risk_level: str) -> dict:
        """
        Orchestrates the entire query lifecycle.
        """
        print(f"--- Processing Query: {query} (Risk: {risk_level}) ---")
        
        # 1. Route Intent
        intent = self.router.route_query(query)
        print(f"Detected Intent: {intent}")
        
        if intent == "DIRECT_ANSWER":
            # Just use LLM directly without RAG context
            return self.answer_gen.generate_response(query, [], risk_level, intent="DIRECT_ANSWER")

        # 2. Retrieval Research (Intent == "RAG_RESEARCH")
        search_queries = self.retriever.generate_queries(query)
        print(f"Generated Search Queries: {search_queries}")
        
        # Aggregate results
        all_docs = []
        seen_content = set()
        
        # Search for each generated query
        for q in search_queries:
            docs = self.rag.search(q, k=2) # Get top 2 for each expansion
            for d in docs:
                # Deduplicate based on content preview (first 50 chars)
                sig = d['content'][:50]
                if sig not in seen_content:
                    all_docs.append(d)
                    seen_content.add(sig)
        
        # 3. Answer Generation
        # If no docs found after expansion, try original query once
        if not all_docs:
             all_docs = self.rag.search(query, k=3)
        
        if not all_docs:
             return {
                "answer_summary": "Insufficient evidence found.",
                "detailed_explanation": "I could not find relevant medical documents to support an answer.",
                "confidence_score": "Low",
                "evidence_used": [],
                "is_safe": True
            }

        response = self.answer_gen.generate_response(query, all_docs, risk_level)
        
        # Merge source docs into response for UI
        response["evidence"] = all_docs[:4] # Limit to top 4 unique
        response["is_safe"] = True
        
        return response
