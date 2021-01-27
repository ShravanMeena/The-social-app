const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: 0,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
  },
  location: {
    type: String,
  },
  tags: {
    type: [String],
  },
  comments: [
    {
      comment: String,
      commentedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },

      likers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
      ],
    },
  ],

  // likes: {
  //   // count: { type: Number, default: 0 },
  likers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  ],
  // },

  activity: {
    type: String,
    default: "Happy",
  },
});

module.exports = mongoose.model("Post", postSchema);
