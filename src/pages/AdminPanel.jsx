import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ViewAgenda as ViewIcon,
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { tasks, users, approveTask, rejectTask, deleteTask } = useTask();

  // ✅ Move all hooks to top level
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ✅ Conditional return after hooks
  if (currentUser.role !== "admin") {
    return (
      <Alert severity="error">
        You don't have permission to access the Admin Panel.
      </Alert>
    );
  }

  const getFilteredTasks = () =>
    tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesUser = userFilter === "all" || task.userId === userFilter;
      return matchesSearch && matchesStatus && matchesUser;
    });

  const getTabTasks = () => {
    const filtered = getFilteredTasks();
    if (tabValue === 1) return filtered.filter((t) => t.status === "submitted");
    if (tabValue === 2) return filtered.filter((t) => t.status === "approved");
    if (tabValue === 3) return filtered.filter((t) => t.status === "rejected");
    return filtered;
  };

  const getUserName = (userId) =>
    users.find((u) => u.id === userId)?.fullName || "Unknown User";

  const getStatusChipColor = (status) => {
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

  const handleApproveTask = () => {
    if (selectedTaskId) {
      approveTask(selectedTaskId, approveComment);
      setApproveDialogOpen(false);
      setApproveComment("");
    }
  };

  const handleRejectTask = () => {
    if (selectedTaskId) {
      rejectTask(selectedTaskId, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const handleDeleteTask = () => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId);
      setDeleteDialogOpen(false);
    }
  };

  const displayedTasks = getTabTasks();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <TextField
              label="Search Tasks"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>User</InputLabel>
              <Select
                value={userFilter}
                label="User"
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <MenuItem value="all">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={() => navigate("/tasks/create")}
            >
              Create New Task
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All Tasks (${getFilteredTasks().length})`} />
          <Tab
            label={`Submitted (${
              getFilteredTasks().filter((t) => t.status === "submitted").length
            })`}
          />
          <Tab
            label={`Approved (${
              getFilteredTasks().filter((t) => t.status === "approved").length
            })`}
          />
          <Tab
            label={`Rejected (${
              getFilteredTasks().filter((t) => t.status === "rejected").length
            })`}
          />
        </Tabs>

        <TabPanel value={tabValue} index={tabValue}>
          <TaskTable
            tasks={displayedTasks}
            getUserName={getUserName}
            getStatusChipColor={getStatusChipColor}
            onViewTask={(id) => navigate(`/tasks/${id}`)}
            onApproveTask={(id) => {
              setSelectedTaskId(id);
              setApproveDialogOpen(true);
            }}
            onRejectTask={(id) => {
              setSelectedTaskId(id);
              setRejectDialogOpen(true);
            }}
            onDeleteTask={(id) => {
              setSelectedTaskId(id);
              setDeleteDialogOpen(true);
            }}
          />
        </TabPanel>
      </Paper>

      {/* Dialogs remain unchanged */}

      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add an optional comment for approval.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleApproveTask}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide a reason for rejecting this task.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectTask} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function TaskTable({
  tasks,
  getUserName,
  getStatusChipColor,
  onViewTask,
  onApproveTask,
  onRejectTask,
  onDeleteTask,
}) {
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>No tasks found.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>{task.title}</TableCell>
              <TableCell>{getUserName(task.userId)}</TableCell>
              <TableCell>
                {format(new Date(task.deadline), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2">{`${task.progress}%`}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={task.status}
                  size="small"
                  color={getStatusChipColor(task.status)}
                />
              </TableCell>
              <TableCell>
                <Box display="flex">
                  <IconButton
                    onClick={() => onViewTask(task.id)}
                    color="primary"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  {task.status === "submitted" && (
                    <>
                      <IconButton
                        onClick={() => onApproveTask(task.id)}
                        color="success"
                      >
                        <ApproveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onRejectTask(task.id)}
                        color="error"
                      >
                        <RejectIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    onClick={() => onDeleteTask(task.id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
