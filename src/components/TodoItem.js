import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit, MdRefresh  } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { deleteTodo, updateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/todoItem.module.scss';
import { getClasses } from '../utils/getClasses';
import CheckButton from './CheckButton';
import TodoModal from './TodoModal';
import TodoModal1 from './TodoModal1';

import {
  Box , AppBar, Toolbar, Button, TextField,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, Menu,
  MenuItem, Dialog, DialogActions, DialogContent
  , DialogContentText, DialogTitle
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function TodoItem({ todo }) {
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, assignedTo: 'User 1', status: 'Completed', dueDate: '12/10/2024', priority: 'Low', comments: 'This task is good' },
    { id: 2, assignedTo: 'User 2', status: 'In Progress', dueDate: '14/09/2024', priority: 'High', comments: 'This task needs attention' },
  ]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);


  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (todo.status === 'complete') {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [todo.status]);

  const handleCheck = () => {
    setChecked(!checked);
    dispatch(
      updateTodo({ ...todo, status: checked ? 'incomplete' : 'complete' })
    );
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
    toast.success('Todo Deleted Successfully');
  };

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  // Handle New Task
  const handleNewTask = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  // Handle Edit Task
  const handleEditTask = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // Open the delete confirmation modal
  const handleOpenModal = (taskId) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTaskId(null);
  };

  // Handle the delete action after confirmation
  const handleDeleteTask = () => {
    setTasks(tasks.filter((task) => task.id !== selectedTaskId));
    toast.success('Task Deleted Successfully');
    handleCloseModal();
  };


  // Handle Save Task (for both adding and updating tasks)
  const handleSaveTask = (task) => {
    if (editTask) {
      // Update existing task
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      toast.success('Task Updated Successfully');
    } else {
      // Add new task
      task.id = tasks.length + 1;
      setTasks([task, ...tasks]);
      toast.success('New Task Created Successfully');
    }
    setModalOpen(false);
  };

  const handleRefresh = () => {
    // console.log("Refreshing tasks...");
    toast.success('Tasks refreshed successfully!', {
      icon: '🔄',
      className: 'swing-toast', 
      duration: 2000,
    });
  
    // tasks(); // If you're fetching tasks from an API
  };
  

  // Handle Change Page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Change Rows Per Page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTasks = tasks.filter((task) =>
    task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      {/* <motion.div className={styles.item} variants={child}> */}
      {/* <div className={styles.todoDetails}>
          <CheckButton checked={checked} handleCheck={handleCheck} />
          <div className={styles.texts}>
            <p
              className={getClasses([
                styles.todoText,
                todo.status === 'complete' && styles['todoText--completed'],
              ])}
            >
              {todo.title}
            </p>
            <p className={styles.time}>
              {format(new Date(todo.time), 'p, MM/dd/yyyy')}
            </p>
          </div>
        </div> */}
      {/* <div className={styles.todoActions}>
          <div
            className={styles.icon}
            onClick={() => handleDelete()}
            onKeyDown={() => handleDelete()}
            tabIndex={0}
            role="button"
          >
            <MdDelete />
          </div>
          <div
            className={styles.icon}
            onClick={() => handleUpdate()}
            onKeyDown={() => handleUpdate()}
            tabIndex={0}
            role="button"
          >
            <MdEdit />
          </div>
        </div> */}
      {/* </motion.div> */}

      <AppBar
       position="static"
       color="default"
      >
        <Toolbar>
          <Button variant="contained" color="primary" onClick={handleNewTask}>New Task</Button>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            style={{ marginLeft: 'auto' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Toolbar>
      </AppBar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.comments}</TableCell>
            
                  <TableCell align="center" key={task.id}>
                    <IconButton onClick={() => handleEditTask(task)}>
                      <MdEdit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(task.id)}>
                      <MdDelete />
                    </IconButton>
                  </TableCell>
         
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center">
      <TablePagination
        component="div"
        count={filteredTasks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <IconButton onClick={handleRefresh} color="primary">
  <MdRefresh />
</IconButton>
</Box>

      {modalOpen && (
        <TodoModal1
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onSave={handleSaveTask}
          editTask={editTask}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} 
       onClose={handleCloseModal}
      //  maxWidth="lg"
       sx={{
        '& .MuiDialog-paper': {
          width: '300px', 
          height: '150px', 
        },
      }}
      //  fullWidth={true}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteTask} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <TodoModal
        type="update"
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
        todo={todo}
      />
    </>
  );
}

export default TodoItem;
