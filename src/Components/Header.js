// src/components/Header.js
import React from 'react';
import './Header.css'; // optional for styling
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Left - Logo */}
      <a className="navbar-brand d-flex align-items-center" href="#">
        <img
          src="/new-favicon.png"
          alt="logo"
          width="30"
          height="30"
          className="me-2"
        />
        <strong>Crypto-Tracker</strong>
      </a>

      {/* Middle - Nav Links */}
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" href="#">Portfolio Tracker</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Swap</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Cryptocurrencies</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Pricing</a>
          </li>
        </ul>

        {/* Center - Search bar */}
        <form className="d-flex me-3" role="search">
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Assets, Wallets, Domains"
          />
        </form>

        {/* Right - Icons + Login Buttons */}
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-gear text-white fs-5"></i>
          <i className="bi bi-phone text-white fs-5"></i>
          <a className="btn btn-outline-light btn-sm" href="#">Login</a>
          <a className="btn btn-warning btn-sm" href="#">Get Started</a>
        </div>
      </div>
    </nav>
  );
}

export default Header;