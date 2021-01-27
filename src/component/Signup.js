import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userAction } from "../redux/action/userAction";
import { Button } from "antd";
import { ToastContainer, toast } from "react-toastify";

import { Spin } from "antd";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      is_agreed_to_terms: true,
      loading: false,
    };
  }

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.register();
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
    const { name, email, password } = this.state;
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    const data = {
      name,
      email,
      password,
    };

    this.setState({
      loading: true,
    });
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/register`,
      data: data,
    })
      .then((response) => {
        this.props.sendUserData(response.data);
        toast.success(response.data.message);
        this.setState({
          loading: false,
        });

        this.props.history.push(`/user/activate/${response.data.token}`);
      })
      .catch((err) => {
        toast.warning("Something went wrong!!");
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    return (
      <form action='/' className='sign-up-form'>
        <ToastContainer />
        <h2 className='title'>Sign up</h2>
        <div className='input-field'>
          <i className='fas fa-user'></i>
          <input
            onKeyDown={this._handleKeyDown}
            value={this.state.name}
            name='name'
            onChange={(event) => this.handleChange(event)}
            type='text'
            placeholder='Name'
          />
        </div>
        <div className='input-field'>
          <i className='fas fa-envelope'></i>
          <input
            type='email'
            onKeyDown={this._handleKeyDown}
            value={this.state.email}
            name='email'
            onChange={(event) => this.handleChange(event)}
            placeholder='Email'
          />
        </div>
        <div className='input-field'>
          <i className='fas fa-lock'></i>
          <input
            type='password'
            onKeyDown={this._handleKeyDown}
            value={this.state.password}
            name='password'
            onChange={(event) => this.handleChange(event)}
            placeholder='Password'
          />
        </div>
        {/* <input type='submit' className='btn' value='Sign up' /> */}

        <Spin spinning={this.state.loading}>
          <Button
            onClick={() => this.onSubmit()}
            type='primary'
            shape='round'
            className='btn'>
            Sign up
          </Button>
        </Spin>

        <p className='social-text'>Or Sign up with social platforms</p>
      </form>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     getUserData: state.userReducer,
//     getSessionData: state.sessionReducer,
//   };
// };

const mapDispatchToProps = (dispatch) => {
  return {
    sendUserData: (data) => dispatch(userAction(data)),
  };
};
export default connect(null, mapDispatchToProps)(Signup);
