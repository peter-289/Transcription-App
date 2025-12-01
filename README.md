# ScribeFlow

ScribeFlow is a production-ready transcription platform powered by Google Gemini 2.5.

## Architecture Modes

ScribeFlow is designed to run in two modes:

1.  **Serverless (Default)**: Runs entirely in the browser. Uses `localStorage` for data persistence and calls the Gemini API directly. Ideal for demos, testing, and static deployment (Vercel, Netlify).
2.  **Full-Stack**: Uses a Rust backend and PostgreSQL database for robust data storage and authentication.

## Deployment (Serverless Version)

You can deploy the frontend immediately as a static site. The application logic is self-contained.

### 1. Prerequisites
You need a Google Gemini API Key.

### 2. Deploy to Vercel
1.  Push this repository to GitHub.
2.  Import the project into Vercel.
3.  In the Vercel Project Settings, add the following **Environment Variable**:
    *   **Name**: `API_KEY`
    *   **Value**: `Your_Actual_Gemini_API_Key`
4.  Deploy.

### 3. Deploy to Netlify
1.  Push to GitHub and connect to Netlify.
2.  In "Site settings" > "Build & deploy" > "Environment", add:
    *   Key: `API_KEY`
    *   Value: `Your_Actual_Gemini_API_Key`
3.  Deploy.

---

##Local Development

### Setup
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set your API Key:
    *   Create a `.env` file in the root directory.
    *   Add: `API_KEY=your_gemini_key_here`

3.  Run the development server:
    ```bash
    npm run dev
    ```

---

## Docker & Full-Stack (Optional)

If you wish to run the local Rust backend and PostgreSQL database instead of the serverless mode:

1.  **Spin up Services**:
    ```bash
    docker-compose up --build
    ```
    This starts PostgreSQL (port 5432) and the Rust Backend (port 8080).

2.  **Connect Frontend**:
    To switch the frontend from `localStorage` to the real backend, you would need to update `services/storage.ts` and `contexts/AuthContext.tsx` to make `fetch()` calls to `http://localhost:8080` instead of using the local mock implementation.