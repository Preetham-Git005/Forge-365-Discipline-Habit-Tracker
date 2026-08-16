# 🔥 Forge 365 — Discipline & Habit Tracker

> **Build discipline. Track consistency. Forge your year.**

Forge 365 is a **365-day discipline and habit tracking application** designed to help users build consistent routines, track daily execution, measure progress, and stay accountable throughout a full year.

The application combines habit tracking, streaks, yearly progress visualization, analytics, milestones, daily reflection, and a cinematic dark interface into one focused discipline system.

---

## ✨ Overview

Forge 365 is built around a simple idea:

> **Consistency over motivation.**

Instead of only tracking whether a habit was completed, Forge 365 turns a full year of daily actions into a visual journey.

Users can create habits, organize them by time and category, check them off each day, maintain streaks, review historical performance, and visualize their entire year through a 365-day discipline matrix.

---

## 🎯 Core Features

### 🔥 Daily Habit Command Center

* Track daily habits from a centralized dashboard
* Check habits off as they are completed
* Track custom daily quotas such as:

  * Pages read
  * Push-ups completed
  * Water consumed
  * Other measurable targets
* Track individual habit streaks
* Filter habits by:

  * Morning
  * Afternoon
  * Evening
  * Anytime

The application supports habit categories including:

* 🧠 Mind
* 💪 Body
* 🎨 Craft
* 🧘 Soul
* ⚡ Vitality

---

### 🗓️ 365-Day Discipline Matrix

Forge 365 provides an interactive full-year tracking system inspired by contribution graphs.

Features include:

* 365-day visual grid
* Completion-based intensity levels
* Historical date inspection
* Daily progress visualization
* Year countdown
* Days elapsed vs. days remaining

The goal is to make long-term consistency visible rather than relying only on daily statistics.

---

### 📊 Growth & Analytics

The application provides a dedicated analytics experience for understanding discipline and habit performance.

Planned analytics include:

* Daily completion trends
* 7-day performance
* 30-day performance
* 90-day performance
* 365-day performance
* Category balance
* Weekly performance distribution
* Current streak
* Best streak
* Overall discipline statistics

Charts are planned using **Recharts**.

---

### 🏆 XP, Levels & Milestones

Forge 365 includes a progression system designed to make consistency rewarding.

Users can earn XP through completed habits and progress through discipline levels.

The planned progression ranges from:

**Level 1 — Neophyte**

to

**Level 50 — Stoic Titan**

The application also includes milestone concepts such as:

* 🔥 7-Day Iron Chain
* 🏰 30-Day Fortress
* 💯 Century Club
* 🏆 Unbroken 365

---

### 🌙 Daily Reflection

Forge 365 includes an evening reflection system for recording:

* Daily thoughts
* Gratitude
* Obstacles
* End-of-day reflections

This complements habit tracking by focusing not only on **what was completed**, but also on daily reflection and accountability.

---

### 🎨 Cinematic Dark Interface

Forge 365 follows a dark cinematic minimalist design.

The planned visual language includes:

* Obsidian-style dark background
* High-contrast interface
* Crimson accents
* Gold highlights
* Ambient glow
* Discipline and Stoic-inspired imagery
* Minimal visual distractions

The design direction is intended to create a focused environment for daily execution.

---

### 🎵 Focus & Sound

The application includes support for optional audio feedback using the **Web Audio API**.

This can provide satisfying completion sounds when habits are checked off, while still allowing the user to toggle sound effects.

---

## 💾 Data & Synchronization

Forge 365 is designed around local-first data management.

### Local Storage

Habit and progress data can be automatically persisted using:

```text
localStorage
```

### Cross-Tab Synchronization

The application uses the:

```text
BroadcastChannel API
```

to synchronize changes between browser tabs.

### Backup & Restore

Users can export their application data as JSON and import it later for backup or synchronization.

The project also includes a planned demo-data generator for visualizing historical statistics.

---

