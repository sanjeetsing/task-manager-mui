
# 🗂️ Task Manager App – React + Vite + Material UI
### 🌐 Live Demo
**▶️ [View Deployed App](https://task-manager-mui.vercel.app)**

---

## 📦 Tech Stack

- ⚛️ **React** (via Vite for fast builds)
- 🎨 **Material UI (MUI)** for responsive and accessible UI
- 🔔 **Notistack** for toast notifications
- 📅 **react-big-calendar** for task scheduling
- 📆 **@mui/x-date-pickers** for date selection
- 🧠 **React Context API** for state management
- 🔀 **React Router DOM** for navigation
- 🧪 **uuid** for mock task/user IDs
- 🗓️ **date-fns** for date formatting

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/sanjeetsing/task-manager-mui.git
cd task-manager-mui

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# App will be available at: http://localhost:5173
```
## 🧠 Design & Architecture Decisions

- **React Context** used instead of Redux for simplicity and scoped state (User, Task).
- **Lazy loading** can be added later to reduce initial bundle size.
- **Separate routes** for user-friendly navigation (Dashboard, Calendar, Admin Panel, etc.)
- **Theming** supported via Material UI’s ThemeProvider (Dark/Light Mode).
- **Mock Data** used to simulate real users and tasks (replaceable with API later).

---## ✅ Features

- 👥 **Role Switching** (Admin / User)
- 📋 **Task Lifecycle**: Create → Submit → Approve / Reject
- 🗓️ **Calendar View** with status-based color coding
- 👤 **Profile Management**
- 🔐 **No Login Required** (mock switcher built-in)
- ⚡ **Fully Responsive** across devices

---

## ⚠️ Known Issues / Future Improvements

- 🔐 **Authentication**: Replace mock user switching with real login
- 🗃️ **Persistence**: Add localStorage or backend API integration
- 💡 **Performance**: Improve code-splitting using lazy loading
- 🌍 **Internationalization (i18n)**: Currently supports only English
- 🧪 **Tests**: No unit or E2E tests added yet

## 📝 Submission Format

- ✅ GitHub Repository: [https://github.com/sanjeetsing/task-manager-mui](https://github.com/sanjeetsing/task-manager-mui)
- ✅ Deployed Link: [https://task-manager-mui.vercel.app](https://task-manager-mui.vercel.app)

---

## 👨‍💻 Author

**Sanjeet Singh**  
🟢 Email: sanjeetsinghsolanki11@gmail.com  
🔗 GitHub: [github.com/sanjeetsing](https://github.com/sanjeetsing)

---


