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
// app.get('/download', complaintsController.sent);

app.get('/all_users', usersController.allUsers);
app.post('/login_users', usersController.loginUsers);
app.post('/register_users', usersController.registerUsers);

app.get('/download', complaintsController.referenceDoc);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});