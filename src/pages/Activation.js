import React, { Component } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";

import "../style/pages/_landing.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default class ActivationPage extends Component {
  //   constructor() {
  //     super();
  //     this.state = {
  //       signupMode: false,
  //     };
  //   }
  onSubmit = () => {
    const data = {
      token: this.props.match.params.token,
    };
    // alert(JSON.stringify(data.token));
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/activation`,
      data: data,
    })
      .then((response) => {
        toast.error("Wow, your are verified");
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Already verify or expire token");
      });
  };
  render() {
    return (
      <div className='activteContainer'>
        <ToastContainer />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}>
          <Button
            onClick={this.onSubmit}
            size='large'
            shape='round'
            type='primary'>
            Activate
          </Button>
        </div>
      </div>
    );
  }
}
