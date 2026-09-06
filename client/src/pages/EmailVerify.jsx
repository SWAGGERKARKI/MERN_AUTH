import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const EmailVerify = () => {
  const navigate = useNavigate();

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
    console.log(e.key);
    if (e.key === 'Backspace' && e.target.value === '' && i > 0) {
      inputRefs.current[i - 1].focus();
    } else if (e.key === 'ArrowRight' && i < inputRefs.current.length - 1) {
      console.log(inputRefs.current[i + 1].focus());
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
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center m-4">
          Email Verify OTP
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
                ref={(e) => (inputRefs.current[i] = e)}
                onInput={(e) => handleInput(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
        </div>
        {/* button to submit the form */}
        <button
          onClick={() => alert('submit the code')}
          className="w-full text-white py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
