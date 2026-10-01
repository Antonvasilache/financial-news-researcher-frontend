# Financial News Researcher Frontend ⚡

![React](https://img.shields.io/badge/React-19.2%2B-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9%2B-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2%2B-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?logo=open-source-initiative&logoColor=white)

An interactive, responsive dashboard built with **React 19**, **TypeScript**, and **Vite** designed to interface with the FastAPI AI research backend. The client provides financial market researchers and investors with real-time tools for stock tracking, SEC filing exploration (10-K/10-Q), generative AI revenue breakdown insights, and live multi-agent research execution tracking.

---

## 🎯 Architecture & Objective

Modern AI applications demand user interfaces that go far beyond standard request-response forms. This frontend is engineered to handle complex, asynchronous AI workflows:

* **Strict Type Safety:** TypeScript domain models strictly synchronized with backend Pydantic v2 schemas.
* **Document & Narrative Exploration:** Multi-section readers for dense SEC disclosures with tabbed navigation and semantic clarity.
* **Real-Time Agent Feedback:** UI architectures prepared for Server-Sent Events (SSE) to render agent reasoning steps and intermediate tool calls live.
* **Domain Evaluation & Comparison:** Interactive surfaces to visualize financial metrics, ML predictions, and side-by-side LLM outputs.

---

## 🚦 Feature Matrix

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Vite & React 19 Core** | ✅ Implemented | High-performance build tooling, strict TypeScript config, and modular architecture |
| **Tickers Management UI** | ✅ Implemented | Form validation (`react-hook-form`), ticker tracking, and list management |
| **LLM Revenue Stream Analysis UI** | ✅ Implemented | Interactive research form and card visualization for AI-generated business model breakdowns |
| **SEC Filings Explorer & Viewer** | ✅ Implemented | Automated filing retrieval UI and tabbed section reader (*Business*, *Risk Factors*, *MD&A*) |
| **Comprehensive Test Suite** | ✅ Implemented | 60+ unit and integration tests using Vitest and React Testing Library |
| **Financial Data Analysis & ML Dashboards** | 📅 Planned | Quantitative financial ratio charts, trend analysis, and ML anomaly indicators |
| **Deep Learning & NLP Embeddings Visualizer** | 📅 Planned | FinBERT sentiment heatmaps, risk token tags, and semantic chunk boundary explorer |
| **LLM Fine-Tuning & Evaluation Workbench** | 📅 Planned | Side-by-side model comparison (base vs. LoRA/PEFT) with ROUGE and factual consistency scorecards |
| **Vector Store & Hybrid RAG Search** | 📅 Planned | Semantic natural language search bar over SEC filings with relevance scores and chunk citations |
| **Multi-Agent Orchestration & SSE Stream** | 📅 Planned | Real-time Server-Sent Events (SSE) streaming console displaying multi-agent reasoning steps |

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Core Ticker Management & LLM Revenue Research
- [x] **Project Scaffolding & Architecture:** Modern React 19 + TypeScript + Vite project configuration with CSS variables and responsive design.
- [x] **Type Safety Layer:** Strict TypeScript domain models (`TickerBase`, `TickerCreate`, `TickerResponse`, `RevenueStreamsResponse`) mapped to backend Pydantic schemas.
- [x] **Modular API & Service Layer:** Native `fetch` HTTP wrapper with robust error handling, status classification, and decoupled service abstractions.
- [x] **Ticker Management Interface:** Validated ticker entry form with `react-hook-form`, error banners, tracked ticker listings, and removal actions.
- [x] **LLM Revenue Breakdown UI:** Dedicated research interface rendering AI-synthesized revenue stream cards, estimated percentage allocations, and business models.

### ✅ Phase 2: SEC Filings Ingestion & Document Reading
- [x] **SEC EDGAR Filing Explorer:** Interactive dashboard to fetch and list recent 10-K (annual) and 10-Q (quarterly) filings by stock ticker.
- [x] **Document Section Reader:** Tabbed document viewer component for deep reading of extracted filing sections:
  - *Item 1: Business*
  - *Item 1A: Risk Factors*
  - *Item 7: Management's Discussion and Analysis (MD&A)*
- [x] **Financial Summary Header:** Structured display for company metadata, filing dates, accession numbers, and ingestion status.
- [x] **Automated Test Coverage:** Complete component and service test suite (60+ tests) with Vitest and React Testing Library.

### 📅 Phase 3: Financial Data Analysis & Machine Learning Dashboards
- [ ] **Quantitative Financial Dashboards:** Interactive visualization charts (revenue trajectories, operating margins, leverage, and liquidity ratios).
- [ ] **ML Trend & Anomaly Indicators:** Visual status badges and warning indicators highlighting financial anomalies detected by backend scikit-learn models.
- [ ] **Predictive Volatility & Risk Gauges:** Display widgets for neural network predictions (price volatility forecast and filing risk classifications).

### 📅 Phase 4: NLP Foundation Models & Transformer Architecture
- [ ] **Semantic Chunk Inspector:** Visual explorer for chunked SEC text disclosures showing token counts, chunk boundaries, and document metadata.
- [ ] **FinBERT Sentiment Heatmaps:** Passage-level sentiment highlighting across MD&A text (positive, negative, uncertainty, and litigious sentiment scores).
- [ ] **Abstractive Risk Summarization Cards:** Digest cards presenting transformer-generated summaries and key risk bullets for Item 1A disclosures.

### 📅 Phase 5: Generative AI Engineering & Fine-Tuned Model Workbench
- [ ] **Side-by-Side Model Evaluation Playground:** Dual-output comparison interface contrasting baseline open-weights LLMs against domain fine-tuned models (LoRA/PEFT).
- [ ] **Evaluation Scorecards & Hallucination Gauges:** Visual metrics dashboard presenting ROUGE, BLEU, and domain factual accuracy scores.
- [ ] **Inference Parameter Controls:** Interactive parameter sliders (temperature, top_p, maximum tokens) and custom system prompt testing.

### 📅 Phase 6: Agentic RAG Systems & Real-Time Orchestration
- [ ] **Hybrid RAG Semantic Search Bar:** Natural language search bar querying ChromaDB vector storage with relevance score badges and filing metadata filters.
- [ ] **Source Citation Drawer:** Interactive side-sheet opening exact source filing excerpts and page references linked to AI-generated answers.
- [ ] **Real-Time Agent Execution Console (SSE):** Live Server-Sent Events stream viewer animating agent thought processes, tool activations, and multi-agent roles (*SEC Analyst*, *News Sentiment Researcher*, *Valuation Synthesizer*).
- [ ] **Comprehensive Trade Thesis Dossier:** End-to-end synthesized report dashboard consolidating qualitative filings, quantitative metrics, bull/bear theses, and export options.

---

## 🛠️ Tech Stack & Tooling

* **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Form Management:** [React Hook Form](https://react-hook-form.com/)
* **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
* **HTTP Client:** Native `fetch` API with modular service architecture
* **Backend Companion:** [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python 3.14 Backend)

---

## 📁 Repository Structure

```text
financial-news-researcher-frontend/
├── src/
│   ├── api/                    # Raw HTTP client & endpoint calls
│   │   ├── client.ts           # Base fetch client with standardized error handling
│   │   ├── researchApi.ts      # LLM revenue research API endpoints
│   │   ├── secApi.ts           # SEC EDGAR filings API endpoints
│   │   ├── tickerApi.ts        # Tickers CRUD API endpoints
│   │   └── __tests__/          # API client unit tests
│   ├── components/             # Reusable UI components
│   │   ├── FilingSectionReader.tsx # SEC filing section tabbed document viewer
│   │   ├── FinancialSummary.tsx    # Company filing metadata display
│   │   ├── RevenueResearch.tsx     # LLM revenue streams research form & cards
│   │   ├── SecFilingExplorer.tsx   # SEC 10-K / 10-Q filing retriever & list
│   │   ├── TickerForm.tsx          # Validated ticker creation form
│   │   ├── TickerItem.tsx          # Individual ticker badge with delete action
│   │   ├── TickerList.tsx          # Tracked tickers list container
│   │   └── __tests__/          # Component unit & integration tests
│   ├── services/               # Business logic & UI-facing service wrappers
│   │   ├── researchService.ts  # Revenue research service
│   │   ├── secService.ts       # SEC filings service
│   │   ├── tickerService.ts    # Tickers management service
│   │   └── __tests__/          # Service unit tests
│   ├── types/                  # TypeScript interfaces matching backend models
│   │   ├── research.ts         # Revenue streams data contracts
│   │   ├── sec.ts              # SEC filings and section contracts
│   │   └── ticker.ts           # Ticker data contracts
│   ├── test/                   # Test configuration & setup (jest-dom matchers)
│   ├── App.tsx                 # Root application component
│   ├── App.css                 # Application styles & themes
│   ├── index.css               # Global baseline stylesheet
│   └── main.tsx                # Application entrypoint
├── package.json                # Project dependencies and test/build scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler & Vitest test runner configuration
└── README.md
```

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js:** v18+ 
* **npm:** v9+
* Running instance of the **FastAPI Backend** (default: `http://localhost:8000`)

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/financial-news-researcher-frontend.git
cd financial-news-researcher-frontend
npm install
```

### 2. Running the Development Server
Start the local Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🧪 Running Tests

Run the automated test suite with Vitest:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.