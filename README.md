# 3 VERSIONS WITH TYPESCRIPT, JAVASCRIPT, FLASK AND FASTAPI
## TO RUN TS VERSION
### npm install AND npm run dev: code files in pages and styles folder
## TO RUN JS VERSION: Files include index.html, style.css and script.js
### open index.html: code files in javascriptversion folder

## Running the FastAPI version

### Requirements:
- Python 3.7+
- pip

### Steps:

#### Create folder structure:
```

/fastapi-backend/
main.py
/frontend/
index.html
style.css
script.js

````
Put your `main.py` in `fastapi-backend/` and your frontend files in `/frontend`.

---

#### Install dependencies

Open a terminal in `fastapi-backend/` and run:
```bash
pip install fastapi uvicorn httpx
````

---

#### Set your YouTube API key (optional)

You can export your API key to an environment variable or edit `main.py` directly.

* On Linux/macOS:

```bash
export YOUTUBE_API_KEY="YOUR_API_KEY"
```

* On Windows (PowerShell):

```powershell
setx YOUTUBE_API_KEY "YOUR_API_KEY"
```

Or just replace the default API key string in `main.py` (not recommended for production).

---

#### Run the FastAPI server

Inside the `fastapi-backend` folder, run:

```bash
uvicorn main:app --reload
```

This starts your backend at: [http://localhost:8000](http://localhost:8000)

---

#### Open the frontend

Open `frontend/index.html` in your web browser (Chrome, Firefox, etc).

Make sure the frontend script’s `API_BASE` is set to `"http://localhost:8000"` in `script.js`.

---

#### Use the app!

Search YouTube videos via the UI, and the backend will proxy your requests to the YouTube API.

```
Here is a well-formatted **README.md** section with instructions to run the Flask version of your YouTube search project:

```markdown
# YouTube Clone - Flask Version

## Project structure

```

youtube\_flask\_clone/
├── app.py
├── templates/
│   └── index.html
├── static/
│   └── style.css
└── requirements.txt

````

---

## 1) Running the Flask version

### Requirements:
- Python 3.7+
- pip

### Steps:

#### Create and activate a virtual environment
```bash
python -m venv venv
````

* On Linux/macOS:

  ```bash
  source venv/bin/activate
  ```
* On Windows (PowerShell):

  ```powershell
  .\venv\Scripts\Activate.ps1
  ```

---

#### Install dependencies

```bash
pip install -r requirements.txt
```

---

#### Run the Flask app

```bash
python app.py
```

By default, the Flask server will run on:
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

---

#### Open the app in your browser

Open your web browser and navigate to:
[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

---

## Summary

* The Flask backend handles YouTube Data API calls securely on the server side to keep your API key private.
* The frontend fetches video search results from the Flask `/search` endpoint.
* Users can search videos and click thumbnails to play them in an embedded YouTube iframe.
* Styling and UI are similar to your original design.

---


