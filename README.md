# Complaint Management System

## Overview
This project comprises a Complaint Management System API and frontend scripts for efficient complaint handling and report generation.

## Backend
### Technologies Utilized
- Node.js
- Express
- PostgreSQL

### File Structure
- `backend-js\src\app.js`: Main application file with route definitions and middleware setup.
- `backend-js\src\controllers\complaintsController.js`: Controller managing complaints-related operations.
- `backend-js\src\controllers\usersController.js`: Controller handling user-related operations.

### API Endpoints
- `/data`: POST endpoint for data handling.
- `/status`: POST endpoint for complaint status management.
- `/all_complaints`: GET endpoint to fetch all complaints.
- `/close_forward`: POST endpoint for closing or forwarding complaints.
- `/complaint_details`: POST endpoint to retrieve complaint details.
- `/sent`: GET endpoint for sent complaints.
- `/department`: GET endpoint for department information.
- `/report`: GET endpoint for report generation.
- `/all_users`: GET endpoint to fetch all users.
- `/login_users`: POST endpoint for user login.
- `/register_users`: POST endpoint for user registration.
- `/drop_user/:empId`: DELETE endpoint to remove a user.
- `/activate_user/:empId`: POST endpoint to activate a user.
- `/download`: GET endpoint for reference document downloads.

## Frontend
### Technologies Used
- JavaScript
- HTML
- CSS

### File Structure
- `frontend\script_raise_new_complaint.js`: Script for raising new complaints.
- `frontend\script_check_complaint.js`: Script for checking status of complaints.
- `frontend\script_admin.js`: Script for admin functionalities.

### Features
- Dropdown selection for departments, websites, and modules.
- Complaint fetching and display based on filters.
- Reference document downloads.

## Setup Instructions
1. Clone the repository.
2. Run `cd backend-js`
2. Install dependencies using `npm install`.
3. Set up the PostgreSQL database.
4. Start the backend server with `npm run dev`.
5. Open the `WELCOME.html` in a browser.

## License
This project is licensed under the MIT License.