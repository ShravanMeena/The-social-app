import React, { Component } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";

import axios from "axios";

import "../style/pages/_landing.css";
import SignupSvg from "../img/register.svg";
import LoginSvg from "../img/log.svg";

import LoginForm from "../component/Login";
import SignupForm from "../component/Signup";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { GoogleLogin } from "react-google-login";

export default class Landing extends Component {
  constructor() {
    super();
    this.state = {
      signupMode: false,
    };
  }

  sendGoogleToken = (tokenId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        console.log(res.data);
        // informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  responseGoogle = (response) => {
    this.sendGoogleToken(response.tokenId);
  };

  responseFacebook = (response) => {
    console.log(response);
    this.sendFacebookToken(response.userID, response.accessToken);
  };

  sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        console.log(res.data);
        // informParent(res);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  changeMode = () => {
    this.setState({
      signupMode: !this.state.signupMode,
    });
  };
  render() {
    return (
      <div
        className={
          this.state.signupMode ? "container sign-up-mode" : "container"
        }>
        <div className='forms-container'>
          <div className='signin-signup'>
            <SignupForm history={this.props.history} />
            <LoginForm history={this.props.history} />

            <div className='social-media'>
              {/* <Button type='primary' shape='circle'>
                <FacebookOutlined />
              </Button> */}

              {/* <Button type='primary' shape='circle'>
          <GoogleOutlined />
        </Button> */}

              {/* <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}>
                    <div className=' p-2 rounded-full '>
                      <i className='fab fa-google ' />
                    </div>
                    <span className='ml-4'>Sign In with Google</span>
                  </button>
                )}></GoogleLogin>

              <FacebookLogin
                appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                autoLoad={false}
                callback={this.responseFacebook}
                render={(renderProps) => (
                  <button onClick={renderProps.onClick}>
                    <div className=' p-2 rounded-full '>
                      <i className='fab fa-facebook' />
                    </div>
                    <span className='ml-4'>Sign In with Facebook</span>
                  </button>
                )}
              /> */}
            </div>
          </div>
        </div>
        <div className='panels-container'>
          <div className='panel left-panel'>
            <div className='content'>
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Debitis, ex ratione. Aliquid!
              </p>
              <button
                onClick={this.changeMode}
                className='btn transparent'
                id='sign-up-btn'>
                Sign up
              </button>
            </div>
            <img src={LoginSvg} className='image' alt='' />
          </div>
          <div className='panel right-panel'>
            <div className='content'>
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <button
                onClick={this.changeMode}
                className='btn transparent'
                id='sign-in-btn'>
                Sign in
              </button>
            </div>
            <img src={SignupSvg} className='image' alt='' />
          </div>
        </div>
      </div>
    );
  }
}
