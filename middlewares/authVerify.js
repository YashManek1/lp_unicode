const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    if (bearerToken == null) {
      return res.status(401).send("token null");
    }
    const verified = jwt.verify(bearerToken, process.env.SecretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
