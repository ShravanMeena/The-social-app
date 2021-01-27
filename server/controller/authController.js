const { validationResult } = require("express-validator");
const Auth = require("../models/authModels");
const Post = require("../models/postModel");
const jwt = require("jsonwebtoken");
// const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

var nodemailer = require("nodemailer");
const { errorHandler } = require("../helpers/dbErrorHandling");

exports.getSingleUserInfoController = (req, res) => {
  Auth.findOne({ _id: req.params.id })
    .select("-hashed_password -salt")
    .exec((err, user) => {
      if (err) {
        return res.json({ success: false });
      }
      Post.find({ creator: req.params.id })
        .populate("creator", "_id, name")
        .exec((err, posts) => {
          if (err) {
            return res.json({ success: false });
          }
          return res.json({ user, posts });
        });
    });
};

exports.getAllUsersController = (req, res) => {
  Auth.find()
    .select("-hashed_password -salt")
    .exec((err, user) => {
      if (err) {
        return res.json({ success: false });
      }
      return res.json({ user });
      // Post.find({ creator: req.params.id })
      //   .populate("creator", "_id, name")
      //   .exec((err, posts) => {
      //     if (err) {
      //       return res.json({ success: false });
      //     }
      //     return res.json({ user, posts });
      //   });
    });
};

exports.followUserController = (req, res) => {
  if (req.body.followId == req.user._id) {
    return res
      .status(400)
      .json({ message: "you are not allow to follow himself" });
  }
  Auth.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.json({ success: false });
      }
      Auth.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      ).then((result) => {
        return res.status(200).json({ result });
      });
    }
  );
};

exports.unFollowUserController = (req, res) => {
  Auth.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.json({ success: false });
      }
      Auth.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId },
        },
        {
          new: true,
        }
      ).then((result) => {
        return res.status(200).json({ result });
      });
    }
  );
};

exports.subscribePostController = (req, res) => {
  // if creator in following
  Post.find({ creator: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.creator", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    Auth.findOne({ email }).exec((err, user) => {
      if (user) {
        res.status(400).json({
          errors: "email is already taken",
        });
      }
    });
  }

  // generate token
  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "5m" }
  );

  return res
    .status(200)
    .json({ message: "true", token, expiresIn: "5 minute" });

  // email sending data
  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL_FROM,
  //     pass: process.env.EMAIL_FROM_PASS,
  //   },
  // });
  // var emailData = {
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: "Account activation link",
  //   html: `
  //               <h1>Please use the following to activate your account</h1>
  //               <p>${process.env.CLIENT_URL}/user/activate/${token}</p>
  //               <hr />
  //               <p>This email may containe sensetive information</p>
  //               <p>${process.env.CLIENT_URL}</p>
  //           `,
  // };

  // transporter.sendMail(emailData, function (error, info) {
  //   if (error) {
  //     return res.status(400).json({
  //       success: false,
  //       errors: error,
  //     });
  //   } else {
  //     return res.json({
  //       success: true,
  //       message: `Email has been sent to ${email}`,
  //     });
  //   }
  // });
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          errors: "Expired link. Signup again",
        });
      } else {
        const { name, email, password } = jwt.decode(token);
        const user = new Auth({
          name,
          email,
          password,
        });
        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: "Signup success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_SECRET, // req.user._id
// });

exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    Auth.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match",
        });
      }

      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    Auth.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        // email sending data
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_FROM_PASS,
          },
        });

        var emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Password reset link",
          html: `
                <h1>Please use the following to reset your password</h1>
                <p>${process.env.CLIENT_URL}/password/reset/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              transporter.sendMail(emailData, function (error, info) {
                if (error) {
                  return res.status(400).json({
                    success: false,
                    errors: error,
                  });
                } else {
                  return res.json({
                    success: true,
                    message: `Email has been sent to ${email}`,
                  });
                }
              });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          Auth.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: "Something went wrong. Try later",
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: "",
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error reseting user password",
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        Auth.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new Auth({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        Auth.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};

// <script>
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{your-app-id}',
//       cookie     : true,
//       xfbml      : true,
//       version    : '{api-version}'
//     });

//     FB.AppEvents.logPageView();

//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// </script>
