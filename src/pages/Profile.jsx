import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

export default function Profile() {
  const { currentUser, updateUser } = useUser();
  const { tasks } = useTask();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    mobileNumber: currentUser.mobileNumber,
    profilePhoto: currentUser.profilePhoto,
  });

  const userTasks = tasks.filter((task) => task.userId === currentUser.id);
  const completedTasks = userTasks.filter((task) => task.progress === 100);
  const pendingTasks = userTasks.filter((task) => task.status === "pending");
  const approvedTasks = userTasks.filter((task) => task.status === "approved");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      ...currentUser,
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      profilePhoto: formData.profilePhoto,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentUser.fullName,
      mobileNumber: currentUser.mobileNumber,
      profilePhoto: currentUser.profilePhoto,
    });
    setEditing(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  src={currentUser.profilePhoto}
                  alt={currentUser.fullName}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  {currentUser.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentUser.role.charAt(0).toUpperCase() +
                    currentUser.role.slice(1)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <PhoneIcon color="action" sx={{ mr: 2 }} />
                  <Typography variant="body1">
                    {currentUser.mobileNumber}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <BadgeIcon color="action" sx={{ mr: 2 }} />
                  <Typography variant="body1">ID: {currentUser.id}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="h4">{userTasks.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Tasks
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="h4">
                      {completedTasks.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Completed
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="h4">{pendingTasks.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="h4">{approvedTasks.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Approved
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h5">
                  {editing ? "Edit Profile" : "Profile Information"}
                </Typography>
                {!editing && (
                  <IconButton color="primary" onClick={() => setEditing(true)}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>

              {editing ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="mobileNumber"
                        label="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="profilePhoto"
                        label="Profile Photo URL"
                        value={formData.profilePhoto}
                        onChange={handleInputChange}
                        fullWidth
                        helperText="Enter a URL for your profile picture"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Role"
                        value={currentUser.role}
                        fullWidth
                        disabled
                        helperText="Role cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <Box>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Your profile information is displayed below. You can edit
                    your profile by clicking the edit button.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {currentUser.fullName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Mobile Number
                      </Typography>
                      <Typography variant="body1">
                        {currentUser.mobileNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        User Role
                      </Typography>
                      <Typography variant="body1">
                        {currentUser.role.charAt(0).toUpperCase() +
                          currentUser.role.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        User ID
                      </Typography>
                      <Typography variant="body1">{currentUser.id}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Box display="flex" alignItems="center">
                    <AssignmentIcon color="action" sx={{ mr: 2 }} />
                    <Typography variant="body1">
                      You have <strong>{pendingTasks.length}</strong> tasks
                      pending and <strong>{completedTasks.length}</strong> tasks
                      completed.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
