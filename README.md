# InterviewAI Deployment Guide (Render One-Click Deploy)

This repository is pre-configured for a **one-click deployment** on [Render](https://render.com) using the `render.yaml` Blueprint specification. This configuration automatically deploys both the Node.js Express Backend and the React Frontend, links them together, and sets up their environment variables.

---

## 🚀 One-Click Deploy to Render

If your code is pushed to a GitHub repository, you can deploy it instantly by clicking the button below.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=YOUR_GITHUB_REPO_URL)

> ⚠️ **Important:** Replace `YOUR_GITHUB_REPO_URL` in the URL above with the HTTPS link to your GitHub repository (e.g., `https://github.com/username/interviewAI`).

---

## 🛠️ Step-by-Step Deployment Guide (English)

### Step 1: Push Code to GitHub
Ensure all your files, including the `render.yaml` file, are pushed to a public or private GitHub repository.

### Step 2: Create a Blueprint on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click the **New +** button in the top right corner and select **Blueprint**.
3. Connect your GitHub account (if not already connected) and select your **interviewAI** repository.
4. Render will read the `render.yaml` file automatically and show a list of services to be created:
   - **interview-ai-backend** (Web Service)
   - **interview-ai-frontend** (Static Site)

### Step 3: Configure Environment Variables
During the Blueprint setup, Render will prompt you for the following required variables:
- **`MONGO_URI`**: Your MongoDB connection string (e.g., from MongoDB Atlas).
- **`GOOGLE_GENAI_API_KEY`**: Your Google Gemini API Key.

The other variables are configured automatically:
- `PORT` defaults to `10000`.
- `NODE_ENV` is set to `production`.
- `JWT_SECRET` is automatically generated with a secure random key.
- `FRONTEND_URL` is automatically wired to the URL of the Frontend service.
- `VITE_API_URL` is automatically wired to the URL of the Backend service.

### Step 4: Deploy!
Click **Apply** at the bottom of the page. Render will build and deploy both services in the correct order (backend first, then frontend).

---

## 🛠️ Step-by-Step Deployment Guide (Hindi/Hinglish)

### Step 1: Code ko GitHub par Push karein
Sabse pehle apne saare files ko GitHub repository par push kar dein. Ye dhyan rakhein ki root folder me `render.yaml` file hona zaroori hai.

### Step 2: Render par Blueprint Banayein
1. [Render Dashboard](https://dashboard.render.com) par login karein.
2. Top-right corner me **New +** button par click karein aur **Blueprint** select karein.
3. Apne GitHub account ko connect karein aur **interviewAI** repository ko select karein.
4. Render automatic aapki `render.yaml` file ko read kar lega aur 2 services setup karega:
   - **interview-ai-backend** (Express server)
   - **interview-ai-frontend** (React build)

### Step 3: Environment Variables Fill karein
Setup ke dauran Render aapse niche diye gaye variables ki values puchega:
- **`MONGO_URI`**: Apne MongoDB Atlas ka connection string daalein.
- **`GOOGLE_GENAI_API_KEY`**: Apna Gemini API key daalein.

Baki keys auto-configure ho jayengi:
- `JWT_SECRET` auto-generate ho jayega.
- Backend aur Frontend ek dusre se automatic connect ho jayenge (Render internal hostname referencing se).

### Step 4: Deploy click karein!
**Apply** button par click karein. Render pehle Backend deploy karega, uske baad Frontend deploy karke dono ko active kar dega!
