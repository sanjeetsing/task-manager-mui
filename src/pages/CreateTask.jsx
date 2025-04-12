import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Slider,
  InputAdornment,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  CalendarMonth as CalendarIcon,
  CloudUpload as UploadIcon,
  Cancel as CancelIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useUser } from "../context/UserContext";
import { useTask } from "../context/TaskContext";

export default function CreateTask() {
  const { currentUser } = useUser();
  const { addTask } = useTask();
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    progress: 0,
    deadline: tomorrow,
    status: "pending",
    userId: currentUser.id,
    photos: [],
  });

  const [photoUrl, setPhotoUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
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
      if (errors.deadline) {
        setErrors({
          ...errors,
          deadline: "",
        });
      }
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.deadline < today) {
      newErrors.deadline = "Deadline cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addTask({ ...formData });
      navigate("/dashboard");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Task
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Task Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title}
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
                  error={!!errors.description}
                  helperText={errors.description}
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
                        error={!!errors.deadline}
                        helperText={errors.deadline}
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
                <Typography gutterBottom>Add Photos to Task</Typography>
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
                          <DeleteIcon />
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
                    startIcon={<CancelIcon />}
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Create Task
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
