import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userAction } from "../redux/action/userAction";
import { ToastContainer, toast } from "react-toastify";
import { Spin, Button } from "antd";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      is_agreed_to_terms: true,
      loading: false,
    };
  }

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.onSubmit();
    }
  };

  handleChange = (event) => {
    // if (
    //   event.target.name === "mobile_number" &&
    //   isNaN(parseInt(event.target.value))
    // ) {
    //   this.setState({
    //     [event.target.name]: "",
    //   });
    //   return;
    // }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = () => {
    const { email, password } = this.state;
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    const data = {
      email,
      password,
    };
    this.setState({
      loading: true,
    });
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/login/`,
      data: data,
    })
      .then((response) => {
        this.props.sendUserData(response.data);
        toast.success(response.data.message);
        this.setState({
          loading: false,
        });
        this.props.history.push("/home");
      })
      .catch((err) => {
        toast.error("Email or password is wrong");
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    return (
      <form action='/' className='sign-in-form'>
        <ToastContainer />
        <h2 className='title'>Sign in</h2>
        <div className='input-field'>
          <i className='fas fa-user'></i>
          <input
            onKeyDown={this._handleKeyDown}
            value={this.state.email}
            name='email'
            onChange={(event) => this.handleChange(event)}
            type='Email'
            placeholder='Email'
          />
        </div>

        <div className='input-field'>
          <i className='fas fa-lock'></i>
          <input
            onKeyDown={this._handleKeyDown}
            value={this.state.password}
            name='password'
            onChange={(event) => this.handleChange(event)}
            type='password'
            placeholder='Password'
          />
        </div>

        <Spin spinning={this.state.loading}>
          <Button
            onClick={() => this.onSubmit()}
            type='primary'
            shape='round'
            className='btn solid'>
            Login
          </Button>
        </Spin>

        <p className='social-text'>Or Sign in with social platforms</p>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendUserData: (data) => dispatch(userAction(data)),
  };
};
export default connect(null, mapDispatchToProps)(Login);
