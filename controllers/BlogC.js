import Blog from "../models/Blog.js";
import BlogModel from "../models/Blog.js";

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, created_at } = req.body;
    let author_type = req.baseUrl.split("/")[1];
    const authorMap = {
      users: req.user?.userId,
      company: req.company?.companyId,
    };
    let author_id = authorMap[author_type];
    const NewBlog = new BlogModel({
      author_id,
      author_type,
      title,
      content,
      tags,
      created_at,
    });
    await NewBlog.save();
    return res
      .status(201)
      .json({ message: "Blog successfully created", Blog: NewBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    return res.status(201).json(blogs);
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blog posts" });
  }
};

const getBlogsOfUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogs = await BlogModel.find({ author_id: userId });
    return res.status(201).json(blogs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blog posts" });
  }
};
const getBlogsOfCompany = async (req, res) => {
  try {
    const companyId = req.company.CompanyId;
    const blogs = await BlogModel.find({ author_id: companyId });
    return res.status(201).json(blogs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blog posts" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(201).json(blog);
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: "Error updating blog post" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await BlogModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "Blog post deleted" });
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting blog post" });
  }
};

export {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getBlogsOfUser,
  getBlogsOfCompany,
};
