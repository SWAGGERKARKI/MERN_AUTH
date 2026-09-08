import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  // function to call the verify mail api and redirect to email verification page
  const sendVerificationOtp = async () => {
    try {
      // send cookies
      axios.defaults.withCredentials = true;
      // api call on sendVerificationOtp api endpoint created at backend
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp',
      );
      // check response
      if (data.success) {
        // if success is true verification otp is already sent
        // we have to navigate user to verify otp page
        navigate('/email-verify');
        // display success notification
        toast.success(data.message);
      } else {
        // dispaly error notification from response
        toast.error(data.message);
      }
    } catch (error) {
      // display error message while occuring error in response
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 ">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute top-0 right-0 pt-10 hidden group-hover:block text-black">
            <ul className="list-none m-0 bg-gray-50 text-sm rounded z-10">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer rounded text-nowrap"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={() => navigate('/login')}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer rounded"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-500 hover:bg-gray-100 hover:cursor-pointer transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow-icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
