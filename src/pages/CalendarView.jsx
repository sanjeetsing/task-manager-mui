import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  LinearProgress,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

// Setup react-big-calendar with date-fns
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { tasks, users } = useTask();
  const isAdmin = currentUser.role === "admin";

  const [selectedUser, setSelectedUser] = useState(
    isAdmin ? "all" : currentUser.id
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const userMatch = selectedUser === "all" || task.userId === selectedUser;
    const statusMatch =
      selectedStatus === "all" || task.status === selectedStatus;
    return userMatch && statusMatch;
  });

  const calendarEvents = filteredTasks.map((task) => {
    const endDate = new Date(task.deadline);
    endDate.setDate(endDate.getDate() + 1);
    return {
      id: task.id,
      title: task.title,
      start: new Date(task.deadline),
      end: endDate,
      status: task.status,
      taskData: task,
    };
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = "#9e9e9e";
    switch (event.status) {
      case "pending":
        backgroundColor = "#ff9800";
        break;
      case "submitted":
        backgroundColor = "#2196f3";
        break;
      case "approved":
        backgroundColor = "#4caf50";
        break;
      case "rejected":
        backgroundColor = "#f44336";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.taskData);
    setPreviewOpen(true);
  };

  const handleViewFullTask = () => {
    if (selectedTask) {
      setPreviewOpen(false);
      navigate(`/tasks/${selectedTask.id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? "Task Calendar (Admin View)" : "Your Task Calendar"}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {isAdmin && (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by User</InputLabel>
                  <Select
                    value={selectedUser}
                    label="Filter by User"
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Filter by Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Tooltip title="Pending Tasks">
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{ bgcolor: "#ff9800", color: "white" }}
                  />
                </Tooltip>
                <Tooltip title="Submitted Tasks">
                  <Chip
                    label="Submitted"
                    size="small"
                    sx={{ bgcolor: "#2196f3", color: "white" }}
                  />
                </Tooltip>
                <Tooltip title="Approved Tasks">
                  <Chip
                    label="Approved"
                    size="small"
                    sx={{ bgcolor: "#4caf50", color: "white" }}
                  />
                </Tooltip>
                <Tooltip title="Rejected Tasks">
                  <Chip
                    label="Rejected"
                    size="small"
                    sx={{ bgcolor: "#f44336", color: "white" }}
                  />
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={2} sx={{ height: 600, p: 2 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={["month", "week", "day"]}
          tooltipAccessor={(event) => `${event.title} (${event.status})`}
        />
      </Paper>

      {/* Task Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                  {selectedTask.title}
                </Typography>
                <Chip
                  label={
                    selectedTask.status.charAt(0).toUpperCase() +
                    selectedTask.status.slice(1)
                  }
                  size="small"
                  color={getStatusColor(selectedTask.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" paragraph>
                {selectedTask.description}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Progress
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={selectedTask.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >{`${selectedTask.progress}%`}</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2">Deadline</Typography>
              <Typography variant="body2" gutterBottom>
                {format(new Date(selectedTask.deadline), "MMMM dd, yyyy")}
              </Typography>

              {selectedTask.photos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Photos ({selectedTask.photos.length})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This task has {selectedTask.photos.length} attached photo
                    {selectedTask.photos.length > 1 ? "s" : ""}.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>Close</Button>
              <Button variant="contained" onClick={handleViewFullTask}>
                View Full Task
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
