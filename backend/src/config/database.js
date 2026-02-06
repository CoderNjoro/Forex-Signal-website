const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
      console.error('Please add MONGODB_URI to your Railway environment variables.');
      console.error('Format: mongodb+srv://username:password@cluster.mongodb.net/forex-signals?retryWrites=true&w=majority');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('authentication failed')) {
      console.error('💡 Tip: Check your MongoDB username and password in the connection string.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Tip: Check your MongoDB cluster URL in the connection string.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;


