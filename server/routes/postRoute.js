const express = require("express");
const router = express.Router();

const {
  postController,
  getPostDataController,
  getSinglePostDataController,
  deletePostController,
  commentController,
  getAllCommentById,
  getPostDataByParticulorUserController,
  postLikeController,
  postDisLikeController,
  commentLikeController,
} = require("../controller/postController");

var multer = require("multer");
const requireLogin = require("../middleware/requireLogin");
var upload = multer({ dest: "uploads/" });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

//Upload route
router.post("/post-url", upload.single("url"), (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      post_url: req.file.path,
    });
  } catch (err) {
    res.send(400);
  }
});

router.post("/profile-cover", upload.single("profile"), (req, res) => {
  try {
    return res.status(200).json({
      profile_cover_path: req.file.path,
    });
  } catch (err) {
    res.send(400);
  }
});

// router.post("/bulk", upload.array("profiles", 4), (req, res) => {
//   try {
//     res.send(req.files);
//   } catch (error) {
//     console.log(error);
//     res.send(400);
//   }
// });

router.post("/post", requireLogin, postController);
// router.get("/protected", requireLogin, (req, res) => {
//   return res.json({ user: req.user });
// });

// router.get("/user/posts", getSingleUserPost);
router.get("/post", getPostDataController);
router.get("/myPost", requireLogin, getPostDataByParticulorUserController);
router.put("/post/like", requireLogin, postLikeController);
router.put("/post/dislike", requireLogin, postDisLikeController);

router.put("/post/comment", requireLogin, commentController);
router.put("/post/comment/like", requireLogin, commentLikeController);

router.get("/post/:id", getSinglePostDataController);
router.delete("/post/:id", deletePostController);
// router.delete("/post/details", deletePostController);
// TODO: Ye bhi ek tareeka hain ki hum body me paas kr den yaa fir params me

// router.post("/post/comment", commentController);
router.get("/post/comment/all", getAllCommentById);

module.exports = router;
