import os
import glob
from typing import List, Dict
import faiss
import numpy as np
import pypdf
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

class RAGEngine:
    def __init__(self, data_dir: str = "../data", model_name: str = "all-MiniLM-L6-v2"):
        self.data_dir = data_dir
        self.encoder = SentenceTransformer(model_name)
        self.index = None
        self.documents = [] # Stores metadata/content corresponding to index
        self.chunk_size = 500
        self.chunk_overlap = 50
        
        # Ensure data directory exists
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            
        # Load or initialize
        self._load_documents()

    def _load_documents(self):
        """Loads text files from data directory, chunks them, and builds FAISS index."""
        print(f"Loading documents from {self.data_dir}...")
        files = glob.glob(os.path.join(self.data_dir, "**/*.*"), recursive=True)
        
        self.documents = [] # Reset documents
        all_chunks = []
        
        for file_path in files:
            if file_path.endswith(('.txt', '.pdf')):
                chunks, metadata = self._process_file(file_path)
                if chunks:
                    all_chunks.extend(chunks)
                    self.documents.extend(metadata)

        if not all_chunks:
            print("No documents found.")
            # Initialize empty index
            self.index = faiss.IndexFlatL2(384) # Default dimension for MiniLM
            return

        print(f"Encoding {len(all_chunks)} chunks...")
        embeddings = self.encoder.encode(all_chunks)
        
        # Initialize FAISS
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings).astype('float32'))
        
        print(f"Index built with {self.index.ntotal} vectors.")

    def _process_file(self, file_path: str):
        """Extracts text from a file and returns chunks + metadata."""
        text = ""
        try:
            if file_path.endswith('.pdf'):
                reader = pypdf.PdfReader(file_path)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            else:
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
            
            if not text.strip():
                return [], []

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.chunk_size, 
                chunk_overlap=self.chunk_overlap
            )
            
            chunks = splitter.split_text(text)
            source_name = os.path.basename(file_path)
            
            metadata_list = [{"source": source_name, "content": chunk} for chunk in chunks]
            return chunks, metadata_list
            
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return [], []

    def add_document(self, file_path: str):
        """Adds a new document to the index dynamically."""
        print(f"Adding document: {file_path}")
        chunks, metadata = self._process_file(file_path)
        
        if not chunks:
            return False, "Failed to extract text from file."

        embeddings = self.encoder.encode(chunks)
        
        # Add to FAISS
        if self.index is None:
             self.index = faiss.IndexFlatL2(embeddings.shape[1])
             
        self.index.add(np.array(embeddings).astype('float32'))
        self.documents.extend(metadata)
        
        print(f"Added {len(chunks)} chunks to index.")
        return True, f"Successfully indexed {len(chunks)} chunks."

    def search(self, query: str, k: int = 3) -> List[Dict]:
        """Retrieves top-k relevant chunks."""
        if not self.index or self.index.ntotal == 0:
            return []

        query_vector = self.encoder.encode([query])
        D, I = self.index.search(np.array(query_vector).astype('float32'), k)
        
        results = []
        for i, idx in enumerate(I[0]):
            if idx != -1 and idx < len(self.documents):
                doc = self.documents[idx]
                results.append({
                    "content": doc["content"],
                    "source": doc["source"],
                    "score": float(D[0][i])
                })
        
        return results

# Singleton instance placeholder
# engine = RAGEngine()
