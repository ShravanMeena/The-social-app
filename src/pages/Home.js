import React, { Component } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result, Spin } from "antd";

import "../style/pages/_home.scss";
import axios from "axios";
import Post from "../component/home/Post";
import Profile from "../component/home/Profile";
import Suggestion from "../component/home/Suggestion";
import { connect } from "react-redux";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      profile_data: "",
      post_data: "",
    };
  }
  getMyData = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/user/${this.props.getUserData.data.user._id}`,
      headers: {
        Authorization: `Bearer ${this.props.getUserData.data.token}`,
      },
    })
      .then((response) => {
        this.setState({
          profile_data: response.data.user,
          post_data: response.data.posts,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };
  componentDidMount() {
    this.getMyData();
  }
  render() {
    if (!this.state.post_data) {
      return (
        <div className='loader'>
          <Spin />
        </div>
      );
    }
    return (
      <div className='home'>
        {/* <div className='left'>
          <Profile
            profile_data={this.state.profile_data}
            history={this.props.history}
          />
        </div> */}
        <div className='middle'>
          <Post history={this.props.history} />
        </div>
        <div className='right'>
          <Suggestion history={this.props.history} />
        </div>
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
export default connect(mapStateToProps, null)(Home);
