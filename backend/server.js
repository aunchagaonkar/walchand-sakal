const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const speakerRoutes = require('./routes/speakerRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const statRoutes = require('./routes/statRoutes');
const featuredTalkRoutes = require('./routes/featuredTalkRoutes');
const featuredSpeakerRoutes = require('./routes/featuredSpeakerRoutes');
const authRoutes = require('./routes/authRoutes');
const aboutContentRoutes = require('./routes/aboutContentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/speakers', speakerRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/featured-talks', featuredTalkRoutes);
app.use('/api/featured-speakers', featuredSpeakerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about-content', aboutContentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});