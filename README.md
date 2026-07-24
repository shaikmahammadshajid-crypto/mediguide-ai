# MediGuide AI

<div align="center">

## Intelligent AI-Powered Healthcare Assistant Platform

MediGuide AI is a full-stack healthcare web application that helps patients manage health records, track medicines, explore disease information, monitor reminders, and ask AI-powered health questions through a modern React interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

</div>

## Project Overview

MediGuide AI is an AI-enabled healthcare assistant designed for patient support, medical record management, medicine ordering workflows, disease education, reminders, and health tracking. The app combines a responsive React frontend with an Express backend that exposes AI endpoints powered by Google Gemini.

The platform is tailored for the Indian healthcare context, including emergency guidance, INR-based cost assumptions, and patient-friendly explanations. It is built for educational and healthcare-assistance use and does not replace licensed medical professionals.

## Features

- AI healthcare assistant with structured medical guidance
- Emergency keyword detection and safety warnings
- Medical report explanation endpoint
- Symptom checker endpoint
- Patient health dashboard
- Disease information library
- Medicine store and cart workflow
- Order tracking
- Medical records vault
- Health reminders and appointments
- Patient profile management
- Demo role switching for patient, doctor, and admin views
- Admin management for diseases, medicines, and orders
- Firebase integration with localStorage fallback
- Responsive light and dark UI
- Production deployment support through Render

## AI Capabilities

| Capability | Details |
| --- | --- |
| AI Provider | Google Gemini via `@google/genai` |
| Backend Route | `/api/ai/chat` |
| Report Analysis | `/api/ai/analyze-report` |
| Symptom Checker | `/api/ai/symptom-checker` |
| Safety Layer | Emergency keyword detection |
| Fallback Mode | Local intelligent simulation when API key is missing |
| Target Context | Indian healthcare ecosystem |

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Chart.js
- React Chart.js 2
- Motion

### Backend

- Node.js
- Express.js
- TypeScript
- Google Gemini API
- dotenv

### Database and Storage

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Browser localStorage fallback for demo mode

### Deployment

- Render Web Service
- Production build with Vite and esbuild

## Project Structure

```text
mediguide-ai/
│
├── index.html
├── package.json
├── package-lock.json
├── render.yaml
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── firebase-applet-config.json
├── README.md
│
├── assets/
│
├── dist/
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types.ts
    │
    ├── components/
    │   ├── AdminPanel.tsx
    │   ├── AiAssistant.tsx
    │   ├── AuthModal.tsx
    │   ├── CartDrawer.tsx
    │   ├── DiseaseLibrary.tsx
    │   ├── HealthDashboard.tsx
    │   ├── MedicalRecordsVault.tsx
    │   ├── MedicineStore.tsx
    │   ├── Navbar.tsx
    │   ├── OrderTracker.tsx
    │   ├── PatientProfileView.tsx
    │   └── RemindersManager.tsx
    │
    ├── data/
    │   └── mockData.ts
    │
    ├── lib/
    │   └── firebase.ts
    │
    └── services/
        └── api.ts
```

## Installation

### Prerequisites

- Node.js 22 or newer
- npm
- Optional: Google Gemini API key

### Clone Repository

```bash
git clone https://github.com/shaikmahammadshajid-crypto/mediguide-ai.git
```

### Navigate to Project

```bash
cd mediguide-ai
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` or `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

The app can still run without a Gemini key using built-in fallback responses.

### Run Application

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

Run on a different port:

```bash
PORT=3001 npm run dev
```

## Production Build

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Workflow

```text
User Opens MediGuide AI
│
▼
Dashboard Loads Patient Health Data
│
▼
User Navigates to Assistant / Records / Pharmacy / Reminders
│
▼
Frontend Calls Express Backend or Firebase Layer
│
▼
Gemini AI Generates Medical Guidance
│
▼
Safety Checks and Fallback Handling
│
▼
Results Displayed in Responsive UI
```

## Security and Safety Features

- Firebase authentication support
- Local demo fallback for development
- Server-side validation for AI chat requests
- Emergency symptom keyword detection
- Medical disclaimer in AI responses
- No hard dependency on live API keys during demo mode
- Environment-variable based API key handling

## Deployment

This project includes `render.yaml`, so it can be deployed publicly on Render.

### Deploy on Render

1. Push this project to GitHub.
2. Open https://render.com.
3. Create a new Blueprint or Web Service from the GitHub repository.
4. Render will detect `render.yaml`.
5. Add `GEMINI_API_KEY` in Render environment variables if live AI responses are required.
6. Deploy the service.
7. Use the generated public URL:

```text
https://your-service-name.onrender.com
```

## Useful Commands

```bash
npm run dev
```

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm start
```

## Live Demo

Public deployment URL:

```text
https://shaikmahammadshajid-crypto.github.io/mediguide-ai/
```

## GitHub Repository

```text
https://github.com/shaikmahammadshajid-crypto/mediguide-ai
```

## Future Enhancements

- Real user account onboarding
- Doctor appointment booking
- Prescription upload and OCR
- Advanced medical report parsing
- Push notifications for reminders
- Payment integration for medicine orders
- Role-based admin permissions
- Production Firebase security rules
- Mobile application
- CI/CD deployment pipeline

## Medical Disclaimer

MediGuide AI provides educational health information and general guidance only. It does not provide a medical diagnosis and does not replace consultation with a licensed doctor, hospital, emergency service, or qualified healthcare professional.

For emergencies in India, call `112`, `102`, or `108`, or visit the nearest emergency department immediately.

## Author

**Shaik Mahammad Shajid**  
B.Tech Computer Science & Engineering (Data Science)  
Presidency University

## License

This project is developed for educational and learning purposes.

<div align="center">

If you found this project helpful, consider giving the repository a star.

</div>
