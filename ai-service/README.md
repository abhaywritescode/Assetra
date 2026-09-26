# AI Service

This module handles document parsing via OCR and structured data extraction, along with providing grounded Retrieval-Augmented Generation (RAG) prompts.

## Directory Structure
- `prompts/`: Store your system prompt templates here. Use separate templates for "Extraction" vs "Grounded RAG".
- `extractors/`: Adapter functions to call Gemini Flash / OpenAI Vision for parsing receipt and invoice images.
- `retrieval/`: Logic to format database context into the RAG system prompt.
- `test_samples/`: Keep sample invoices here for testing.

## Task for AI/LLM Lead
1. **Extraction Pipeline**: Implement a function that takes a `filepath` (from `backend/uploads/`), reads the file as base64, and prompts the LLM to return strict JSON containing `product_name`, `purchase_price`, etc.
2. **Grounded RAG**: The backend `/api/chat/query` endpoint sends user assets as context. Your job is to define the exact system prompt that forces the LLM to rely *only* on that context and prevents hallucinations, ensuring provenance links.
