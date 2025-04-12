import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Slider,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  CalendarMonth as CalendarIcon,
  CloudUpload as UploadIcon,
  DeleteOutline as RemoveIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { tasks, updateTask, deleteTask, submitTask, approveTask, rejectTask } =
    useTask();

  const task = tasks.find((t) => t.id === taskId);

  const [editing, setEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveComment, setApproveComment] = useState("");

  const [formData, setFormData] = useState(
    task
      ? {
          title: task.title,
          description: task.description,
          progress: task.progress,
          deadline: task.deadline,
          photos: [...task.photos],
        }
      : {
          title: "",
          description: "",
          progress: 0,
          deadline: new Date(),
          photos: [],
        }
  );

  if (!task) {
    return (
      <Alert severity="error">
        Task not found. The task might have been deleted or you don't have
        access to it.
      </Alert>
    );
  }

  const isOwner = currentUser.id === task.userId;
  const isAdmin = currentUser.role === "admin";
  const canEdit = isOwner || isAdmin;
  const canSubmit = isOwner && task.status === "pending";
  const canApproveReject = isAdmin && task.status === "submitted";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProgressChange = (event, newValue) => {
    setFormData({
      ...formData,
      progress: newValue,
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({
        ...formData,
        deadline: date,
      });
    }
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim() !== "") {
      setFormData({
        ...formData,
        photos: [...formData.photos, photoUrl],
      });
      setPhotoUrl("");
    }
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
  };

  const handleSave = () => {
    updateTask({
      ...task,
      title: formData.title,
      description: formData.description,
      progress: formData.progress,
      deadline: formData.deadline,
      photos: formData.photos,
    });
    setEditing(false);
  };

  const handleSubmitForApproval = () => {
    submitTask(task.id);
  };

  const handleApproveTask = () => {
    approveTask(task.id, approveComment);
    setApproveDialogOpen(false);
  };

  const handleRejectTask = () => {
    rejectTask(task.id, rejectReason);
    setRejectDialogOpen(false);
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    setDeleteDialogOpen(false);
    navigate("/dashboard");
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Task Details</Typography>
        <Box>
          {canEdit && !editing && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      <Card>
        <CardContent>
          {editing ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Task Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Progress</Typography>
                <Slider
                  value={formData.progress}
                  onChange={handleProgressChange}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                />
                <Typography variant="body2" color="textSecondary" align="right">
                  {formData.progress}%
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Photos</Typography>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <TextField
                    label="Photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    fullWidth
                    placeholder="Enter URL for photo"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UploadIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    sx={{ ml: 2, whiteSpace: "nowrap" }}
                    onClick={handleAddPhoto}
                  >
                    Add Photo
                  </Button>
                </Box>

                {formData.photos.length > 0 && (
                  <Stack spacing={2}>
                    {formData.photos.map((photo, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="img"
                            src={photo}
                            alt={`Task photo ${index + 1}`}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              objectFit: "cover",
                              mr: 2,
                            }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/60?text=Error";
                            }}
                          />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 300 }}
                          >
                            {photo}
                          </Typography>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setEditing(false)}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {task.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">Progress</Typography>
              <LinearProgress
                variant="determinate"
                value={task.progress}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" align="right">
                {task.progress}%
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">Deadline</Typography>
              <Typography variant="body1">
                {format(task.deadline, "PPP")}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">Status</Typography>
              <Chip label={task.status} color={getStatusColor(task.status)} />
              {task.adminComments && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Admin Comments: {task.adminComments}
                </Alert>
              )}
              {task.photos.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 3 }}>
                    Photos
                  </Typography>
                  <ImageList cols={3} rowHeight={100} sx={{ mt: 1 }}>
                    {task.photos.map((photo, index) => (
                      <ImageListItem key={index}>
                        <img src={photo} alt={`task-img-${index}`} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </>
              )}
              <Box sx={{ mt: 4 }} display="flex" gap={2}>
                {canSubmit && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitForApproval}
                    startIcon={<DoneIcon />}
                  >
                    Submit for Approval
                  </Button>
                )}
                {canApproveReject && (
                  <>
                    <Button
                      color="success"
                      variant="contained"
                      onClick={() => setApproveDialogOpen(true)}
                      startIcon={<CheckIcon />}
                    >
                      Approve
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => setRejectDialogOpen(true)}
                      startIcon={<CloseIcon />}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add optional comment for approval:
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleApproveTask}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Task</DialogTitle>
        <DialogContent>
          <DialogContentText>Provide a reason for rejection:</DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectTask} variant="contained" color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
