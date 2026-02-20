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
            return self.answer_gen.generate_response(query, [], risk_level, intent="DIRECT_ANSWER")

        # 2. Retrieval Research (Intent == "RAG_RESEARCH")
        search_queries = self.retriever.generate_queries(query)
        print(f"Generated Search Queries: {search_queries}")
        
        # 3. Vector search with deduplication
        all_docs = []
        seen_content = set()
        
        for q in search_queries:
            docs = self.rag.search(q, k=3)
            for d in docs:
                sig = d['content'][:50]
                if sig not in seen_content:
                    d["retrieval_method"] = "vector"
                    all_docs.append(d)
                    seen_content.add(sig)

        # 4. Fallback
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

        # 5. Answer generation
        response = self.answer_gen.generate_response(query, all_docs, risk_level)
        
        # Compute confidence from retrieval scores
        if all_docs:
            avg_score = sum(d.get("score", 0) for d in all_docs) / len(all_docs)
            top_score = max(d.get("score", 0) for d in all_docs)
            # Weighted: 60% top score, 40% average
            combined = 0.6 * top_score + 0.4 * avg_score
            if combined >= 0.55:
                computed_confidence = "High"
            elif combined >= 0.35:
                computed_confidence = "Medium"
            else:
                computed_confidence = "Low"
            response["confidence_score"] = computed_confidence
        
        # Merge source docs into response for UI
        response["evidence"] = all_docs[:4] # Limit to top 4 unique
        response["is_safe"] = True
        
        return response
