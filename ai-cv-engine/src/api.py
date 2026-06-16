# ─────────────────────────────────────────────────────────────
# CredChain — AI CV Engine (Tony)
# FastAPI service that builds PDF CVs. Runs on http://localhost:8001.
# ─────────────────────────────────────────────────────────────

from typing import Any, Dict

from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CredChain AI CV Engine",
    description="Generates PDF CVs from CredChain student data.",
    version="1.0.0",
)

# Allow cross-origin requests from the backend (5000) and frontend (3000).
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
    return {"service": "ai-cv-engine", "status": "ok", "port": 8001}


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "healthy"}


@app.post("/generate-cv")
async def generate_cv(
    payload: Dict[str, Any] = Body(
        ...,
        examples=[
            {
                "name": "Ada Lovelace",
                "skills": ["Python", "Math"],
                "summary": "Test run",
            }
        ],
    )
) -> Dict[str, Any]:
    """
    Accept an arbitrary JSON dictionary payload and return a JSON
    receipt verifying the data was delivered to the CV engine.
    """
    return {
        "success": True,
        "service": "ai-cv-engine",
        "message": "CV generation request received successfully.",
        "received_keys": list(payload.keys()),
        "received_payload": payload,
    }
