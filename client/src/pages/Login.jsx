import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true; // to send cookies with api request

      if (login) {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        console.log(data);

        if (data.success) {
          data?.message
            ? console.log(data.message)
            : console.log('user login success');
          toast.success(data.message);
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          console.log('user login failed');
          toast.error(data.message);
        }
      } else {
        console.log('sign up data submission', formData);
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          formData
        );

        if (data.success) {
          data.message
            ? console.log(data.message)
            : console.log('user registeration success');
          toast.success(data.message);
          setIsLoggedIn(true);
          navigate('/');
        } else {
          console.log('user registration failed');
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="border border-red-500 flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-4 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-98 text-indigo-200 text-sm">
        <h2 className="text-3xl text-center text-white mb-3 font-semibold">
          {login ? 'Login account' : 'Create account'}
        </h2>

        <p className="text-sm text-center mb-6">
          {login ? 'Login to your account' : 'Create your account'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {login || (
            <div className="mb-4 bg-[#1a2b3c] flex gap-3 w-full px-5 py-2.5 rounded-full">
              <img src={assets.person_icon} alt="person-icon" />
              <input
                className="bg-transparent outline-none text-white"
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-4 bg-[#1a2b3c] flex gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.mail_icon} alt="mail-icon" />
            <input
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="john@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 bg-[#1a2b3c] flex gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.lock_icon} alt="lock-icon" />
            <input
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {login && (
            <p
              className="text-indigo-500 mb-4 cursor-pointer"
              onClick={() => navigate('/reset-password')}
            >
              Forget password?
            </p>
          )}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            {login ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {login ? (
          <p className="mt-4 text-center text-gray-400 text-xs">
            Don't have an account?{' '}
            <span
              className="text-indigo-500 underline cursor-pointer"
              onClick={() => setLogin(false)}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-4 text-center text-gray-400 text-xs">
            Already have an account?{' '}
            <span
              className="text-indigo-500 underline cursor-pointer"
              onClick={() => setLogin(true)}
            >
              Login here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
