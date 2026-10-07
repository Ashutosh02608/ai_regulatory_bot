# TRUVAD Copilot — AI Regulatory Assistant

A floating chatbot widget and REST API powered by **Google Gemini** (`gemini-3.6-flash`) and **FastAPI**, providing structured, source-backed compliance answers across global AI regulatory frameworks.

---

## ✨ Features

- **Standardized Regulatory Output**: Every answer follows a rigorous four-part format:
  - **Answer**: Concise, direct factual response.
  - **Exact Source Citations**: Primary legal and regulatory references with exact URLs and clauses.
  - **Effective Date**: ISO dates (`YYYY-MM-DD`) or explicit status.
  - **Impacted Teams**: Affected corporate units (e.g., Legal, Product, Risk, Engineering).
- **Plug-and-Play Floating Widget**: Self-contained Vanilla JS/CSS widget that can be embedded into any web application with two lines of code.
- **Context-Aware Multi-Turn Chat**: Preserves conversation history across turns.
- **Pre-Configured Suggestion Chips**: Quick-start prompt suggestions for fast exploration.

---


## 📁 Project Structure

```
ai_regulatory/
├── backend/
│   ├── main.py           # FastAPI app & CORS configuration
│   ├── llm_client.py     # Gemini API integration (model initialization & chat execution)
│   ├── system_prompt.py  # Regulatory instructions and citation constraints
│   ├── models.py         # Pydantic request/response schemas
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── widget.html       # Demo host page
│   ├── chat-widget.js    # Self-contained widget controller & DOM renderer
│   └── chat-widget.css   # Widget styling and animations
├── .env.example          # Environment variable template
├── .env                  # Environment configuration (root level)
└── README.md
```

---

## ⚙️ Environment Configuration

The application expects a `.env` file in the **project root directory** (`ai_regulatory/.env`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
MODEL=gemini-3.6-flash
```

> **Note**: Supported models include `gemini-3.6-flash` (recommended) or `gemini-flash-latest`.

---

## 🚀 Quick Start
### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Ensure .env exists in project root (ai_regulatory/.env)
# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The backend will be available at:
- **API URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Frontend Setup

You can run a lightweight local static server (recommended to avoid browser CORS/file origin restrictions):

```bash
# From the project root:
python -m http.server 3000 --directory frontend
```

Then visit **[http://localhost:3000/widget.html](http://localhost:3000/widget.html)** in your browser.

*(Alternatively, you can open `frontend/widget.html` directly in your web browser).*

---

## 🔌 Embedding the Widget in Your Website

To add the TRUVAD Copilot chat widget to any website or web app, include the CSS and JS bundle in your HTML:

```html
<!-- In <head> -->
<link rel="stylesheet" href="path/to/chat-widget.css">

<!-- Before </body> -->
<script src="path/to/chat-widget.js" data-api-url="http://localhost:8000"></script>
```

Set `data-api-url` to your hosted backend URL in production.

---

## 📡 API Reference

### `POST /api/chat`
Submit a user message along with prior conversation history.

**Request Body:**
```json
{
  "message": "What are high-risk systems under the EU AI Act?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hello! How can I assist you with AI regulations?" }
  ]
}
```

**Response Body:**
```json
{
  "reply": "**Answer:**\nUnder the EU AI Act, high-risk AI systems include...\n\n**Exact Source Citations:**\n- Regulation (EU) 2024/1689 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689 — Article 6 and Annex III\n\n**Effective Date:**\n2026-08-02\n\n**Impacted Teams:**\n- Legal and Compliance\n- Engineering\n- Product Management"
}
```

### `GET /health`
Liveness check endpoint.

**Response Body:**
```json
{
  "status": "ok",
  "service": "TRUVAD Copilot API"
}
```