## 🛠️ Technology Stack

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| React                | User interface                   |
| TypeScript           | Application development          |
| Vite                 | Development and production build |
| Tailwind CSS         | Styling                          |
| Lucide React         | Icons                            |
| Recharts             | Analytics and charts             |
| date-fns             | Date handling                    |
| canvas-confetti      | Celebration effects              |
| clsx                 | Conditional styling              |
| tailwind-merge       | Tailwind class management        |
| Web Audio API        | Sound effects                    |
| LocalStorage         | Local data persistence           |
| BroadcastChannel API | Cross-tab synchronization        |

The planned dependency stack is defined in the project implementation plan.

---

## 🏗️ Architecture

The application is structured around reusable React components, centralized state management, utilities, and typed data models.

```text
src/
│
├── components/
│   ├── Navbar.tsx
│   ├── HeroQuote.tsx
│   ├── HabitList.tsx
│   ├── HabitCard.tsx
│   ├── HabitModal.tsx
│   ├── YearHeatmap.tsx
│   ├── Dashboard.tsx
│   ├── ReflectionModal.tsx
│   ├── BackgroundSelector.tsx
│   └── DataSyncModal.tsx
│
├── context/
│   └── HabitContext.tsx
│
├── types/
│   └── index.ts
│
└── utils/
    ├── storage.ts
    ├── sound.ts
    ├── quotes.ts
    └── presets.ts
```

The implementation plan defines this component and utility architecture to separate UI, state management, persistence, and reusable functionality.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* Git

### Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/forge-365-discipline-habit-tracker.git
```

### Enter the project

```bash
cd forge-365-discipline-habit-tracker
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

### Create production build

```bash
npm run build
```

The production build will be generated in:

```text
dist/
```

---

## 📱 Mobile Application

Forge 365 is currently structured as a web application and can be packaged for mobile using **Capacitor**.

Planned mobile architecture:

```text
React + TypeScript
        ↓
      Vite
        ↓
 Production Build
        ↓
    Capacitor
        ↓
     Android
        ↓
    APK / AAB
```

The mobile version can eventually provide a dedicated Android experience while keeping the existing React application as the core interface.

---

## 🗺️ Development Roadmap

### Phase 1 — Core Habit Tracking

* [x] Habit management
* [x] Daily habit check-ins
* [x] Habit categories
* [x] Daily progress
* [x] Streak tracking
* [x] Time-based filtering

### Phase 2 — Year Tracking

* [x] 365-day journey concept
* [x] Year progress
* [x] Daily history
* [x] Discipline heatmap

### Phase 3 — Analytics & Progression

* [ ] Advanced analytics
* [ ] XP progression
* [ ] Leveling system
* [ ] Achievements
* [ ] Milestones
* [ ] Extended performance insights

### Phase 4 — Data Management

* [ ] JSON export
* [ ] JSON import
* [ ] Backup management
* [ ] Demo data generation
* [ ] Cross-device synchronization

### Phase 5 — Mobile

* [ ] Mobile UI optimization
* [ ] Android application
* [ ] App icon
* [ ] Splash screen
* [ ] Habit reminders
* [ ] Push notifications

> **Note:** Roadmap items represent planned development and may change as the project evolves.

---

## 🧪 Verification

The application is intended to be tested for:

* Habit creation and editing
* Custom quotas and frequencies
* Habit completion
* Streak calculations
* XP updates
* Historical date switching
* 365-day heatmap rendering
* Analytics calculations
* Cross-tab synchronization
* JSON export/import
* Responsive design
* Sound controls

These verification areas are defined in the project's implementation plan.

---

## 🎯 Project Vision

Forge 365 is more than a simple checklist.

The long-term goal is to create a system where daily actions become measurable progress across an entire year.

```text
Daily Action
     ↓
Habit Completion
     ↓
Consistency
     ↓
Streak
     ↓
XP & Progress
     ↓
365-Day Discipline
```

---

## 👨‍💻 Developer

**Sai Preetham**

B.Tech — Computer Science Engineering
Specialization: Data Science

---

## 📌 Project Status

**🚧 Active Development**

Forge 365 is an actively developed discipline and habit tracking application. The core experience is being developed around daily habit execution, yearly progress visualization, analytics, and long-term consistency.

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

---

> **Forge the person you want to become — one disciplined day at a time.**
