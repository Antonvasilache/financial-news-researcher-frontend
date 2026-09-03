# Financial News Filing Researcher — Frontend

An interactive dashboard for financial market research, automated SEC filing analysis, and news sentiment tracking powered by an AI agentic backend.

This repository contains the React frontend interface designed to communicate with the FastAPI AI backend.

---

## 🛠️ Current Tech Stack

* **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Form Handling:** [React Hook Form](https://react-hook-form.com/)
* **HTTP Client:** Native `fetch` API

---

## 🚀 Features Built So Far (Phase 1)

* [x] **Project Scaffolding:** Lightweight React + Vite + TypeScript repository setup.
* [x] **Type Safety Layer:** TypeScript domain interfaces (`TickerBase`, `TickerCreate`, `TickerResponse`) strictly matching backend Pydantic models.
* [x] **API Client Module:** Modular native `fetch` service wrapping FastAPI REST endpoints with standardized HTTP error handling.
* [x] **Ticker Management UI:**
  * Interactive form built with `react-hook-form` to track new stock tickers.
  * Real-time client-side validation (max symbol length, required fields).
  * Display list for tracked tickers and removal/deletion functionality.
* [x] **LLM Revenue Stream Analysis UI:**
  * Interactive research form to request AI-generated company revenue breakdowns.
  * Structured rendering for LLM JSON outputs (summary, currency and revenue stream cards with estimated percentages and types).
* [x] **CORS & State Integration:** Cross-origin communication with local FastAPI server with loading state handling and error boundary banners.

---

## 🗺️ Frontend Development Roadmap

### Phase 1: Core Ticker Management (Completed)
* [x] Establish Vite + React + TypeScript repository architecture.
* [x] Connect native `fetch` client to FastAPI `/tickers` endpoints.
* [x] Build validated ticker input forms and list views.
* [x] Integrate AI Revenue Research feature connecting to FastAPI `/api/v1/research/revenue-streams` LLM endpoint..

---

### Phase 2: Ingestion & Market Data Display (Completed)
* [x] **SEC Filing Explorer View:** UI view to trigger and display status for fetched SEC 10-K/10-Q filing documents.
* [x] **Financial Data Summaries:** Components to display structured market data and key company metrics retrieved from backend financial APIs.
* [x] **Filing Section Reader:** Document viewing component to read parsed filing sections (e.g., *Item 1A: Risk Factors*).

---

### Phase 3: RAG Search & SEC Document Querying
* [ ] **Semantic Search Bar:** Search interface allowing direct natural language queries against vector-indexed SEC filings.
* [ ] **Retrieved Context Cards:** UI components displaying retrieved filing text chunks, relevance scores, and metadata (quarter/year tags).

---

### Phase 4: Agentic Workflow & Real-Time Streaming UI
* [ ] **Live Reasoning Stream:** Real-time agent status tracker using Server-Sent Events (SSE) or WebSockets to display backend tool execution steps (*"Fetching 10-K..."* $\rightarrow$ *"Extracting risk factors..."*).
* [ ] **Bull / Bear Analysis Report:** Dedicated report layout rendering structured JSON outputs from multi-agent evaluation pipelines.

---

### Phase 5: Evaluation, Guardrails & Polish
* [ ] **Hallucination & Reliability Indicators:** UI badges flagging verified facts vs. speculative AI statements.
* [ ] **User Experience & Feedback Loops:** Error recovery states, active request cancellation, and prompt execution tuning controls.

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js:** v18+ 
* **npm:** v9+
* Running instance of the **FastAPI Backend** (default: `http://localhost:8000`)

### Installation & Run

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd financial-news-researcher-frontend
   npm install
   ```

2. Start the development server:
  ```bash
  npm run dev
  ```

3. Open your browser at `http://localhost:5173`: