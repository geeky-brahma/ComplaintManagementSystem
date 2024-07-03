const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router.post('/data', complaintsController.data);
router.post('/status', complaintsController.status);
router.get('/all_complaints', complaintsController.allComplaints);
router.post('/close_forward', complaintsController.closeForward);
router.post('/complaint_details', complaintsController.complaintDetails);
router.get('/sent', complaintsController.sent);

module.exports = router;
