import React, { Component } from "react";
import { Modal, Button, Input } from "antd";

export default class Create extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    const { visible, loading } = this.state;

    return (
      <div>
        <div>
          <Input onClick={this.showModal} placeholder='Craete new post' />
          <Modal
            visible={visible}
            title='Title'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key='back' onClick={this.handleCancel}>
                Return
              </Button>,
              <Button
                key='submit'
                type='primary'
                loading={loading}
                onClick={this.handleOk}>
                Submit
              </Button>,
            ]}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </div>
      </div>
    );
  }
}
