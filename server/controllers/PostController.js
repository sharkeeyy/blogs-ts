import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error finding posts' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      }
    );

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error finding post' });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, imageUrl, tags } = req.body;
    const { userId } = req;
    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags,
      user: userId,
    });

    const post = await doc.save();
    console.log('Post has been created');
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "The post hasn't been created" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findByIdAndDelete({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: `No post with id ${postId}` });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl, tags } = req.body;
    const { userId } = req;

    const post = await PostModel.updateOne(
      { _id: postId },
      {
        title,
        text,
        imageUrl,
        tags,
        user: userId,
      }
    );

    console.log(post);

    if (!post) {
      return res.status(404).json({ message: `No post with id ${postId}` });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating post' });
  }
};
