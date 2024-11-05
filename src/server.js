const app = require('./app');
const connectDB = require('./database');
// const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Failed to connect to MongoDB', err));


// Connect to MongoDB
connectDB();

  
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
