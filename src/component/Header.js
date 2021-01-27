import React, { Component } from "react";
import "../style/component/_header.scss";
export default class Header extends Component {
  render() {
    return (
      <div className='header'>
        <div className='innerHeader'>
          <div className='left'>
            <h4>
              <a href='/home'>
                The<span>Social</span>App
              </a>
            </h4>
          </div>
          <div className='right'>
            {/* <div>
              <h4>Home</h4>
            </div>

            <div>
              <h4>Friends</h4>
            </div>

            <div>
              <h4>Profile</h4>
            </div>

            <div>
              <h4>Messages</h4>
            </div>

            <div>
              <h4>Logout</h4>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
