import React, { Component } from 'react';
import './../styles/App.css';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-quote">
          As the great Link famously said... "HYAAAAH! HAT HYAT SSSSKKKYYYAAAAAAA!"
        </div>
        <div className="footer-text-block">
          Franchise owned by Nintendo. Thumbnails and screenshots not mine.
        </div>
        <div className="footer-text-block">
          David Hong. Created in 2018. Powered by React.
        </div>
        <div className="footer-icon">
          <a href="https://github.com/Oasiris/botw-cookbook" target="_blank" rel="noopener noreferrer" alt="View in GitHub">
            <i className="icon-github-circled"></i>
          </a>
        </div>

      </div>
    )
  }
}