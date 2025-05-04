const axios = require('axios');
const { format } = require('util');

// Configuration
const API_URL = 'http://localhost:5000/api';
const TEST_PREFIX = 'TEST_';
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'password123';

// Storage for created resources IDs to be cleaned up later
const resourcesToCleanup = {
  episodes: [],
  speakers: [],
  featuredSpeakers: [],
  featuredTalks: [],
  team: [],
  stats: [],
  settings: null,
  aboutContent: null
};

// Global token storage
let authToken;

// Utility function for logging
const log = (message, ...args) => {
  console.log('\x1b[34m%s\x1b[0m', format(message, ...args));
};

const error = (message, ...args) => {
  console.error('\x1b[31m%s\x1b[0m', format(message, ...args));
};

const success = (message, ...args) => {
  console.log('\x1b[32m%s\x1b[0m', format(message, ...args));
};

const warning = (message, ...args) => {
  console.log('\x1b[33m%s\x1b[0m', format(message, ...args));
};

// Utility function to make API requests
const api = {
  get: async (endpoint, auth = false) => {
    try {
      const headers = auth && authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await axios.get(`${API_URL}${endpoint}`, { headers });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },
  post: async (endpoint, data, auth = true) => {
    try {
      const headers = auth && authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await axios.post(`${API_URL}${endpoint}`, data, { headers });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },
  put: async (endpoint, data, auth = true) => {
    try {
      const headers = auth && authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await axios.put(`${API_URL}${endpoint}`, data, { headers });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },
  delete: async (endpoint, auth = true) => {
    try {
      const headers = auth && authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await axios.delete(`${API_URL}${endpoint}`, { headers });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }
};

// Test data
const testData = {
  admin: {
    username: TEST_USERNAME,
    password: TEST_PASSWORD
  },
  episode: {
    title: `${TEST_PREFIX}Episode Title`,
    date: new Date().toISOString(),
    speaker: `${TEST_PREFIX}Speaker Name`,
    speakerRole: 'Test Role',
    thumbnail: 'https://example.com/thumbnail.jpg',
    duration: '25:30',
    summary: 'This is a test episode summary.',
    videoId: 'dQw4w9WgXcQ',
    topics: ['Test', 'API', 'Development']
  },
  speaker: {
    name: `${TEST_PREFIX}Speaker Name`,
    role: 'Test Speaker Role',
    organization: 'Test Organization',
    image: 'https://example.com/speaker.jpg',
    bio: 'This is a test speaker bio.',
    topics: ['AI', 'Technology', 'Innovation']
  },
  featuredSpeaker: {
    name: `${TEST_PREFIX}Featured Speaker Name`,
    role: 'Test Role',
    organization: 'Test Organization',
    image: 'https://example.com/featured-speaker.jpg',
    bio: 'This is a test featured speaker bio.'
  },
  featuredTalk: {
    title: `${TEST_PREFIX}Featured Talk Title`,
    speaker: `${TEST_PREFIX}Speaker Name`,
    speakerRole: 'Test Role',
    thumbnail: 'https://example.com/talk-thumbnail.jpg',
    duration: '18:45',
    summary: 'This is a test featured talk summary.',
    videoId: 'dQw4w9WgXcQ',
    featured: true
  },
  teamMember: {
    name: `${TEST_PREFIX}Team Member Name`,
    role: 'Test Team Role',
    image: 'https://example.com/team-member.jpg'
  },
  stat: {
    label: `${TEST_PREFIX}Stat Label`,
    value: '100+'
  },
  settings: {
    siteName: `${TEST_PREFIX}Site Name`,
    siteTagline: 'Test Site Tagline',
    contactEmail: 'test@example.com',
    contactPhone: '+1234567890',
    contactAddress: 'Test Address',
    socialLinks: {
      twitter: 'https://twitter.com/test',
      facebook: 'https://facebook.com/test',
      instagram: 'https://instagram.com/test',
      linkedin: 'https://linkedin.com/in/test',
      youtube: 'https://youtube.com/test'
    },
    footer: {
      copyrightText: '© Test Copyright',
      showSocialLinks: true
    },
    meta: {
      description: 'Test meta description',
      keywords: 'test, keywords'
    }
  },
  aboutContent: {
    title: `${TEST_PREFIX}About Us`,
    subtitle: `${TEST_PREFIX}Our Story and Mission`,
    mainContent: "This is test main content for the about page that describes our organization.",
    mission: "Test mission statement",
    vision: "Test vision statement"
  },
  newsletter: {
    email: 'test@example.com'
  }
};

// Test functions
const tests = {
  async auth() {
    log('Testing Authentication API');
    
    // Test login
    const loginResponse = await api.post('/auth/login', {
      username: TEST_USERNAME,  // Updated to use username instead of email
      password: TEST_PASSWORD
    }, false);
    if (!loginResponse.success) {
      error('Login failed. Make sure a user exists with username %s and password %s', 
        TEST_USERNAME, TEST_PASSWORD);
      return false;
    }
    
    authToken = loginResponse.token;
    success('Successfully logged in and obtained auth token');
    return true;
  },
  
  async episodes() {
    log('Testing Episodes API');
    
    // Test GET all episodes
    const getAllResponse = await api.get('/episodes', false);
    if (!getAllResponse.success) {
      error('Failed to get episodes: %s', getAllResponse.error);
      return false;
    }
    success('GET /episodes - Retrieved %d episodes', getAllResponse.count);
    
    // Test POST create episode
    const createResponse = await api.post('/episodes', testData.episode);
    if (!createResponse.success) {
      error('Failed to create episode: %s', createResponse.error);
      return false;
    }
    const episodeId = createResponse.data._id;
    resourcesToCleanup.episodes.push(episodeId);
    success('POST /episodes - Created episode with ID: %s', episodeId);
    
    // Test GET single episode
    const getOneResponse = await api.get(`/episodes/${episodeId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get episode by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /episodes/:id - Retrieved episode with title: %s', getOneResponse.data.title);
    
    // Test PUT update episode
    const updateData = { ...testData.episode, title: `${TEST_PREFIX}Updated Episode Title` };
    const updateResponse = await api.put(`/episodes/${episodeId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update episode: %s', updateResponse.error);
      return false;
    }
    success('PUT /episodes/:id - Updated episode title to: %s', updateResponse.data.title);
    
    // Test generate summary
    const summaryResponse = await api.post('/episodes/generate-summary', { videoId: testData.episode.videoId });
    if (!summaryResponse.success) {
      warning('Failed to generate summary. This might be expected if the API key is not set: %s', summaryResponse.error);
    } else {
      success('POST /episodes/generate-summary - Generated summary for YouTube video');
    }
    
    return true;
  },
  
  async speakers() {
    log('Testing Speakers API');
    
    // Test GET all speakers
    const getAllResponse = await api.get('/speakers', false);
    if (!getAllResponse.success) {
      error('Failed to get speakers: %s', getAllResponse.error);
      return false;
    }
    success('GET /speakers - Retrieved %d speakers', getAllResponse.count);
    
    // Test POST create speaker
    const createResponse = await api.post('/speakers', testData.speaker);
    if (!createResponse.success) {
      error('Failed to create speaker: %s', createResponse.error);
      return false;
    }
    const speakerId = createResponse.data._id;
    resourcesToCleanup.speakers.push(speakerId);
    success('POST /speakers - Created speaker with ID: %s', speakerId);
    
    // Test GET single speaker
    const getOneResponse = await api.get(`/speakers/${speakerId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get speaker by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /speakers/:id - Retrieved speaker with name: %s', getOneResponse.data.name);
    
    // Test PUT update speaker
    const updateData = { ...testData.speaker, name: `${TEST_PREFIX}Updated Speaker Name` };
    const updateResponse = await api.put(`/speakers/${speakerId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update speaker: %s', updateResponse.error);
      return false;
    }
    success('PUT /speakers/:id - Updated speaker name to: %s', updateResponse.data.name);
    
    return true;
  },
  
  async featuredSpeakers() {
    log('Testing Featured Speakers API');
    
    // Test GET all featured speakers
    const getAllResponse = await api.get('/featured-speakers', false);
    if (!getAllResponse.success) {
      error('Failed to get featured speakers: %s', getAllResponse.error);
      return false;
    }
    success('GET /featured-speakers - Retrieved %d featured speakers', getAllResponse.count);
    
    // Test POST create featured speaker
    const createResponse = await api.post('/featured-speakers', testData.featuredSpeaker);
    if (!createResponse.success) {
      error('Failed to create featured speaker: %s', createResponse.error);
      return false;
    }
    const featuredSpeakerId = createResponse.data._id;
    resourcesToCleanup.featuredSpeakers.push(featuredSpeakerId);
    success('POST /featured-speakers - Created featured speaker with ID: %s', featuredSpeakerId);
    
    // Test GET single featured speaker
    const getOneResponse = await api.get(`/featured-speakers/${featuredSpeakerId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get featured speaker by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /featured-speakers/:id - Retrieved featured speaker with name: %s', getOneResponse.data.name);
    
    // Test PUT update featured speaker
    const updateData = { ...testData.featuredSpeaker, name: `${TEST_PREFIX}Updated Featured Speaker Name` };
    const updateResponse = await api.put(`/featured-speakers/${featuredSpeakerId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update featured speaker: %s', updateResponse.error);
      return false;
    }
    success('PUT /featured-speakers/:id - Updated featured speaker name to: %s', updateResponse.data.name);
    
    return true;
  },
  
  async featuredTalks() {
    log('Testing Featured Talks API');
    
    // Test GET all featured talks
    const getAllResponse = await api.get('/featured-talks', false);
    if (!getAllResponse.success) {
      error('Failed to get featured talks: %s', getAllResponse.error);
      return false;
    }
    success('GET /featured-talks - Retrieved %d featured talks', getAllResponse.count);
    
    // Test POST create featured talk
    const createResponse = await api.post('/featured-talks', testData.featuredTalk);
    if (!createResponse.success) {
      error('Failed to create featured talk: %s', createResponse.error);
      return false;
    }
    const featuredTalkId = createResponse.data._id;
    resourcesToCleanup.featuredTalks.push(featuredTalkId);
    success('POST /featured-talks - Created featured talk with ID: %s', featuredTalkId);
    
    // Test GET single featured talk
    const getOneResponse = await api.get(`/featured-talks/${featuredTalkId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get featured talk by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /featured-talks/:id - Retrieved featured talk with title: %s', getOneResponse.data.title);
    
    // Test PUT update featured talk
    const updateData = { ...testData.featuredTalk, title: `${TEST_PREFIX}Updated Featured Talk Title` };
    const updateResponse = await api.put(`/featured-talks/${featuredTalkId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update featured talk: %s', updateResponse.error);
      return false;
    }
    success('PUT /featured-talks/:id - Updated featured talk title to: %s', updateResponse.data.title);
    
    return true;
  },
  
  async team() {
    log('Testing Team API');
    
    // Test GET all team members
    const getAllResponse = await api.get('/team', false);
    if (!getAllResponse.success) {
      error('Failed to get team members: %s', getAllResponse.error);
      return false;
    }
    success('GET /team - Retrieved %d team members', getAllResponse.count);
    
    // Test POST create team member
    const createResponse = await api.post('/team', testData.teamMember);
    if (!createResponse.success) {
      error('Failed to create team member: %s', createResponse.error);
      return false;
    }
    const teamMemberId = createResponse.data._id;
    resourcesToCleanup.team.push(teamMemberId);
    success('POST /team - Created team member with ID: %s', teamMemberId);
    
    // Test GET single team member
    const getOneResponse = await api.get(`/team/${teamMemberId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get team member by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /team/:id - Retrieved team member with name: %s', getOneResponse.data.name);
    
    // Test PUT update team member
    const updateData = { ...testData.teamMember, name: `${TEST_PREFIX}Updated Team Member Name` };
    const updateResponse = await api.put(`/team/${teamMemberId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update team member: %s', updateResponse.error);
      return false;
    }
    success('PUT /team/:id - Updated team member name to: %s', updateResponse.data.name);
    
    return true;
  },
  
  async stats() {
    log('Testing Stats API');
    
    // Test GET all stats
    const getAllResponse = await api.get('/stats', false);
    if (!getAllResponse.success) {
      error('Failed to get stats: %s', getAllResponse.error);
      return false;
    }
    success('GET /stats - Retrieved %d stats', getAllResponse.count);
    
    // Test POST create stat
    const createResponse = await api.post('/stats', testData.stat);
    if (!createResponse.success) {
      error('Failed to create stat: %s', createResponse.error);
      return false;
    }
    const statId = createResponse.data._id;
    resourcesToCleanup.stats.push(statId);
    success('POST /stats - Created stat with ID: %s', statId);
    
    // Test GET single stat
    const getOneResponse = await api.get(`/stats/${statId}`, false);
    if (!getOneResponse.success) {
      error('Failed to get stat by ID: %s', getOneResponse.error);
      return false;
    }
    success('GET /stats/:id - Retrieved stat with label: %s', getOneResponse.data.label);
    
    // Test PUT update stat
    const updateData = { ...testData.stat, label: `${TEST_PREFIX}Updated Stat Label` };
    const updateResponse = await api.put(`/stats/${statId}`, updateData);
    if (!updateResponse.success) {
      error('Failed to update stat: %s', updateResponse.error);
      return false;
    }
    success('PUT /stats/:id - Updated stat label to: %s', updateResponse.data.label);
    
    return true;
  },
  
  async settings() {
    log('Testing Settings API');
    
    // Test GET settings
    const getResponse = await api.get('/settings', false);
    if (!getResponse.success) {
      error('Failed to get settings: %s', getResponse.error);
      return false;
    }
    
    if (getResponse.data && getResponse.data._id) {
      success('GET /settings - Retrieved existing settings');
      resourcesToCleanup.settings = getResponse.data._id;
      
      // Test PUT update settings
      const updateResponse = await api.put(`/settings/${getResponse.data._id}`, testData.settings);
      if (!updateResponse.success) {
        error('Failed to update settings: %s', updateResponse.error);
        return false;
      }
      success('PUT /settings/:id - Updated settings');
    } else {
      // Test POST create settings
      const createResponse = await api.post('/settings', testData.settings);
      if (!createResponse.success) {
        error('Failed to create settings: %s', createResponse.error);
        return false;
      }
      resourcesToCleanup.settings = createResponse.data._id;
      success('POST /settings - Created settings with ID: %s', createResponse.data._id);
    }
    
    return true;
  },
  
  async aboutContent() {
    log('Testing About Content API');
    
    // Test GET about content
    const getResponse = await api.get('/about-content', false);
    if (!getResponse.success) {
      error('Failed to get about content: %s', getResponse.error);
      return false;
    }
    
    if (getResponse.data && getResponse.data.length > 0) {
      success('GET /about-content - Retrieved existing about content');
      resourcesToCleanup.aboutContent = getResponse.data[0]._id;
      
      // Test PUT update about content
      const updateResponse = await api.put(`/about-content/${getResponse.data[0]._id}`, testData.aboutContent);
      if (!updateResponse.success) {
        error('Failed to update about content: %s', updateResponse.error);
        return false;
      }
      success('PUT /about-content/:id - Updated about content');
    } else {
      // Test POST create about content
      const createResponse = await api.post('/about-content', testData.aboutContent);
      if (!createResponse.success) {
        error('Failed to create about content: %s', createResponse.error);
        return false;
      }
      resourcesToCleanup.aboutContent = createResponse.data._id;
      success('POST /about-content - Created about content with ID: %s', createResponse.data._id);
    }
    
    return true;
  },
  
  async newsletter() {
    log('Testing Newsletter API');
    
    // Test POST subscribe to newsletter
    const subscribeResponse = await api.post('/newsletter/subscribe', testData.newsletter, false);
    if (!subscribeResponse.success) {
      error('Failed to subscribe to newsletter: %s', subscribeResponse.error);
      return false;
    }
    success('POST /newsletter/subscribe - Subscribed email: %s', testData.newsletter.email);
    
    return true;
  }
};

// Cleanup functions
const cleanup = {
  async episodes() {
    log('Cleaning up test episodes...');
    for (const id of resourcesToCleanup.episodes) {
      const response = await api.delete(`/episodes/${id}`);
      if (response.success) {
        success('Deleted episode with ID: %s', id);
      } else {
        warning('Failed to delete episode with ID %s: %s', id, response.error);
      }
    }
  },
  
  async speakers() {
    log('Cleaning up test speakers...');
    for (const id of resourcesToCleanup.speakers) {
      const response = await api.delete(`/speakers/${id}`);
      if (response.success) {
        success('Deleted speaker with ID: %s', id);
      } else {
        warning('Failed to delete speaker with ID %s: %s', id, response.error);
      }
    }
  },
  
  async featuredSpeakers() {
    log('Cleaning up test featured speakers...');
    for (const id of resourcesToCleanup.featuredSpeakers) {
      const response = await api.delete(`/featured-speakers/${id}`);
      if (response.success) {
        success('Deleted featured speaker with ID: %s', id);
      } else {
        warning('Failed to delete featured speaker with ID %s: %s', id, response.error);
      }
    }
  },
  
  async featuredTalks() {
    log('Cleaning up test featured talks...');
    for (const id of resourcesToCleanup.featuredTalks) {
      const response = await api.delete(`/featured-talks/${id}`);
      if (response.success) {
        success('Deleted featured talk with ID: %s', id);
      } else {
        warning('Failed to delete featured talk with ID %s: %s', id, response.error);
      }
    }
  },
  
  async team() {
    log('Cleaning up test team members...');
    for (const id of resourcesToCleanup.team) {
      const response = await api.delete(`/team/${id}`);
      if (response.success) {
        success('Deleted team member with ID: %s', id);
      } else {
        warning('Failed to delete team member with ID %s: %s', id, response.error);
      }
    }
  },
  
  async stats() {
    log('Cleaning up test stats...');
    for (const id of resourcesToCleanup.stats) {
      const response = await api.delete(`/stats/${id}`);
      if (response.success) {
        success('Deleted stat with ID: %s', id);
      } else {
        warning('Failed to delete stat with ID %s: %s', id, response.error);
      }
    }
  },
  
  // Note: We're not cleaning up settings or about content as they're singleton resources
  // that we only updated, not created multiple instances of
};

// Main test runner
const runTests = async () => {
  console.log('='.repeat(80));
  console.log('Starting API Tests');
  console.log('='.repeat(80));
  
  const startTime = Date.now();
  
  try {
    // First authenticate
    if (!await tests.auth()) {
      error('Authentication failed. Cannot proceed with other tests.');
      return;
    }
    
    // Run all tests
    const testResults = await Promise.all([
      tests.episodes(),
      tests.speakers(),
      tests.featuredSpeakers(),
      tests.featuredTalks(),
      tests.team(),
      tests.stats(),
      tests.settings(),
      tests.aboutContent(),
      tests.newsletter()
    ]);
    
    // Check overall result
    const allPassed = testResults.every(result => result === true);
    
    console.log('='.repeat(80));
    console.log('Test Results Summary');
    console.log('-'.repeat(80));
    console.log('Authentication: %s', 'PASSED');
    console.log('Episodes API: %s', testResults[0] ? 'PASSED' : 'FAILED');
    console.log('Speakers API: %s', testResults[1] ? 'PASSED' : 'FAILED');
    console.log('Featured Speakers API: %s', testResults[2] ? 'PASSED' : 'FAILED');
    console.log('Featured Talks API: %s', testResults[3] ? 'PASSED' : 'FAILED');
    console.log('Team API: %s', testResults[4] ? 'PASSED' : 'FAILED');
    console.log('Stats API: %s', testResults[5] ? 'PASSED' : 'FAILED');
    console.log('Settings API: %s', testResults[6] ? 'PASSED' : 'FAILED');
    console.log('About Content API: %s', testResults[7] ? 'PASSED' : 'FAILED');
    console.log('Newsletter API: %s', testResults[8] ? 'PASSED' : 'FAILED');
    console.log('-'.repeat(80));
    console.log('Overall Result: %s', allPassed ? 'PASSED' : 'FAILED');
    console.log('Total Time: %d seconds', Math.round((Date.now() - startTime) / 1000));
    console.log('='.repeat(80));
    
    // Clean up test data
    console.log('='.repeat(80));
    console.log('Cleaning Up Test Data');
    console.log('='.repeat(80));
    
    await Promise.all([
      cleanup.episodes(),
      cleanup.speakers(),
      cleanup.featuredSpeakers(),
      cleanup.featuredTalks(),
      cleanup.team(),
      cleanup.stats()
    ]);
    
    console.log('='.repeat(80));
    console.log('Cleanup Complete');
    console.log('='.repeat(80));
    
  } catch (err) {
    error('Unexpected error: %s', err.message);
    console.error(err);
  }
};

// Run the tests
runTests();