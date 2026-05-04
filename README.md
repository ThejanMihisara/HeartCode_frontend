<div align="center">

<img src="public/game-assets/revive-heart.svg" width="64" height="64" alt="HeartCode Runner Logo" />

# ⚔️ HeartCode Runner

**A browser-based endless runner game where knights battle dragons, collect eggs, and solve coding puzzles to survive.**

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-heartcode--runner.vercel.app-6D28D9?style=for-the-badge)](https://heartcode-runner.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-HeartCode_Runner-181717?style=for-the-badge&logo=github)](https://github.com/ThejanMihisara/HeartCode)
[![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

</div>

---

## 🎮 About the Game

HeartCode Runner is a full-stack browser-based endless runner where you play as a brave knight sprinting through enchanted forests. Jump over fire-breathing dragons, collect glowing dragon eggs to boost your score, and hunt for hidden hearts to earn extra lives.

The twist? When your knight falls — **you must solve a coding puzzle to revive**. Answer correctly and your knight fights on. Fail, and the dragon wins.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏃 **Endless Runner Gameplay** | Smooth sprite-animated knight with physics-based jumping |
| 🐉 **Three Difficulty Modes** | Easy, Medium, and Hard — each with unique speed, gaps, and hitboxes |
| 🥚 **Dragon Egg Collection** | Collect eggs mid-run to earn points and increase game speed |
| 💜 **Heart Collectibles** | Hidden hearts grant +1 extra revive chance per session |
| 🧩 **Puzzle Revive System** | Solve a coding challenge to bring your knight back from defeat |
| 💾 **Checkpoint Save System** | Auto-saves every 7 seconds — resume your run anytime |
| 🏆 **Global Leaderboard** | Compete with all players for the highest score |
| 📊 **Progress Log** | Track your personal run history, scores, and stats |
| 🔐 **User Authentication** | Secure login/register with JWT tokens and httpOnly cookies |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-338?style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB database (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/ThejanMihisara/HeartCode.git
cd HeartCode
```

### 2. Setup the Backend

```bash
cd HeartCode_backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd HeartCode_frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the Game

Visit `http://localhost:5173` in your browser and start your adventure! 🎮

---

## 🎯 How to Play

| Control | Action |
|---|---|
| `Enter` | Start the game |
| `Space` / `↑ Arrow` | Jump over dragons |
| `R` | Restart current run |

1. **Run** through the forest and jump over dragons
2. **Collect dragon eggs** — each egg adds 50 points
3. **Find the hidden heart** to gain an extra revive chance
4. **Get hit?** Solve the coding puzzle to revive your knight
5. **Save & Exit** anytime to resume your run later

---

## 📁 Project Structure

```
HeartCode/
├── HeartCode_frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.js          # Axios instance with auth interceptor
│   │   │   └── auth.js         # Auth context & JWT management
│   │   ├── pages/
│   │   │   ├── game/
│   │   │   │   ├── gameConfig.js   # Sprite paths & mode configs
│   │   │   │   └── gameHelpers.js  # Physics & game utilities
│   │   │   ├── game.jsx        # Main game engine (rAF loop)
│   │   │   ├── menu.jsx        # Game menu & mode selection
│   │   │   ├── login.jsx       # Authentication
│   │   │   ├── leaderboard.jsx # Global leaderboard
│   │   │   └── profile.jsx     # User profile & stats
│   │   └── main.jsx
│   └── public/
│       └── game-assets/        # Sprites, backgrounds, sounds
│
└── HeartCode_backend/
    ├── controllers/
    │   ├── userController.js   # Auth, login, profile
    │   └── gameController.js   # Runs, checkpoints, leaderboard
    ├── router/
    │   ├── userRouter.js
    │   ├── gameRouter.js
    │   └── heartRouter.js      # Puzzle generation
    ├── models/
    │   └── user.js
    ├── lib/
    │   └── jwtMiddleware.js    # Token verification
    └── index.js
```

---

## 🌐 Deployment

### Frontend (Vercel)

Add a `vercel.json` to the frontend root to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Set the environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend-url.com
```

### Backend (Render / Railway / any Node host)

Set these environment variables on your hosting platform:
```
MONGO_URI        = your Atlas connection string
JWT_SECRET       = your secret
CLIENT_ORIGIN    = https://your-frontend.vercel.app
PORT             = 3000
```

---

## 👤 Author

**Thejan Mihisara**

[![Portfolio](https://img.shields.io/badge/Portfolio-thejanmihisara.vercel.app-6D28D9?style=flat-square)](https://thejanmihisara.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-ThejanMihisara-181717?style=flat-square&logo=github)](https://github.com/ThejanMihisara)

---

<div align="center">

**Built with ❤️ and a lot of dragon dodging**

⭐ Star this repo if you enjoyed the game!

</div>
