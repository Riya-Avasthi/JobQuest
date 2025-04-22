import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const resumesDir = path.join(uploadsDir, 'resumes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir);
}

// Determine environment settings
const isDevelopment = process.env.NODE_ENV === 'development';
console.log("Running in", isDevelopment ? "development" : "production", "mode");

// Set up CORS based on environment
const corsOrigin = isDevelopment 
  ? ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3001', 'http://127.0.0.1:3001'] 
  : process.env.CLIENT_URL;

console.log("Allowed CORS origins:", corsOrigin);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  abortOnLimit: true,
  createParentPath: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a health check endpoint that doesn't require auth
app.get('/api/v1/health-check', (req, res) => {
  return res.status(200).json({ 
    success: true,
    message: 'API server is running',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    environment: isDevelopment ? 'development' : 'production',
    dbConnection: mongoose.connection && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Add a direct test endpoint that doesn't require auth
app.get('/api/test-connection', (req, res) => {
  return res.status(200).json({ 
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString()
  });
});

// Add a test endpoint for database operations
app.get('/api/test-database', async (req, res) => {
  try {
    // Check if mongoose is connected
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        success: false, 
        message: 'Not connected to MongoDB',
        readyState: mongoose.connection ? mongoose.connection.readyState : 'no connection'
      });
    }

    // Create a test collection if it doesn't exist
    const testCollection = mongoose.connection.db.collection('test_collection');
    
    // Insert a test document
    const testDoc = {
      message: 'Test document',
      timestamp: new Date(),
      random: Math.random()
    };
    
    const result = await testCollection.insertOne(testDoc);
    
    // Retrieve the document to confirm it was saved
    const savedDoc = await testCollection.findOne({ _id: result.insertedId });
    
    return res.status(200).json({
      success: true,
      message: 'Database operation successful',
      inserted: testDoc,
      retrieved: savedDoc,
      databaseName: mongoose.connection.db.databaseName,
      collectionName: 'test_collection'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database operation failed',
      error: error.message
    });
  }
});

// Mount routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', jobsRoutes);

// Use not found middleware
app.use(notFoundMiddleware);
// Use error handler middleware
app.use(errorHandlerMiddleware);

const server = async () => {
  try {
    // Try to connect to MongoDB
    console.log("Attempting to connect to MongoDB...");
    const connected = await connect();
    
    if (!connected) {
      console.log("WARNING: Server starting without MongoDB connection. Data will NOT be saved.");
      console.log("Fix your MongoDB connection to enable data persistence.");
    } else {
      console.log("MongoDB connection successful!");
    }

    // Start the HTTP server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log(`API URL: http://localhost:${process.env.PORT}`);
      console.log(`Client URL: ${process.env.CLIENT_URL}`);
      console.log(`Health check: http://localhost:${process.env.PORT}/api/v1/health-check`);
      console.log(`Test endpoint: http://localhost:${process.env.PORT}/api/test-connection`);
      console.log(`API endpoints: http://localhost:${process.env.PORT}/api/v1/*`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    console.log("Check your MongoDB connection string in .env");
    process.exit(1);
  }
};

server();