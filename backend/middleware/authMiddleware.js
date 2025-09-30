const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, "4e3e9a02b948abad01f0975553c00ff85c34bb3991b406ec06c04fe0c707d61c47fde323a7b446af568f92e2e031dbc6ebf477e00c461541957b46e43528655f");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
