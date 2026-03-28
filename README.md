# SYNK - Campus Safety & Guardian Network

SYNK is a real-time campus safety application designed to connect students in need with nearby "Guardians" (fellow students) who can provide immediate assistance. Whether it's a medical emergency, a safety concern, or just needing a walk home, SYNK synchronizes the campus community for a safer environment.

## Use Cases
- **Medical Emergencies:** Request immediate first aid or assistance while waiting for campus paramedics.
- **Safety Escorts:** Find a nearby student to walk with you across campus at night.
- **Mental Health Support:** Quick access to helplines and peer support during stressful periods.
- **Resource Sharing:** Find the nearest campus security office or student banking services.

## Key Features
- **Real-time Radar:** See nearby help requests and respond instantly.
- **Guardian Network:** Gamified system where students earn badges and levels for helping others.
- **AI Guardian Tips:** Instant, context-aware safety advice powered by Google Gemini.
- **Emergency Contacts:** One-tap access to call your pre-configured emergency contacts.
- **Resource Hub:** A curated list of campus and national safety/health resources.
- **Pastel Pink Theme:** A soft, approachable UI designed for high-stress situations.

## AI Integration
SYNK leverages **Google Gemini (gemini-3-flash-preview)** to provide:
- **Contextual Safety Tips:** When a help request is accepted, the Guardian receives immediate, actionable advice based on the situation (e.g., CPR steps, de-escalation techniques).
- **Guardian AI Chat:** A live support interface where Guardians can ask for specific guidance during a "Sync" event.

## Tech Stack

### Google Technologies
- **Google Gemini API:** Powers the intelligent safety guidance and Guardian AI.
- **Firebase Authentication:** Secure Google-based login and profile management.
- **Cloud Firestore:** Real-time database for help requests, user profiles, and synchronization.

### Core Technologies
- **React 18 + Vite:** Fast, modern frontend framework and build tool.
- **TypeScript:** Type-safe development for a robust codebase.
- **Tailwind CSS:** Utility-first styling for a custom, responsive pastel theme.
- **Motion (framer-motion):** Smooth, high-performance animations for a premium feel.
- **Lucide React:** Consistent and clear iconography.
- **Sonner:** Elegant toast notifications for real-time feedback.

## File Structure
```text
/src
  /components     # Reusable UI components (Radar, GuardianTips, etc.)
  /pages          # Main application views (Home, Resources, Badges, etc.)
  /services       # Firebase and AI service initializations
  /lib            # Utility functions and constants
  App.tsx         # Main routing and layout logic
  index.css       # Global styles and Tailwind configuration
  firebase.ts     # Firebase SDK initialization
```

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- A Google Cloud Project with Gemini API enabled
- A Firebase Project

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/synk-app.git
   cd synk-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Firebase config (from your Firebase Console)
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## How to Export from AI Studio
To export this project for GitHub:
1. Open the **Settings** menu (gear icon) in the AI Studio sidebar.
2. Select **Export to GitHub** or **Download ZIP**.
3. If downloading a ZIP, extract it and push to your repository using:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

---
*Built with  for womens campus safety.*
