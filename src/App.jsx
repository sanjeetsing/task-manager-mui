import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import CreateTask from "./pages/CreateTask";
import Profile from "./pages/Profile";
import CalendarView from "./pages/CalendarView";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";
import { UserProvider } from "./context/UserContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <UserProvider>
            <TaskProvider>
              <Router>
                <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks/create" element={<CreateTask />} />
                    <Route path="/tasks/:taskId" element={<TaskDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/admin" element={<AdminPanel />} />
                  </Routes>
                </Layout>
              </Router>
            </TaskProvider>
          </UserProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
