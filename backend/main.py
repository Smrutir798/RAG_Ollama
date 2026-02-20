from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from rag_engine import RAGEngine
from safety import SafetyGuard
from llm_client import LLMClient

from orchestrator import Orchestrator

# Initialize Singletons
rag_engine = RAGEngine()
llm_client = LLMClient()
orchestrator = Orchestrator(rag_engine, llm_client)

class QueryRequest(BaseModel):
    text: str

class QueryResponse(BaseModel):
    answer: str
    explanation: str
    confidence: str
    evidence: List[dict]
    is_safe: bool
    refusal_reason: Optional[str] = None
    risk_level: str  # e.g., Low, Moderate, High
    disclaimer: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure documents are loaded
    if rag_engine.index is None:
        rag_engine._load_documents()
    yield
    # Shutdown: cleanup if needed

app = FastAPI(title="Explainable RAG Healthcare System", version="1.0.0", lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. Restrict in prod.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(('.pdf', '.txt')):
         raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
    
    file_path = os.path.join(rag_engine.data_dir, file.filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
    # Index document
    success, message = rag_engine.add_document(file_path)
    if not success:
         raise HTTPException(status_code=500, detail=message)
         
    return {"message": message, "filename": file.filename}

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    query_text = request.text
    
    # 1. Safety & Risk Check (FAST PATH)
    risk_level, disclaimer = SafetyGuard.classify_risk(query_text)
    
    if risk_level == "High":
        return QueryResponse(
            answer="**EMERGENCY ASSISTANCE REQUIRED**",
            explanation="This query matches symptoms of a life-threatening medical emergency.",
            confidence="High",
            evidence=[],
            is_safe=False,
            refusal_reason="This query implies a medical emergency. Please call 911 immediately.",
            risk_level=risk_level,
            disclaimer=disclaimer
        )
    
    # 2. Agentic Orchestration
    # The orchestrator handles routing, retrieval, and answering
    try:
        response_data = await orchestrator.process_query(query_text, risk_level)
        
        return QueryResponse(
            answer=response_data.get("answer_summary", "Processing Error"),
            explanation=response_data.get("detailed_explanation", ""),
            confidence=response_data.get("confidence_score", "Low"),
            evidence=response_data.get("evidence", []),
            is_safe=True,
            risk_level=risk_level,
            disclaimer=disclaimer
        )
    
    except Exception as e:
        print(f"Orchestrator Error: {e}")
        return QueryResponse(
            answer="An internal error occurred while processing your request.",
            explanation=str(e),
            confidence="Low",
            evidence=[],
            is_safe=True,
            risk_level="Low",
            disclaimer="System Error"
        )

# Set environment variable to disable progress bars
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
