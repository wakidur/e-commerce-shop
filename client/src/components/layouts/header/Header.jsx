import React from 'react';
import logo from '../../../assests/images/brand/bootstrap-social-logo.png';

const Header = () => {
  return (
    <header className="main-header border-bottom shadow-sm">
      <div className="container">
        <div className="row">
          <div className="col d-flex flex-column flex-md-row align-items-center py-3 ">
            <a className="navbar-brand p-0" href="#">
              <img
                src={logo}
                width="45"
                height="45"
                alt="Logo"
                loading="lazy"
              />
            </a>
            <form className="mr-md-auto ml-md-auto">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                </div>
                <input
                  type="search"
                  className="form-control border-1"
                  placeholder="Search"
                />
              </div>
            </form>
            <ul className="nav">
              <li className="nav-item addtocart">
                <a className=" py-1 px-3" href="#">
                  <i
                    className="fa fa-shopping-cart mr-2"
                    aria-hidden="true"
                  ></i>
                  <span>Cart </span>
                  <span className="ml-2 badge badge-warning count">4</span>
                </a>
              </li>
              <li className="nav-item user-name-icon py-1 px-3">
                <i className="fa fa-user-o " aria-hidden="true"></i>
                <span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
