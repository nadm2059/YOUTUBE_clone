from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

app = FastAPI()

API_KEY = "AIzaSyDSDL6zn5ax_H5t21_6aW-MbE_MHFzXwG0"

# Allow CORS for local frontend/testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_YT_API = "https://www.googleapis.com/youtube/v3"

@app.get("/search")
async def search_videos(q: str = Query(..., min_length=1)):
    url = f"{BASE_YT_API}/search"
    params = {
        "part": "snippet",
        "type": "video",
        "maxResults": 8,
        "q": q,
        "key": API_KEY,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
    return data.get("items", [])

@app.get("/videos")
async def get_video_details(ids: str = Query(...)):
    # ids = comma separated video ids
    url = f"{BASE_YT_API}/videos"
    params = {
        "part": "snippet,statistics",
        "id": ids,
        "key": API_KEY,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
    return data.get("items", [])

@app.get("/channels")
async def get_channel_avatars(ids: str = Query(...)):
    url = f"{BASE_YT_API}/channels"
    params = {
        "part": "snippet",
        "id": ids,
        "key": API_KEY,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
    # Map channel id to avatar url
    avatars = {}
    for c in data.get("items", []):
        avatars[c["id"]] = c["snippet"]["thumbnails"]["default"]["url"]
    return avatars
