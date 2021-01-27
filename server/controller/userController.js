const User = require("../models/User");

exports.userController = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err)
      return res.json({ success: false, message: "Sorry for inconvenince" });
    return res.status(200).json({
      success: true,
      user,
    });
  });
};

exports.getUserInfoController = (req, res) => {
  User.find()
    .populate("user")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
};
