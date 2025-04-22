import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

export const createJob = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    const isAuth = req.oidc.isAuthenticated() || user.email;

    if (!isAuth) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const {
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!salary) {
      return res.status(400).json({ message: "Salary is required" });
    }

    if (!jobType) {
      return res.status(400).json({ message: "Job Type is required" });
    }

    if (!tags) {
      return res.status(400).json({ message: "Tags are required" });
    }

    if (!skills) {
      return res.status(400).json({ message: "Skills are required" });
    }

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
      createdBy: user._id,
    });

    await job.save();

    return res.status(201).json(job);
  } catch (error) {
    console.log("Error in createJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get jobs
export const getJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 }); // sort by latest job

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobs: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get jobs by user
export const getJobsByUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await Job.find({ createdBy: user._id })
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobsByUser: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// search jobs
export const searchJobs = asyncHandler(async (req, res) => {
  try {
    const { tags, location, title } = req.query;

    let query = {};

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(query).populate(
      "createdBy",
      "name profilePicture"
    );

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in searchJobs: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// apply for job
export const applyJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already applied
    if (job.applicants.includes(user._id)) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Handle file upload
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const { resume } = req.files;
    const { phoneNumber, coverLetter } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check file type
    const allowedFileTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = resume.name.substring(resume.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedFileTypes.includes(fileExtension)) {
      return res.status(400).json({ message: "Only PDF, DOC, and DOCX files are allowed" });
    }

    // Check file size (5MB max)
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File size must be less than 5MB" });
    }

    // Generate unique filename
    const fileName = `${user._id}_${Date.now()}${fileExtension}`;
    const uploadPath = `./uploads/resumes/${fileName}`;

    // Move the file
    await resume.mv(uploadPath);

    // Create application object
    const application = {
      userId: user._id,
      resumeUrl: `/uploads/resumes/${fileName}`,
      phoneNumber,
      coverLetter: coverLetter || '',
      appliedAt: new Date(),
      status: 'pending'
    };

    // Add to applications array
    job.applications.push(application);
    
    // Also maintain backward compatibility
    job.applicants.push(user._id);

    await job.save();

    return res.status(200).json({ 
      success: true,
      message: "Applied successfully" 
    });
  } catch (error) {
    console.log("Error in applyJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// Get applicants for a job
export const getJobApplicants = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id)
      .populate({
        path: 'applications.userId',
        select: 'name email'
      });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the recruiter who posted the job
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user._id.toString() !== job.postedBy.toString()) {
      return res.status(403).json({ message: "Not authorized to view these applicants" });
    }

    // Format applicants data
    const applicants = job.applications.map(app => ({
      _id: app._id,
      name: app.userId.name,
      email: app.userId.email,
      phoneNumber: app.phoneNumber,
      resumeUrl: app.resumeUrl,
      coverLetter: app.coverLetter,
      appliedAt: app.appliedAt,
      status: app.status
    }));

    return res.status(200).json({ 
      success: true,
      applicants 
    });
  } catch (error) {
    console.log("Error in getJobApplicants: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// liek and unlike job
export const likeJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = job.likes.includes(user._id);

    if (isLiked) {
      job.likes = job.likes.filter((like) => !like.equals(user._id));
    } else {
      job.likes.push(user._id);
    }

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in likeJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate(
      "createdBy",
      "name profilePicture"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.log("Error in getJobById: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// delete job
export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await job.deleteOne({
      _id: id,
    });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("Error in deleteJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});