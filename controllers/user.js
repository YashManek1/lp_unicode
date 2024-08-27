const User = require("../models/User");

const HandleGetAllUsers = async (req, res) => {
  try {
    const allDbUsers = await User.find();
    return res.status(200).json(allDbUsers);
  } catch (err) {
    return res.status(404);
  }
};
const HandleAddUsers = async (req, res) => {
  try {
    const body = req.body;
    const result = await User.create({
      id: body.id,
      firstName: body.firstName,
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404);
  }
};
const HandleUpdateUsers = async (req, res) => {
  try {
    const Updateid = await User.findByIdAndUpdate(req.params.id, req.body);
    res.send(req.body);
    return res.json({ status: "Success" });
  } catch (err) {
    return res.status(404);
  }
};
const HandleDeleteUsers = async (req, res) => {
  try {
    const deleteid = await User.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      res.status(400).send();
    }
    res.send(deleteid);
  } catch (err) {
    return res.status(404);
  }
};

module.exports = {
  HandleGetAllUsers,
  HandleAddUsers,
  HandleUpdateUsers,
  HandleDeleteUsers,
};
