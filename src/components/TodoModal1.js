import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';
import '../styles/modules/TodoModal.css'; // Assuming the CSS is stored in a separate file

function TodoModal({ modalOpen, setModalOpen, onSave, editTask }) {
  const [taskData, setTaskData] = useState({
    assignedTo: '',
    status: '',
    dueDate: '',
    priority: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setTaskData(editTask);
    } else {
      setTaskData({
        assignedTo: '',
        status: '',
        dueDate: '',
        priority: '',
        comments: '',
      });
    }
  }, [editTask]);

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!taskData.assignedTo) newErrors.assignedTo = 'Assigned To is required';
    if (!taskData.status) newErrors.status = 'Status is required';
    if (!taskData.priority) newErrors.priority = 'Priority is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSave(taskData);
      setModalOpen(false); // close modal after successful save
    }
  };

  return (
    <div className="wrapperrd">
      <div className="containeres">
        <span className="closeButtons" onClick={() => setModalOpen(false)}>×</span>
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="formTitlees">{editTask ? 'Edit Task' : 'New Task'}</DialogTitle>
          <DialogContent className="forms">
            <FormControl fullWidth margin="normal" error={!!errors.assignedTo}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleChange}
                label="Assigned To"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="User 1">User 1</MenuItem>
                <MenuItem value="User 2">User 2</MenuItem>
                <MenuItem value="User 3">User 3</MenuItem>
              </Select>
              {errors.assignedTo && <p style={{ color: 'red' }}>{errors.assignedTo}</p>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              {errors.status && <p style={{ color: 'red' }}>{errors.status}</p>}
            </FormControl>

            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={taskData.dueDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth margin="normal" error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
              {errors.priority && <p style={{ color: 'red' }}>{errors.priority}</p>}
            </FormControl>

            <TextField
              label="Description"
              name="comments"
              value={taskData.comments}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </DialogContent>
          <DialogActions className="buttonContainers">
            <Button onClick={() => setModalOpen(false)} style={{ backgroundColor: '#f0ad4e', color: 'white' }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} style={{ backgroundColor: '#5cb85c', color: 'white' }}>
              {editTask ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default TodoModal;
