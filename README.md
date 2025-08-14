
# YouTube Search App — 4 Versions: TypeScript, JavaScript, Flask, and FastAPI

---

## TypeScript Version

### Setup & Run

- Navigate to the TypeScript project folder (with `pages` and `styles` folders).
- Run the following commands:

```bash
npm install
npm run dev
````

* The app will start locally (usually on `http://localhost:3000` or as configured).

---

## JavaScript Version

### Setup & Run

* Open the `index.html` file located inside the `javascriptversion` folder in any modern browser.
* This version includes:

  * `index.html`
  * `style.css`
  * `script.js`

No build or server setup required.

---

## FastAPI Version

### Requirements

* Python 3.7+
* pip

### Project Structure

```
/fastapi-backend/
├── main.py
/frontend/
├── index.html
├── style.css
└── script.js
```

* Place `main.py` inside the `fastapi-backend` folder.
* Place frontend files inside the `/frontend` folder.

### Installation

Open a terminal inside the `fastapi-backend` folder and run:

```bash
pip install fastapi uvicorn httpx
```

### Optional: Set YouTube API Key

Set your API key as an environment variable.

* Linux/macOS:

  ```bash
  export YOUTUBE_API_KEY="YOUR_API_KEY"
  ```

* Windows (PowerShell):

  ```powershell
  setx YOUTUBE_API_KEY "YOUR_API_KEY"
  ```

Alternatively, you can hardcode your API key in `main.py` (not recommended for production).

### Run the Server

```bash
uvicorn main:app --reload
```

* The backend will be available at: [http://localhost:8000](http://localhost:8000)

### Launch Frontend

* Open `frontend/index.html` in your browser.
* Make sure `API_BASE` in `script.js` is set to `"http://localhost:8000"`.

### Usage

* Search YouTube videos via the UI.
* The backend proxies requests securely to the YouTube Data API.

---

## Flask Version

### Requirements

* Python 3.7+
* pip

### Project Structure

```
youtube_flask_clone/
├── app.py
├── templates/
│   └── index.html
├── static/
│   └── style.css
└── requirements.txt
```

### Setup & Run

1. Create and activate a virtual environment:

* Linux/macOS:

  ```bash
  python -m venv venv
  source venv/bin/activate
  ```

* Windows (PowerShell):

  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask app:

```bash
python app.py
```

* The app will be available at: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

### Usage

* The Flask backend securely handles YouTube API requests.
* The frontend fetches data from Flask’s `/search` endpoint.
* Users can search videos and watch them embedded in the page.

---

## Summary

* All versions provide a user-friendly UI for searching YouTube videos.
* Backend versions (Flask, FastAPI) securely proxy API calls to keep your API key safe.
* Frontend-only versions (JavaScript, TypeScript) demonstrate client-side implementations.
* Choose the version that best fits your development environment and preferences.

---

