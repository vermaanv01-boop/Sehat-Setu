# 🏥 SehatSetu — Digital Healthcare Bridge

SehatSetu is a digital healthcare platform that connects **rural Primary Health Centres (PHC)** with **urban specialist hospitals**. It enables remote diagnosis, reduces unnecessary travel costs, and ensures timely medical care even in low-connectivity areas.

---

## 🚨 Problem Statement

- Over **65% of India's population** lives in rural areas, but only ~25% of doctors serve there.
- Patients often travel **50–100 km** for specialist consultation.
- Delays in diagnosis lead to **preventable deaths** in critical cases.

SehatSetu reduces this gap by enabling real-time digital referrals and remote diagnosis.

---

## 🌟 Features

### 🌐 Application-Wide
| Feature | Description |
|---|---|
| 🗣️ **Bilingual Input** | Support for symptom input in English, Hindi (Devanagari), and Hinglish |
| 🌙 **Dark Mode** | Toggle between light and dark themes, persisted via localStorage |
| 🔙 **Navigation Bar** | Sticky top navbar with home link, role-aware dashboard/history links |
| 🔍 **Search System** | Filter cases by patient name, symptoms, or suspected disease |
| 🕓 **Unified History** | Complete patient history accessible from both PHC and Urban views |

### 🏥 PHC Dashboard
- Submit new patient referrals with name, age, gender, symptoms, and file uploads
- Auto disease detection based on entered symptoms
- Dashboard overview with **stats cards**, **pie chart**, and **line chart**
- Urgency alert pop-ups for **Critical** and **High** risk cases
- Sortable case list with urgency-colored cards

### 🏢 Urban Hospital Dashboard
- View and respond to incoming PHC referrals
- Submit guidance notes and upload files (X-rays, prescriptions)
- Dashboard overview with stats, pie chart, and line chart
- Pending requests sorted by urgency (Critical first)
- Badge counter showing number of unread pending cases

### 📊 Analytics
| Chart | Details |
|---|---|
| 🥧 **Pie Chart** | Distribution of cases by urgency level (Critical / High / Medium / Low) |
| 📈 **Line Chart** | Cases over the last 7 days, broken down by urgency level |
| 📦 **Stats Cards** | Total Cases, Pending, Responded, Critical, High Risk, Low Risk |

### 🚨 Urgency Badges & Alerts
- Color-coded urgency badges: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low
- Animated pop-up alert modal when a Critical or High urgency case is submitted
- Pulsing icon, advice text, and one-click acknowledgment

---

## 🗂️ Project Structure

```
src/
├── assets/                 # Logo and static assets
├── Components/
│   ├── Badge.jsx           # Urgency & status badge
│   ├── LineChart.jsx       # SVG line chart (last 7 days)
│   ├── Navbar.jsx          # Sticky nav bar with dark mode toggle
│   ├── PieChart.jsx        # SVG pie chart by urgency
│   ├── ReferralCard.jsx    # Patient case card
│   ├── StatsCards.jsx      # Summary stat tiles
│   ├── TimeAgo.jsx         # Relative timestamp display
│   └── UrgencyAlert.jsx    # Critical/High urgency popup modal
├── context/
│   ├── DataContext.jsx     # Global request state (localStorage)
│   └── ThemeContext.jsx    # Dark/Light theme context
├── pages/
│   ├── Homepage.jsx        # Landing page with role selector
│   ├── PHCDashboard.jsx    # PHC dashboard (Overview / New Patient / Cases)
│   ├── UrbanDashboard.jsx  # Urban dashboard (Overview / Incoming / All Cases)
│   └── History.jsx         # Unified patient history with filters
├── styles/
│   └── styles.js           # Shared style constants (urgency, status colors)
├── utils/
│   ├── diseaseDetector.js  # Keyword-based disease + urgency detection
│   └── diseases.json       # Disease database with keywords, risk, advice
├── App.jsx                 # Router setup
├── index.css               # Global CSS with light/dark CSS variables
└── main.jsx                # App entry point with providers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Install & Run

```bash
# Clone the repository
git clone <your-repo-url>
cd Sehat-Setu

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Context API** | Global state management |
| **localStorage** | Data persistence |
| **SVG** | Custom pie & line charts (no chart library) |
| **Vanilla CSS** | Styling with CSS custom properties |

---

## 🔀 User Flow

```
Homepage
  └── PHC Dashboard (/phc/dashboard)
  │     ├── Overview (Stats + Charts)
  │     ├── New Patient Form → disease detection → urgency alert
  │     ├── All Cases (searchable)
  │     └── History (/history/phc)
  └── Urban Hospital (/urban/dashboard)
        ├── Overview (Stats + Charts)
        ├── Incoming (pending referrals, sorted by urgency)
        ├── All Cases (searchable)
        └── History (/history/urban)

Shared History (/history)
  └── All records from both PHC + Urban
  └── Filter by urgency, source, and status
```

---

## 📸 Urgency Levels

| Level | Color | Trigger |
|---|---|---|
| 🔴 Critical | Red | Heart attack, stroke, severe breathing difficulty, etc. |
| 🟠 High | Orange | Burns, appendicitis, seizures, etc. |
| 🟡 Medium | Yellow | Dengue, food poisoning, flu, etc. |
| 🟢 Low | Green | Common cold, minor injuries, etc. |

---

## 👥 Roles

- **PHC Worker** — Submits patient referrals to urban hospitals
- **Urban Hospital** — Reviews referrals, provides specialist guidance

---

## 📄 License

MIT License — free to use, modify, and distribute.
