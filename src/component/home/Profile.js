import React, { Component } from "react";
import { Card, Avatar, Comment, Tooltip, Divider } from "antd";
import "../../style/component/_profile.scss";
import ProfileLogo from "../../assets/aadmi.jpg";
const { Meta } = Card;

export default class Profile extends Component {
  profile = (id) => {
    this.props.history.push(`/user/${id}`);
  };
  render() {
    const profile = this.props.profile_data;
    return (
      <div className='profile'>
        <Card className='card'>
          <div className='innerCard'>
            <img src={ProfileLogo} />
            <h4 onClick={() => this.profile(profile._id)}>{profile.name}</h4>
            <p>
              as,dksa kdakdkas dasj as,dksa kdakdkas dasj as,dksa kdakdkas dasj
              as,dksa kdakdkas dasj as,dksa kdakdkas dasj
            </p>

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
      </div>
    );
  }
}
