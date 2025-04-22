import mongoose from "mongoose";

const connect = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB connection string is missing. Please check your .env file.');
      return false;
    }
    
    console.log('MongoDB connection string:', mongoUri.replace(/:[^:]*@/, ':****@'));
    
    const conn = await mongoose.connect(mongoUri, {
      // These options might not be needed in newer mongoose versions
      // but keeping them won't hurt
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

export default connect;