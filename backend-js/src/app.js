const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const complaintsController = require('./controllers/complaintsController');
const usersController = require('./controllers/usersController');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

// Routes
app.post('/data', complaintsController.data);
app.post('/status', complaintsController.status);
app.get('/all_complaints', complaintsController.allComplaints);
app.post('/close_forward', complaintsController.closeForward);
app.post('/complaint_details', complaintsController.complaintDetails);
app.get('/sent', complaintsController.sent);
app.get('/department', complaintsController.department);
app.get('/report', complaintsController.report);

app.get('/all_users', usersController.allUsers);
app.post('/login_users', usersController.loginUsers);
app.post('/register_users', usersController.registerUsers);

app.delete('/drop_user/:empId', usersController.dropUser);
app.post('/activate_user/:empId', usersController.activateUser);
// employee id has to be unique check
app.get('/download', complaintsController.referenceDoc);

app.get('/', (req, res) => {
  res.send('Welcome to the Complaint Management System API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
