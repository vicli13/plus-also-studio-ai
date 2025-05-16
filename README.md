# ✨ AI Image Transformer – Plus Also Studios AI Challenge 2025

This is a submission for **Brief 1 [IMAGE TO IMAGE]** from the Plus Also Studios AI Intern Challenge.  
It is a lightweight and visually engaging platform that allows users to transform uploaded product images with a custom prompt and download the result.

Live Demo: [https://plus-also-studio-ai.vercel.app](https://plus-also-studio-ai.vercel.app)  
GitHub Repo: [https://github.com/vicli13/plus-also-studio-ai](https://github.com/vicli13/plus-also-studio-ai)

---

## 💡 Features

- Upload any product image (e.g. can of beer, item of clothing, etc.)
- Enter a creative prompt to modify the image
- Select aspect ratio: `1:1`, `3:2`, `2:3`
- Uses GPT-4o Vision to interpret the image and GPT-Image-1 (latest model) to generate a modified version
- Download the generated image
- Fully responsive, clean, and animated UI (built with Tailwind CSS), compatible on mobile too

---

## ⚙️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI GPT-4o + GPT-Image-1 API
- **Hosting**: Vercel

---

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:vicli13/plus-also-studio-ai.git
cd plus-also-studio-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenAI API key

Create a .env file in the root folder with:

```bash
VITE_OPENAI_API_KEY=sk-xxx-your-openai-key-here
```

### 4. Run the development server

```bash
npm run dev
```

## 🧪 Testing Procedures

- Upload various image types (`.jpg`, `.png`, etc.)
- Try a range of prompts (e.g., `make it a watercolor painting`, `add a vintage effect`)
- Switch between aspect ratios (`1:1`, `3:2`, `2:3`) and verify correct output dimensions
- Click **"Download Image"** and confirm the image properly downloaded
- Verify meaningful error messages are displayed when inputs are missing or the API fails

---

## 📁 Project Structure

```plaintext
plus-also-studio-ai/
├── node_modules/                # Installed dependencies
├── public/                      # Static assets (served as-is)
├── src/                         # Source code
│   ├── assets/                  # (Optional) Custom fonts/images
│   ├── App.css                  # Component-level CSS (unused if using Tailwind only)
│   ├── App.jsx                  # Main application logic
│   ├── index.css                # Global styles and Tailwind imports
│   └── main.jsx                 # Vite entry point (renders <App />)
├── .env                         # Environment variables (API key)
├── .gitignore                   # Git exclusion rules (e.g. node_modules, .env)
├── eslint.config.js            # ESLint config
├── index.html                  # Root HTML template (Vite uses this to inject)
├── package.json                # Project metadata, scripts, and dependencies
├── package-lock.json           # Locked versions of dependencies
├── README.md                   # Project instructions and documentation
├── vite.config.js              # Vite bundler config
```

---

## 🔒 Notes

- `.env` file is excluded from Git via `.gitignore` to keep API keys secure. (You may see `.env` from the commit history, but that token has been disabled)
- Requires an OpenAI API key with access to GPT-4o Vision and GPT-Image-1.
- API key is accessed using `import.meta.env.VITE_OPENAI_API_KEY`, following Vite’s environment variable conventions.
- No backend is used to make this light; all image processing and API interactions happen on the frontend via OpenAI's GPT-4o and GPT-Image-1.
- The ratio are set to `1024x1024`, `1536x1024` and `1024x1536` due to the limitation of the model, see [https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1](https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1) for further details.
- The UI is designed to be mobile-responsive, animated, and accessible, with clean visual hierarchy using Tailwind’s utility-first classes.
