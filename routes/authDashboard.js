const User = require("../models/User");
const verify = require("./authVerify");

const router = require("express").Router();

router.get("/allusers", verify, async (req, res) => {
  try {
    const result = await User.find().exec();
    res.send(result);
  } catch (err) {
    res.status(500).send(error);
  }
});

module.exports = router;
