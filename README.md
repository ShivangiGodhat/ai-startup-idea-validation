# StartupSense AI – AI Startup Idea Validator

StartupSense AI is a full-stack platform that helps entrepreneurs validate startup concepts before committing capital and engineering efforts. It uses language models (OpenAI API) or an advanced rule-based simulation engine to analyze market demand, competitive threats, SWOT items, financial revenue models, and generate investor-ready business plans and pitch decks.

---

## Folder Structure

```text
AI Startup Idea Validator/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB Connection config
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT check & Admin authorization
│   ├── models/
│   │   ├── user.model.js       # User Mongoose Schema
│   │   ├── startup.model.js    # Startup Idea Mongoose Schema
│   │   └── report.model.js     # Analysis Report Mongoose Schema
│   ├── routes/
│   │   ├── auth.routes.js      # Auth Controller Endpoints
│   │   ├── validation.routes.js# Idea Submission & Analytics
│   │   └── chat.routes.js      # Co-pilot chatbot handler
│   ├── services/
│   │   └── openai.service.js   # OpenAI Integration & Mock Fallback
│   ├── .env                    # Secret Configurations
│   ├── package.json            # Node backend package manager
│   ├── seed.js                 # Seeding script for test users
│   └── server.js               # Entry script
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images & Vector graphics
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation Bar
│   │   │   ├── Footer.jsx      # Sticky page Footer
│   │   │   └── ChatAssistant.jsx # Floating AI chatbot drawer
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing Page
│   │   │   ├── Login.jsx       # Login & Forgot Password Form
│   │   │   ├── Register.jsx    # Registration Form
│   │   │   ├── Dashboard.jsx   # KPI widgets & report list
│   │   │   ├── NewValidation.jsx # Form with status loading stages
│   │   │   ├── ReportDetails.jsx # SWOT grids & Chart graphs
│   │   │   ├── BusinessPlanPage.jsx # Outline sidebar & A4 PDF downloader
│   │   │   ├── PitchDeckPage.jsx # Slides viewer & Landscape PDF exporter
│   │   │   ├── Profile.jsx     # Update Profile name, email, password
│   │   │   └── AdminPanel.jsx  # Admin user query panel
│   │   ├── App.jsx             # React routing & AuthContext provider
│   │   ├── index.css           # Global CSS and Tailwind Imports
│   │   └── main.jsx            # React client bootstrap entry
│   ├── index.html              # HTML core shell & SEO descriptions
│   ├── package.json            # Front dependencies
│   ├── tailwind.config.js      # Tailwind Config (v4 configured in index.css)
│   └── vite.config.js          # Vite plugins builder config
└── README.md                   # This document
```

---

## Environment Variables Configuration

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/startupsense
JWT_SECRET=startupsense_secret_key_123456_super_secure
OPENAI_API_KEY=your_openai_api_key_here
```
> [!NOTE]
> If `OPENAI_API_KEY` is left blank, StartupSense AI automatically operates in **Simulator Mode**, generating highly structured and realistic business templates and keyword-aware chat advisor feedback based on your chosen industry segment.

---

## Startup Guide

### Prerequisites
- Install **Node.js** (v18 or higher)
- Install and start **MongoDB** local service (`mongodb://127.0.0.1:27017`)

### Step 1: Set up Backend and Seed Database
Run the following commands in the `backend/` directory:
```bash
# Install packages
npm install

# Seed test user credentials (admin@startupsense.ai and user@startupsense.ai)
node seed.js

# Launch backend Express server
npm run dev
```

### Step 2: Start Frontend
Run the following commands in the `frontend/` directory:
```bash
# Install packages
npm install --legacy-peer-deps

# Launch Vite hot-reloading development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Pre-seeded Test Credentials

For fast testing of admin and client dashboards without registering:

- **Standard User**:
  - Email: `user@startupsense.ai`
  - Password: `userpassword`
- **System Admin**:
  - Email: `admin@startupsense.ai`
  - Password: `adminpassword`

---

## API Documentation

All routes assume base url `http://localhost:5000`.

### 1. User Authentication (`/api/auth`)

#### Register User
- **Method / Path**: `POST /register`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`
- **Success Response (201)**: Returns user document with a JWT token inside `token`.

#### Login User
- **Method / Path**: `POST /login`
- **Body**: `{ "email": "john@example.com", "password": "securepassword" }`
- **Success Response (200)**: Returns user document with `token`.

#### Reset password (simulation)
- **Method / Path**: `POST /forgot-password`
- **Body**: `{ "email": "john@example.com" }`
- **Success Response (200)**: `{ "message": "Recovery email sent! Check your inbox for recovery link...", "debugCode": "123456" }`

#### Get Profile
- **Method / Path**: `GET /profile`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200)**: Returns user profile credentials.

---

### 2. Idea Validation (`/api/validation`)
*Requires `Authorization: Bearer <token>` header.*

#### Submit Startup Concept
- **Method / Path**: `POST /submit`
- **Body**:
  ```json
  {
    "startupName": "ResumeAI",
    "description": "An AI resume tailoring app for ATS filters.",
    "industry": "AI & Machine Learning",
    "targetMarket": "College Graduates",
    "country": "USA",
    "businessModel": "Freemium"
  }
  ```
- **Success Response (201)**: Returns created idea model and the full generated report details containing SWOT list, competitor indexes, business plan, and slide layouts.

#### View Validation History
- **Method / Path**: `GET /history`
- **Success Response (200)**: Returns an array of previous report objects with ideas populated.

#### Get Report Details
- **Method / Path**: `GET /report/:reportId`
- **Success Response (200)**: Returns full parameters of a validation report.

#### Re-Run AI Analysis
- **Method / Path**: `POST /report/:reportId/re-run`
- **Success Response (200)**: Re-runs validation and returns updated report.

#### Email PDF report (simulation)
- **Method / Path**: `POST /report/:reportId/email`
- **Success Response (200)**: Returns simulated confirmation.

---

### 3. Advisor Chat Assistant (`/api/chat`)
*Requires `Authorization: Bearer <token>` header.*

#### Ask Advisor Question
- **Method / Path**: `POST /message`
- **Body**: `{ "message": "How do I mitigate my competitor threats?", "reportId": "report_id_here" }`
- **Success Response (200)**: `{ "reply": "AI/Mock business advice feedback" }`
