const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Auth = require("../models/authModels");

exports.postController = (req, res) => {
  // Auth.findById({ _id: req.body.id }).exec((err, user) => {
  //   if (err) return res.status(400).send(err);
  // res.json({
  //   user,
  // });

  const { title, description, url, tags } = req.body;
  const _post = new Post({
    creator: req.user,
    title,
    description,
    url,
    tags,
  });

  // // then save
  _post.save((err, post) => {
    if (err)
      return res.json({
        success: false,
        message: "Sorry for inconvenince",
      });
    return res.status(200).json({
      success: true,
      post,
    });
  });
  // });
};

// exports.getSingleUserPost = (req, res) => {
//   Post.findOne({ _id: req.params.id })
//     .populate("user")
//     .exec((err, post) => {
//       if (err) return res.status(400).send(err);
//       res.status(200).json({ success: true, post });
//     });
// };

exports.getPostDataController = (req, res) => {
  Post.find()
    .populate("creator", "_id name followers following")
    .exec((err, posts) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, posts });
    });
};

exports.getPostDataByParticulorUserController = (req, res) => {
  Post.find({ creator: req.user._id })
    .populate("creator", "_id name")
    .exec((err, posts) => {
      if (err) return res.status(400).json({ err, message: "asd" });
      res.status(200).json({ success: true, posts });
    });
};

exports.postLikeController = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likers: req.user._id },
    },
    {
      // real time update
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.json({
      result,
    });
  });
};

exports.postDisLikeController = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likers: req.user._id },
    },
    {
      // real time update
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.json({
      result,
    });
  });
};

exports.commentController = (req, res) => {
  const comment = {
    comment: req.body.comment,
    commentedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      // real time update
      new: true,
    }
  )
    .populate("comments.commentedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ err });
      }
      return res.json({
        result,
      });
    });
};

exports.commentLikeController = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { "comments[0].likers": req.user._id },
    },
    {
      // real time update
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ err });
    }
    return res.json({
      result,
    });
  });
};

exports.getSinglePostDataController = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("user")
    .exec((err, post) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, post });
    });
};

exports.deletePostController = (req, res, next) => {
  // TODO:  ({ _id: req.params.id })
  Post.findByIdAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
};

exports.getAllCommentById = (req, res) => {
  Comment.findOne({ _id: req.body.id })
    // .populate("user")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
};
