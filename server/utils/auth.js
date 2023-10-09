const jwt = require('jsonwebtoken');

// secret key
const secret = 'fjskD3l$9oLz#P!tR7B@G5kE&mT1wYn';
const expiration = '2h';

module.exports = {
  // authenticated routes
  authMiddleware: function (req, res, next) {
    let token = req.query.token || req.headers.authorization;

    // token value
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('No token found in the request.');
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Token verified successfully.');
    } catch (error) {
      console.log('Invalid token:', error);
      return res.status(400).json({ message: 'Invalid token!' });
    }

    // send to the next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    console.log('Token generated:', token);
    return token;
  },
};
