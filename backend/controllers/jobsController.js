import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import asyncHandler from 'express-async-handler';

// Get all jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: 'open' })
    .sort('-createdAt')
    .populate('postedBy', 'name company');

  res.status(StatusCodes.OK).json({
    success: true,
    count: jobs.length,
    jobs
  });
});

// Create a job
const createJob = asyncHandler(async (req, res) => {
  req.body.postedBy = req.user.userId;
  
  const job = await Job.create(req.body);
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    job
  });
});

// Get a single job by ID
const getJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  const job = await Job.findById(jobId)
    .populate('postedBy', 'name company')
    .populate('applicants', 'name email');
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    job
  });
});

// Update a job
const updateJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  // Find the job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if user is the creator of the job
  if (job.postedBy.toString() !== req.user.userId) {
    throw new BadRequestError('You can only update jobs that you created');
  }
  
  // Update the job
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    job: updatedJob
  });
});

// Delete a job
const deleteJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  // Find the job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if user is the creator of the job
  if (job.postedBy.toString() !== req.user.userId) {
    throw new BadRequestError('You can only delete jobs that you created');
  }
  
  await job.deleteOne();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// Get jobs posted by current user
const getUserJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.userId })
    .sort('-createdAt');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: jobs.length,
    jobs
  });
});

// Apply to a job
const applyToJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  // Find the job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if job is open
  if (job.status !== 'open') {
    throw new BadRequestError('This job is no longer accepting applications');
  }
  
  // Check if user already applied
  if (job.applicants.includes(req.user.userId)) {
    throw new BadRequestError('You have already applied to this job');
  }
  
  // Add user to applicants
  job.applicants.push(req.user.userId);
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Application submitted successfully'
  });
});

// Like/save a job
const likeJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  // Find the job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if user already liked the job
  const alreadyLiked = job.likes.includes(req.user.userId);
  
  if (alreadyLiked) {
    // Unlike the job
    job.likes = job.likes.filter(id => id.toString() !== req.user.userId);
  } else {
    // Like the job
    job.likes.push(req.user.userId);
  }
  
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: alreadyLiked ? 'Job unliked successfully' : 'Job liked successfully'
  });
});

// Search jobs
const searchJobs = asyncHandler(async (req, res) => {
  const { tags, location, title } = req.query;
  
  const queryObject = { status: 'open' };
  
  if (tags) {
    queryObject.tags = { $in: tags.split(',').map(tag => tag.trim()) };
  }
  
  if (location) {
    queryObject.location = { $regex: location, $options: 'i' };
  }
  
  if (title) {
    queryObject.title = { $regex: title, $options: 'i' };
  }
  
  const jobs = await Job.find(queryObject)
    .sort('-createdAt')
    .populate('postedBy', 'name company');
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: jobs.length,
    jobs
  });
});

// Get applicants for a specific job
const getJobApplicants = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  
  // Find the job
  const job = await Job.findById(jobId)
    .populate({
      path: 'applications.userId',
      select: 'name email location bio company position'
    });
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if user is the creator of the job
  if (job.postedBy.toString() !== req.user.userId) {
    throw new BadRequestError('You can only view applicants for jobs that you created');
  }
  
  // Get applications
  const applications = job.applications || [];
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: applications.length,
    jobTitle: job.title,
    jobId: job._id,
    applications
  });
});

// Update application status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;
  const { applicationId, status } = req.body;
  
  if (!applicationId || !status) {
    throw new BadRequestError('Please provide applicationId and status');
  }
  
  // Validate status
  const validStatuses = ['pending', 'reviewed', 'rejected', 'shortlisted', 'hired'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Find the job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new NotFoundError(`Job with id ${jobId} not found`);
  }
  
  // Check if user is the creator of the job
  if (job.postedBy.toString() !== req.user.userId) {
    throw new BadRequestError('You can only update applications for jobs that you created');
  }
  
  // Find the application
  const applicationIndex = job.applications.findIndex(
    app => app._id.toString() === applicationId
  );
  
  if (applicationIndex === -1) {
    throw new NotFoundError(`Application with id ${applicationId} not found`);
  }
  
  // Update the application status
  job.applications[applicationIndex].status = status;
  await job.save();
  
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Application status updated to ${status}`
  });
});

export {
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
}; 