const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('token');
    
    // If you have a token blacklist, add the current token to it here
    // This would require you to extract the token from the request first
    // const token = req.cookies.token;
    // await addToTokenBlacklist(token);
    
    // Send a script to clear any client-side storage
    res.send(`
      <script>
        // Clear any client-side storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '/login';
      </script>
    `);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send('An error occurred during logout');
  }
});

module.exports = router;