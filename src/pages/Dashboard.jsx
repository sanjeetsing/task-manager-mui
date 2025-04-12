import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { format, isWithinInterval, subDays } from "date-fns";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `dashboard-tab-${index}`,
    "aria-controls": `dashboard-tabpanel-${index}`,
  };
}

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "default";
    case "submitted":
      return "info";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

export default function Dashboard() {
  const { currentUser } = useUser();
  const { tasks } = useTask();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const userTasks =
    currentUser.role === "admin"
      ? tasks
      : tasks.filter((task) => task.userId === currentUser.id);

  const currentTasks = userTasks.filter((task) => task.progress < 100);

  const pendingApprovalTasks = userTasks.filter(
    (task) => task.status === "submitted"
  );

  const today = new Date();
  const nextWeek = subDays(today, -7);
  const deadlineApproachingTasks = userTasks.filter(
    (task) =>
      task.progress < 100 &&
      isWithinInterval(task.deadline, { start: today, end: nextWeek })
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Tasks
              </Typography>
              <Typography variant="h3">{currentTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Approval
              </Typography>
              <Typography variant="h3">
                {pendingApprovalTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Deadlines Approaching
              </Typography>
              <Typography variant="h3">
                {deadlineApproachingTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/tasks/create")}
            >
              Create New Task
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => navigate("/calendar")}>
              View Calendar
            </Button>
          </Grid>
          {currentUser.role === "admin" && (
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab label="Current Tasks" {...a11yProps(0)} />
          <Tab label="Pending Approval" {...a11yProps(1)} />
          <Tab label="Approaching Deadlines" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TaskGrid tasks={currentTasks} onView={handleViewTask} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TaskGrid tasks={pendingApprovalTasks} onView={handleViewTask} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TaskGrid tasks={deadlineApproachingTasks} onView={handleViewTask} />
      </TabPanel>
    </Box>
  );
}

function TaskGrid({ tasks, onView }) {
  if (tasks.length === 0) {
    return (
      <Grid item xs={12}>
        <Typography variant="body1" color="textSecondary" align="center">
          No tasks found.
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {tasks.map((task) => (
        <Grid item xs={12} md={6} lg={4} key={task.id}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" noWrap sx={{ maxWidth: "80%" }}>
                  {task.title}
                </Typography>
                <Chip
                  label={task.status}
                  size="small"
                  color={getStatusColor(task.status)}
                />
              </Box>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                noWrap
              >
                {task.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={task.progress}
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" align="right">
                  {task.progress}%
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center">
                <TimeIcon fontSize="small" color="action" />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: 1 }}
                >
                  Due: {format(task.deadline, "MMM dd, yyyy")}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onView(task.id)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
