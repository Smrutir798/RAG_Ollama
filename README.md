# Explainable RAG Healthcare System

An intelligent healthcare assistant powered by Retrieval-Augmented Generation (RAG) using Ollama and FAISS. This system provides evidence-based health information with full explainability, safety guardrails, and a modern React frontend.

## Features

- **RAG-Powered Responses**: Retrieves relevant documents from your knowledge base to provide accurate, evidence-based answers
- **Multi-Agent Architecture**: Uses specialized agents for routing, retrieval, and answer generation
- **Safety Guardrails**: Built-in risk classification (Low/Moderate/High) with emergency detection
- **Explainability**: Every response includes citations, confidence scores, and evidence sources
- **Document Upload**: Supports PDF and TXT file uploads to expand the knowledge base
- **Modern UI**: Clean React frontend with Tailwind CSS styling

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Ollama** - Local LLM inference (llama3.1)
- **FAISS** - Vector similarity search
- **Sentence Transformers** - Text embeddings (all-MiniLM-L6-v2)
- **LangChain** - LLM orchestration and text processing
- **PyPDF** - PDF document parsing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI application & endpoints
│   ├── rag_engine.py     # FAISS indexing & document retrieval
│   ├── llm_client.py     # Ollama LLM wrapper
│   ├── agents.py         # Router, Retrieval, and Answer agents
│   ├── orchestrator.py   # Query orchestration logic
│   ├── safety.py         # Risk classification & safety guardrails
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   └── components/          # React components
│   │       ├── ChatContainer.jsx
│   │       ├── QueryInput.jsx
│   │       ├── AnswerDisplay.jsx
│   │       ├── EvidencePanel.jsx
│   │       └── ...
│   └── package.json      # Node.js dependencies
└── data/
    └── sample_health.txt # Sample health documents
```

## Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Ollama** installed and running with **llama3.1** model

## Setup Instructions

### 1. Install Ollama

Download and install Ollama from [https://ollama.com/download](https://ollama.com/download)

Pull the required model:
```bash
ollama pull llama3.1
```

Ensure Ollama is running:
```bash
ollama serve
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (recommended):
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/query` | POST | Submit a health query and receive an AI-generated response |
| `/upload` | POST | Upload PDF or TXT documents to the knowledge base |
| `/docs` | GET | Interactive API documentation (Swagger UI) |

### Query Request Example

```json
{
  "text": "What are the symptoms of diabetes?"
}
```

### Query Response Example

```json
{
  "answer": "Common symptoms of diabetes include...",
  "explanation": "Based on the retrieved documents...",
  "confidence": "High",
  "evidence": [...],
  "is_safe": true,
  "risk_level": "Moderate",
  "disclaimer": "This information is not medical advice..."
}
```

## How It Works

### Multi-Agent Architecture

1. **Router Agent**: Classifies query intent (RAG_RESEARCH vs DIRECT_ANSWER)
2. **Retrieval Agent**: Generates optimized search queries for document retrieval
3. **Answer Agent**: Synthesizes evidence-based responses with citations

### Safety Classification

| Risk Level | Description | Example |
|------------|-------------|---------|
| **Low** | General health information | "What are benefits of exercise?" |
| **Moderate** | Symptom-related queries | "What causes headaches?" |
| **High** | Emergency situations | Triggers immediate alert protocol |

### RAG Pipeline

1. Documents are chunked (500 chars with 50 char overlap)
2. Chunks are embedded using Sentence Transformers
3. Embeddings are indexed in FAISS for fast similarity search
4. Relevant chunks are retrieved and passed to the LLM
5. LLM generates an evidence-based response with citations

## Adding Documents

Place your health documents (PDF or TXT) in the `data/` folder, or use the upload endpoint:

```bash
curl -X POST "http://localhost:8000/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_document.pdf"
```

## Configuration

### LLM Model
Change the model in `backend/llm_client.py`:
```python
self.llm = ChatOllama(model="llama3.1", temperature=0.2, format="json")
```

### Embedding Model
Change the embedding model in `backend/rag_engine.py`:
```python
self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
```

### Chunk Size
Adjust chunking parameters in `backend/rag_engine.py`:
```python
self.chunk_size = 500
self.chunk_overlap = 50
```

## Development

### Running Tests
```bash
cd backend
pytest
```

### Linting Frontend
```bash
cd frontend
npm run lint
```

### Building for Production
```bash
cd frontend
npm run build
```

## Disclaimer

⚠️ **This system is for educational and informational purposes only.** It is not intended to provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
