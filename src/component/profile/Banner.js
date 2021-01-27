import React, { Component } from "react";
import Cover from "../../assets/aadmi.jpg";
import ProfileLogo from "../../assets/postImg.jpg";
import "../../style/component/profile/_banner.scss";
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
export default class Banner extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
      profile_data: null,
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  componentDidMount() {
    this.setState({
      profile_data: this.props.profile_data,
    });
  }
  render() {
    const profile = this.props.profile_data;
    return (
      <div className='banner'>
        <div className='cover'>
          <img src={Cover} />
        </div>

        <div className='profile'>
          <img src={ProfileLogo} />
          <h4>{profile.name}</h4>
        </div>

        <Modal
          className='model'
          visible={this.state.visible}
          title='Followers'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            // <Button key='back' onClick={this.handleCancel}>
            //   Return
            // </Button>,
            <Button key='submit' type='primary' onClick={this.handleCancel}>
              Go Back
            </Button>,
          ]}>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
          <p>Shravan meena</p>
        </Modal>

        <div className='followersContainer'>
          <div className='follow'>
            <h4 onClick={this.showModal}>Followers</h4>
            <p>{profile.followers.length}</p>
          </div>

          <div className='follow'>
            <h4 onClick={this.showModal}>Following</h4>
            <p>{profile.following.length}</p>
          </div>
        </div>
      </div>
    );
  }
}
