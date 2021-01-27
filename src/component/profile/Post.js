import React, { Component } from "react";
import {
  Card,
  Avatar,
  Comment,
  Tooltip,
  Divider,
  Modal,
  Button,
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
import Create from "../home/post/Create";
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

  componentDidMount() {
    this.setState({
      data: this.props.post_data,
    });
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const actions = [
      <Tooltip key='comment-basic-like' title='Like'>
        <span onClick={this.like}>
          {React.createElement(
            this.state.action === "liked" ? LikeFilled : LikeOutlined
          )}
          <span className='comment-action'>{this.state.likes}</span>
        </span>
      </Tooltip>,
      <Tooltip key='comment-basic-dislike' title='Dislike'>
        <span onClick={this.dislike}>
          {React.createElement(
            this.state.action === "disliked" ? DislikeFilled : DislikeOutlined
          )}
          <span className='comment-action'>{this.state.dislikes}</span>
        </span>
      </Tooltip>,
      //   <span key='comment-basic-reply-to'>Reply to</span>,
    ];
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
              rows={5}
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

        {this.props.post_data.reverse().map((post, index) => {
          return (
            <div className='post'>
              <Card
                cover={
                  <img
                    alt='example'
                    src='https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'
                  />
                }
                className='singlePost'>
                <Meta
                  avatar={<Avatar src={PostLogo} />}
                  title={
                    <p style={{ cursor: "pointer" }}>{post.creator.name}</p>
                  }
                  description={post.description}
                />

                {/* comments */}
                {/* <Comment
                  className='comment'
                  actions={actions}
                  author={<a>Han Solo</a>}
                  avatar={<Avatar src={PostLogo} alt='Han Solo' />}
                  content={
                    <p>
                      We supply a series of design principles, practical
                      patterns and
                    </p>
                  }
                  datetime={
                    <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
                      <span>{moment().fromNow()}</span>
                    </Tooltip>
                  }
                /> */}
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
