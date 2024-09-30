import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AuthPage.css'; // Import the external CSS file

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    mobileNumber: '',
    email: '',
    password: '',
    address: {
      doorNo: '',
      street: '',
      landmarks: '',
      townCity: '',
      state: '',
      pincode: ''
    }
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignupAddressChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9500/auth/userLogin', loginData);
      if (response.status === 200) {
        window.location.href = "/user/user_homepage";
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9500/auth/userSignup', signupData);
      if (response.status === 201) {
        window.location.href = "/user/user_homepage";
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="container form-container d-flex justify-content-center align-items-center">
      <div className="card">
        <div className="card-header text-center">
          <h4 className="card-title">{isLogin ? 'User Login' : 'User Signup'}</h4>
          <p className="card-text">{isLogin ? 'Enter your details to login.' : 'Fill out the form to create an account.'}</p>
        </div>
        <div className="card-body">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={signupData.mobileNumber}
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="form-control"
                  required
                />
              </div>
              <fieldset className="border p-4 mb-4">
                <legend className="w-auto">Address</legend>
                <div className="mb-4">
                  <label htmlFor="doorNo" className="form-label">Door No</label>
                  <input
                    type="text"
                    id="doorNo"
                    name="doorNo"
                    value={signupData.address.doorNo}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="street" className="form-label">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={signupData.address.street}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="landmarks" className="form-label">Landmarks</label>
                  <input
                    type="text"
                    id="landmarks"
                    name="landmarks"
                    value={signupData.address.landmarks}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="townCity" className="form-label">Town/City</label>
                  <input
                    type="text"
                    id="townCity"
                    name="townCity"
                    value={signupData.address.townCity}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={signupData.address.state}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pincode" className="form-label">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={signupData.address.pincode}
                    onChange={handleSignupAddressChange}
                    className="form-control"
                    required
                  />
                </div>
              </fieldset>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Signup</button>
              </div>
            </form>
          )}
        </div>
        <div className="card-footer text-center">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              className="btn btn-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Signup here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
