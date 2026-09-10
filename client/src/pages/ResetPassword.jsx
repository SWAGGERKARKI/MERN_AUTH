import React, { useState, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('swaggerkarki@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // import app context items
  const { backendUrl } = useContext(AppContext);
  // allow cookies to send
  axios.defaults.withCredentials = true;

  // to target the input field
  const inputRefs = useRef([]);

  // define inputHandle function for moving to next input after entering the current input
  const handleInput = (e, i) => {
    if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1].focus();
      // console.log(e.clipboardData);
    }
  };

  // function to handle backspace key
  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && e.target.value === '' && i > 0) {
      inputRefs.current[i - 1].focus();
    } else if (e.key === 'ArrowRight' && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1].focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  // function to handle the paste feature
  const handlePaste = (e) => {
    // inputRefs.current[4].focus();
    const paste = e.clipboardData.getData('text');
    // console.log(paste);
    const pasteArray = paste.split('');
    // console.log(pasteArray);
    pasteArray.forEach((chr, idx) => {
      // console.log(inputRefs.current[idx]);
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = chr;
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-4 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* form to submit for forget password */}
      {!isEmailSent && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // call api endpoint to sent the opt to the mail
            try {
              // call reset password api endpoint
              const { data } = await axios.post(
                backendUrl + '/api/auth/send-reset-otp',
                { email },
              );
              console.log('send otp', data);
              // check response
              if (data.success) {
                // change the state variable true
                setIsEmailSent(true);
                // notify user
                toast.success(data.message);
              } else {
                // notify user
                toast.error(data.message);
              }
            } catch (error) {
              // notify user of fetching response error
              toast.error(error.message);
            }
          }}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center m-4">
            Reset Password
          </h1>
          <p className="text-indigo-300 text-center mb-6">
            Enter your registered email address
          </p>
          <div className="bg-[#333A5C] px-5 py-2.5 rounded-full mb-4 flex items-center gap-3">
            <img src={assets.mail_icon} alt="mail-icon" className="w-3 h-3" />
            <input
              type="email"
              placeholder="enter your mail"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full text-white py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      )}

      {/* otp form */}
      {isEmailSent && !otp && (
        <form
          // onSubmit={onSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(inputRefs.current);
            // take otp from inputref
            const otpArray = inputRefs.current.map((e) => e.value);
            // convert otp array into otp string and save to otp
            setOtp(otpArray.join(''));
            setIsOtpSubmitted(true);
          }}
        >
          <h1 className="text-white text-2xl font-semibold text-center m-4">
            Reset Password OTP
          </h1>
          <p className="text-indigo-300 text-center mb-6">
            Enter the 6-digit code sent to your email id.
          </p>
          {/* 6 input fields for 6-digit code */}
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  type="text"
                  maxLength={1}
                  className="p-4 w-12 bg-[#333A5C] text-center text-white text-xl rounded-md outline-none"
                  key={i}
                  // this code saves each input box into an array
                  ref={(e) => (inputRefs.current[i] = e)}
                  onInput={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
          </div>
          {/* button to submit the form */}
          <button className="w-full text-white py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      )}

      {/* new password form */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // call api to set new password
            try {
              // call reset password endpoint
              console.log(email);
              console.log(otp);
              console.log(newPassword);
              const { data } = await axios.post(
                backendUrl + '/api/auth/reset-password',
                {
                  email,
                  otp,
                  newPassword,
                },
              );
              // check response and notify users
              if (data.success) {
                toast.success(data.message);
                navigate('/login');
              } else {
                toast.error(data.message);
              }
            } catch (error) {
              // notify if respoinding error
              toast.error(error.message);
            }
          }}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center m-4">
            New Password
          </h1>
          <p className="text-indigo-300 text-center mb-6">
            Enter the new password below
          </p>
          <div className="bg-[#333A5C] px-5 py-2.5 rounded-full mb-4 flex items-center gap-3">
            <img src={assets.lock_icon} alt="lock-icon" className="w-3 h-3" />
            <input
              type="text"
              placeholder="enter your password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full text-white py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
