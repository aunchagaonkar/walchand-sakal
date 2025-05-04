const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Speaker = require('./models/Speaker');
const Episode = require('./models/Episode');
const TeamMember = require('./models/TeamMember');
const Stat = require('./models/Stat');
const FeaturedTalk = require('./models/FeaturedTalk');
const FeaturedSpeaker = require('./models/FeaturedSpeaker');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const speakers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.speakers.json'), 'utf-8')
);

const episodes = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.episodes.json'), 'utf-8')
);

const teamMembers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.teammembers.json'), 'utf-8')
);

const stats = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.stats.json'), 'utf-8')
);

const featuredTalks = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.featuredtalks.json'), 'utf-8')
);

const featuredSpeakers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.featuredspeakers.json'), 'utf-8')
);

const admins = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'walchand-sakal-lecture-series.admins.json'), 'utf-8')
);

// Import data into database
const importData = async () => {
  try {
    // Clear existing data
    await Speaker.deleteMany();
    await Episode.deleteMany();
    await TeamMember.deleteMany();
    await Stat.deleteMany();
    await FeaturedTalk.deleteMany();
    await FeaturedSpeaker.deleteMany();
    await Admin.deleteMany();
    
    // Clean and process data
    const cleanData = (items) => {
      return items.map(item => {
        const newItem = { ...item };
        // Remove MongoDB specific fields
        delete newItem._id;
        delete newItem.__v;
        delete newItem.createdAt;
        delete newItem.updatedAt;
        return newItem;
      });
    };
    
    // Insert new data
    await Speaker.insertMany(cleanData(speakers));
    await Episode.insertMany(cleanData(episodes));
    await TeamMember.insertMany(cleanData(teamMembers));
    await Stat.insertMany(cleanData(stats));
    await FeaturedTalk.insertMany(cleanData(featuredTalks));
    await FeaturedSpeaker.insertMany(cleanData(featuredSpeakers));
    
    // For Admin, create each one separately to ensure password hashing
    for (const adminData of cleanData(admins)) {
      await Admin.create(adminData);
    }
    
    console.log('Data Imported from JSON files!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const deleteData = async () => {
  try {
    await Speaker.deleteMany();
    await Episode.deleteMany();
    await TeamMember.deleteMany();
    await Stat.deleteMany();
    await FeaturedTalk.deleteMany();
    await FeaturedSpeaker.deleteMany();
    await Admin.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Process command line args
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}