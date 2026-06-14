# ─────────────────────────────────────────────────────────────
# CredChain — AI Insights Engine (Zhavia)
# FastAPI service that analyses skills + career paths.
# Runs on http://localhost:8002.
# ─────────────────────────────────────────────────────────────

from typing import Any, Dict, List

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CredChain AI Insights Engine",
    description="Analyses CredChain student skills and suggests career paths.",
    version="1.0.0",
)

# Identical CORS parameters to the CV engine: backend (5000) + frontend (3000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> Dict[str, Any]:
    return {"service": "ai-insights-engine", "status": "ok", "port": 8002}


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "healthy"}


@app.post("/analyze-skills")
async def analyze_skills(request: Request) -> Dict[str, List[Any]]:
    """
    Accept an arbitrary JSON dictionary payload and return the
    structured insights template expected by the frontend.
    """
    try:
        _payload: Dict[str, Any] = await request.json()
    except Exception:
        _payload = {}

    return {
        "strong_skills": [],
        "career_paths": [],
        "next_steps": [],
    }
