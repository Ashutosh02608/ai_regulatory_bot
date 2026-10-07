import os
from pathlib import Path
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv
from system_prompt import SYSTEM_PROMPT
from models import Message

# .env lives in the project root (one level above backend/)
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

_model = genai.GenerativeModel(
    model_name=os.getenv("MODEL", "gemini-3.6-flash"),
    system_instruction=SYSTEM_PROMPT,
)


def build_history(history: List[Message]) -> list:
    """Convert our Message list to Gemini's content format."""
    gemini_history = []
    for msg in history:
        gemini_history.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [msg.content],
        })
    return gemini_history


async def get_reply(message: str, history: List[Message]) -> str:
    """Send a message with history to Gemini and return the reply."""
    chat = _model.start_chat(history=build_history(history))
    response = await chat.send_message_async(message)
    return response.text
