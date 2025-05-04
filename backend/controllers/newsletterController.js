const axios = require('axios');

// @desc    Subscribe a user to the newsletter via MailerLite API
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  try {
    // Using MailerLite API
    const response = await axios.post(
      'https://connect.mailerlite.com/api/subscribers',
      {
        email,
        status: "active"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MAILER_LITE_API}`
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return res.json({
        success: true,
        data: {
          message: 'Successfully subscribed to newsletter'
        }
      });
    } else {
      throw new Error('Failed to subscribe');
    }
  } catch (error) {
    // Handle MailerLite specific errors
    if (error.response && error.response.data) {
      console.error('MailerLite API error:', error.response.data);
      
      // Check if it's a duplicate email error
      if (error.response.status === 409) {
        return res.status(409).json({
          success: false,
          error: 'This email is already subscribed to our newsletter'
        });
      }
      
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.message || 'Error from newsletter service'
      });
    }

    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  subscribeToNewsletter
};