from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = 'AIzaSyDSDL6zn5ax_H5t21_6aW-MbE_MHFzXwG0'


def search_videos(query):
    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'part': 'snippet',
        'q': query,
        'type': 'video',
        'maxResults': 8,
        'key': API_KEY,
    }
    res = requests.get(url, params=params)
    data = res.json()
    return data.get('items', [])


def fetch_video_details(video_ids):
    url = 'https://www.googleapis.com/youtube/v3/videos'
    params = {
        'part': 'snippet,statistics',
        'id': ','.join(video_ids),
        'key': API_KEY,
    }
    res = requests.get(url, params=params)
    data = res.json()
    return data.get('items', [])


def fetch_channel_avatars(channel_ids):
    url = 'https://www.googleapis.com/youtube/v3/channels'
    params = {
        'part': 'snippet',
        'id': ','.join(channel_ids),
        'key': API_KEY,
    }
    res = requests.get(url, params=params)
    data = res.json()
    avatars = {}
    for item in data.get('items', []):
        avatars[item['id']] = item['snippet']['thumbnails']['default']['url']
    return avatars


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Missing search query'}), 400

    results = search_videos(query)
    video_ids = [item['id']['videoId'] for item in results if 'videoId' in item['id']]
    channel_ids = [item['snippet']['channelId'] for item in results]

    if not video_ids:
        return jsonify({'items': []})

    details = fetch_video_details(video_ids)
    avatars = fetch_channel_avatars(channel_ids)

    # Add avatar URLs to video details for frontend convenience
    for video in details:
        channel_id = video['snippet']['channelId']
        video['channelAvatar'] = avatars.get(channel_id, '')

    return jsonify({'items': details})


if __name__ == '__main__':
    app.run(debug=True)
