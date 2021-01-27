import React, { Component } from "react";
import { Card, Avatar, Comment, Tooltip, Divider } from "antd";
import "../style/pages/_friends.scss";
import ProfileLogo from "../assets/aadmi.jpg";
import axios from "axios";
const { Meta } = Card;

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  getAllUsers = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/user`,
    })
      .then((response) => {
        // const result = response.data.user.filter(
        //   (u) => u._id !== this.props.getUserData.data.user._id
        // );

        this.setState({
          data: response.data.user,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };

  componentDidMount() {
    this.getAllUsers();
  }

  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };
  render() {
    return (
      <div className='friendsContainer'>
        <h1>Find Friends</h1>

        <div className='profile'>
          {this.state.data.map((profile, index) => {
            return (
              <Card className='card'>
                <div className='innerCard'>
                  <img src={ProfileLogo} />
                  <h4 onClick={() => this.profile(profile._id)}>
                    {profile.name}
                  </h4>
                  <p>active a few seconds ago</p>

                  <div className='followContainer'>
                    <div className='follow'>
                      <h4>0</h4>
                      <h6>Followers</h6>
                    </div>

                    <div className='follow'>
                      <h4>0</h4>
                      <h6>Following</h6>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}
