# Ideas.net

A collaborative platform for sharing, validating, and building startup ideas. Connect founders, investors, makers, and mentors in a modern, AI-augmented community.

---

## 🚀 Project Overview
Ideas.net is an open-source platform where anyone can:
- Post and refine startup ideas
- Gather feedback and validation from the community
- Upvote, comment, and express interest ("Would Invest", "Would Use")
- Collaborate in real time and leverage AI-powered discussion summaries

**Target users:** Founders, investors, indie hackers, mentors, and innovation enthusiasts.

---

## ✨ Key Features
- **Idea Submission:** Create rich idea profiles with tags, problem/solution, and more
- **Discussion Threads:** Comment, ask questions, and give feedback on ideas
- **Voting & Validation:** Upvote, "Would Invest", and "Would Use" signals
- **Real-time Collaboration:** Live updates for comments and votes
- **AI Summaries:** (Planned) Summarize discussions with OpenAI
- **User Roles:** Builder, Investor, Mentor, Enthusiast
- **Private Messaging:** (Planned) Direct messages between users
- **Minimalist, Responsive UI:** Mobile-first, distraction-free design

---

## 🛠️ Tech Stack
- **Frontend:** React (TypeScript), Tailwind CSS, React Query, Socket.io-client
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Real-time:** Socket.io
- **AI Integration:** OpenAI API (planned)
- **Authentication:** JWT, OAuth (Google/LinkedIn, planned)
- **Dev Tools:** ESLint, Prettier, Jest, Docker (optional)

---

## ⚡ Getting Started

### 1. **Clone the Repo**
```bash
git clone https://github.com/YOUR_GITHUB/ideas.net.git
cd ideas.net
```

### 2. **Install Dependencies**
```bash
npm install
cd client && npm install
```

### 3. **Configure Environment Variables**
- Copy `env.example` to `.env` and fill in your secrets (DB, JWT, etc.)
- Do the same for `client/.env` if needed

### 4. **Set Up the Database**
- Make sure PostgreSQL is running
- Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```
- (Optional) Open Prisma Studio to inspect data:
```bash
npx prisma studio
```

### 5. **Start the App (Dev Mode)**
- In the root directory:
```bash
npm run dev
```
- This runs both backend and frontend (concurrently)
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

---

## 🧩 Project Structure
```
ideas.net/
  ├── client/           # React frontend
  ├── prisma/           # Prisma schema & migrations
  ├── src/
  │   ├── server/       # Express API routes
  │   ├── middleware/   # Auth, error handling, etc.
  │   ├── utils/        # Logger, database, etc.
  │   └── ...
  ├── .env.example      # Example environment variables
  ├── package.json      # Project scripts & dependencies
  └── README.md         # This file
```

---

## 📝 Environment Variables
See `env.example` for all required variables. Key ones:
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (JWT signing key)
- `OPENAI_API_KEY` (for AI features, optional)
- `FRONTEND_URL`, `APP_URL`, etc.

---

## 🧑‍💻 Development Workflow
- **Backend:** Edit code in `src/`, restart server as needed
- **Frontend:** Edit code in `client/src/`, hot reload enabled
- **Database:** Update `prisma/schema.prisma`, then run `npx prisma migrate dev`
- **Testing:** Add tests in `src/` or `client/src/` and run `npm test`

---

## 🤝 Contributing
We welcome contributions! To get started:
1. Fork the repo and create a new branch
2. Make your changes (add tests where possible)
3. Run `npm run lint` and `npm run test` to ensure code quality
4. Open a pull request with a clear description

**Ideas for contribution:**
- New features (AI, messaging, notifications, etc.)
- UI/UX improvements
- Bug fixes and refactoring
- Documentation and tutorials

---

## 📬 Community & Support
- **GitHub Issues:** Use for bugs, feature requests, and questions
- **Discussions:** (Planned) Join our GitHub Discussions for community Q&A
- **Contact:** Add your email or Discord/Slack link here

---

## 📝 License
MIT — Free for personal and commercial use. See [LICENSE](LICENSE).

---

**Let's build the future of startup collaboration, together!** 