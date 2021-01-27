import React, { Component } from "react";
import {
  Card,
  Avatar,
  Comment,
  Tooltip,
  Divider,
  Modal,
  Button,
  Form,
  Input,
} from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";

import "../../style/component/_post.scss";
import PostLogo from "../../assets/postImg.jpg";
import Create from "./post/Create";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";

const { Meta } = Card;
const { TextArea } = Input;

class Post extends Component {
  constructor() {
    super();
    this.state = {
      likes: 0,
      dislikes: 0,
      action: null,
      create_post_modal: false,
      data: [],
      loading: false,
      visible: false,

      // ppst data
      title: "",
      category: "",
      description: "",
      url: "",
      location: "",
      tags: "",
      activity: "",
      file: null,

      comment: "",
      showComment: false,
    };
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  like = () => {
    this.setState({
      likes: 1,
      dislikes: 0,
      action: "liked",
    });
  };

  dislike = () => {
    this.setState({
      likes: 0,
      dislikes: 1,
      action: "disliked",
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  createPost = () => {
    if (!this.state.description) {
      toast.error("Please write down your thoughts!");
      return;
    }

    const formData = new FormData();
    formData.append("url", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/post-url`, formData, config)
      .then((response) => {
        this.setState({
          url: response.data.post_url,
          loading: true,
        });

        if (response.data.success) {
          const data = {
            description: this.state.description,
            url: this.state.url,
          };

          axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/api/post`,
            headers: {
              Authorization: `Bearer ${this.props.getUserData.data.token}`,
            },
            data: data,
          })
            .then((response) => {
              this.setState({
                loading: false,
                visible: false,
              });
              this.getAllPost();
            })
            .catch((err) => {
              toast.warning("Something went wrong!!");
              this.setState({
                loading: false,
              });
            });
        }
      })
      .catch((error) => {});

    this.setState({ loading: true });
  };

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  getAllPost = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/post`,
    })
      .then((response) => {
        this.setState({
          loading: false,
          data: response.data.posts,
        });
      })
      .catch((err) => {
        toast.warning("Something went wrong!!");
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getAllPost();
  }

  follow = (id) => {
    const data = {
      followId: id,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/user/follow`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
      data: data,
    })
      .then((response) => {
        this.getAllPost();
      })
      .catch((err) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  unfollow = (id) => {
    const data = {
      followId: id,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/user/unfollow`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
      data: data,
    })
      .then((response) => {
        this.getAllPost();
      })
      .catch((err) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  like = (id) => {
    const data = {
      postId: id,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/post/like`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
      data: data,
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.getAllPost();
      })
      .catch((err) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  unlike = (id) => {
    const data = {
      postId: id,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/post/dislike`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
      data: data,
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.getAllPost();
      })
      .catch((err) => {
        toast.error("you are not allow to follow himself");
        this.setState({
          loading: false,
        });
      });
  };

  addComment = (id) => {
    if (!this.state.comment) {
      toast.error("Please comment something");
      return;
    }
    const data = {
      comment: this.state.comment,
      postId: id,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/post/comment`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
      data: data,
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.getAllPost();
        this.setState({
          comment: "",
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };

  render() {
    return (
      <div className='postContainer'>
        <ToastContainer />
        <Card className='form'>
          <Input
            size='large'
            onClick={this.showModal}
            placeholder='Create new post'
          />
          <Modal
            className='model'
            visible={this.state.visible}
            title='Create new post'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              // <Button key='back' onClick={this.handleCancel}>
              //   Return
              // </Button>,
              <Button
                key='submit'
                type='primary'
                loading={this.state.loading}
                onClick={this.createPost}>
                Create Post
              </Button>,
            ]}>
            <TextArea
              value={this.state.description}
              name='description'
              onChange={(event) => this.handleChange(event)}
              rows={2}
              onClick={this.showModal}
              placeholder='Type your thoughts'
            />

            {/* <Button style={{ marginTop: 10 }}>Feelings</Button>
            <Button style={{ marginTop: 10 }} type='danger'>
              Attachment
            </Button> */}
            <Input type='file' name='myImage' onChange={this.onChange} />
          </Modal>
        </Card>

        {this.state.data.reverse().map((post, index) => {
          return (
            <div className='post'>
              <Card className='singlePost'>
                <div className='headerCard'>
                  <p
                    onClick={() => this.profile(post.creator._id)}
                    className='title'>
                    {post.creator.name}
                  </p>
                  {post.creator.followers.includes(
                    this.props.getUserData.data.user._id
                  ) ? (
                    <Button onClick={() => this.unfollow(post.creator._id)}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      onClick={() => this.follow(post.creator._id)}>
                      Follow
                    </Button>
                  )}
                </div>

                <div className='imgConainer'>
                  <img
                    onDoubleClick={() => alert("I m working on it")}
                    alt='example'
                    src='https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'
                  />
                </div>

                {post.likers.includes(this.props.getUserData.data.user._id) ? (
                  <h6 onClick={() => this.unlike(post._id)}>
                    <LikeFilled /> {post.likers.length} Likes
                  </h6>
                ) : (
                  <h6 onClick={() => this.like(post._id)}>
                    <LikeOutlined /> {post.likers.length}
                    Likes
                  </h6>
                )}

                <p className='description'>{post.description}</p>

                <div className='commntForm'>
                  <TextArea
                    rows={4}
                    name='comment'
                    value={this.state.comment}
                    onChange={this.handleChange}
                  />
                  {!(this.state.comment.length === 0) ? (
                    <Button onClick={() => this.addComment(post._id)}>
                      Comment
                    </Button>
                  ) : (
                    <Button ghost disabled>
                      Comment
                    </Button>
                  )}
                </div>

                {/* comments */}
                {post.comments.length === 0 ? null : (
                  <h4
                    className='viewCommnetTitle'
                    onClick={() => this.setState({ showComment: post._id })}>
                    View all {post.comments.length} comments
                  </h4>
                )}

                {this.state.showComment == post._id ? (
                  <>
                    {post.comments.reverse().map((comment, c) => {
                      console.log(comment);
                      return (
                        <Comment
                          className='comment'
                          // actions={actions}
                          author={<a>name goes here</a>}
                          avatar={<Avatar src={PostLogo} alt='Han Solo' />}
                          content={<p>{comment.comment}</p>}
                          datetime={
                            <Tooltip
                              title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                              <span>{moment().fromNow()}</span>
                            </Tooltip>
                          }
                        />
                      );
                    })}
                  </>
                ) : null}
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getUserData: state.userReducer,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     sendCurrentNetworkDetailsData: (data) =>
//       dispatch(currentNetworkDetailsAction(data)),
//   };
// };
export default connect(mapStateToProps, null)(Post);
