import express from 'express';
import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  getUserJobs,
  applyToJob,
  likeJob,
  searchJobs,
  getJobApplicants,
  updateApplicationStatus
} from '../controllers/jobsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/jobs', getAllJobs);
router.get('/jobs/search', searchJobs);

// Protected routes
router.post('/jobs', auth, createJob);
router.get('/jobs/user/myjobs', auth, getUserJobs);

// Job routes with ID parameter
router.get('/jobs/:id', getJob);
router.put('/jobs/:id', auth, updateJob);
router.delete('/jobs/:id', auth, deleteJob);
router.put('/jobs/:id/apply', auth, applyToJob);
router.put('/jobs/:id/like', auth, likeJob);

// Applicant management routes
router.get('/jobs/:id/applicants', auth, getJobApplicants);
router.put('/jobs/:id/applicants', auth, updateApplicationStatus);

export default router; 