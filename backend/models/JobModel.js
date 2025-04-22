import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'shortlisted', 'hired'],
    default: 'pending'
  }
});

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [50, 'Company name cannot exceed 50 characters']
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      default: 'full-time'
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
      trim: true
    },
    requirements: {
      type: [String],
      default: []
    },
    salary: {
      type: Number,
      default: 0
    },
    salaryType: {
      type: String,
      default: "Year",
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: []
    },
    // Legacy field - keeping for backward compatibility
    applicants: {
      type: [mongoose.Types.ObjectId],
      ref: 'User',
      default: []
    },
    // New field for detailed application info
    applications: {
      type: [ApplicationSchema],
      default: []
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: 'User',
      default: []
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide job creator']
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open'
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;