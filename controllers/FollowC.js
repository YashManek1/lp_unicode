import FollowerModel from "../models/follower.js";
import UserModel from "../models/User.js";
import CompanyModel from "../models/Company.js";

const follow = async (req, res) => {
  try {
    const { following_id, following_type } = req.body;
    const followingMap = {
      users: req.user?.userId,
      company: req.company?.companyId,
    };
    if (!["users", "company"].includes(following_type)) {
      return res.status(400).json({ message: "Following type is invalid" });
    }
    let follower_id = followingMap[following_type];
    const followExists = await FollowerModel.findOne({
      follower_id,
      following_id,
      following_type,
    });
    if (followExists) {
      return res.status(400).json({ message: "User is already following" });
    }
    const newFollow = new FollowerModel({
      follower_id: req.user.userId,
      following_id,
      following_type,
    });
    await newFollow.save();
    return res.status(201).json({
      message: `Successfully followed the ${following_type}`,
      Follow: newFollow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const unfollow = async (req, res) => {
  try {
    const { following_id, following_type } = req.body;
    const followingMap = {
      users: req.user?.userId,
      company: req.company?.companyId,
    };
    if (!["users", "company"].includes(following_type)) {
      return res.status(400).json({ message: "Following type is invalid" });
    }
    let follower_id = followingMap[following_type];
    const unfollow = await FollowerModel.findOneAndDelete({
      follower_id,
      following_id,
      following_type,
    });
    if (!unfollow) {
      return res.status(400).json({ message: "User is already not following" });
    }
    return res
      .status(201)
      .json({ message: `Successfully unfollowed the ${following_type}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const getAllFollowers = async (req, res) => {
  try {
    const following_id = req.params.id;
    const followers = await FollowerModel.find({
      following_id,
    }).populate("follower_id", "name website_url description username bio");
    return res.status(201).send(followers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

const getAllFollowing = async (req, res) => {
  try {
    const following = await FollowerModel.find({
      follower_id: req.user.userId,
    });
    const populatedFollowing = await Promise.all(
      following.map(async (follow) => {
        if (follow.following_type === "users") {
          return await UserModel.findById(follow.following_id).select(
            "name website_url description username bio"
          );
        } else if (follow.following_type === "company") {
          return await CompanyModel.findById(follow.following_id).select(
            "name website_url description"
          );
        }
      })
    );
    return res.status(200).json(populatedFollowing);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", err });
  }
};

export { follow, unfollow, getAllFollowers, getAllFollowing };
