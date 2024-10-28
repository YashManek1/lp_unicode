import BlogModel from "../models/Blog.js";

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, created_at } = req.body;
    let author_type = req.baseUrl.split("/")[1];
    const authorMap = {
      users: req.user.userId,
      company: req.company.companyId,
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
    res.status(200).json(blogs);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blog posts" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(blog);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error updating blog post" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await BlogModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog post deleted" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error deleting blog post" });
  }
};

export { createBlog, getAllBlogs, updateBlog, deleteBlog };
