import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

const uploadprofilepic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File not found");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
    });
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    user.profilePicture.url = result.secure_url;
    user.profilePicture.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "User profile picture uploaded",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error uploading image");
  }
};

const updateprofilepic = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilepics",
    });
    user.profilePicture.url = result.secure_url;
    user.profilePicture.public_id = result.public_id;
    await user.save();
    return res.status(200).json({
      message: "User profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error updating image");
  }
};
export { uploadprofilepic, updateprofilepic };
