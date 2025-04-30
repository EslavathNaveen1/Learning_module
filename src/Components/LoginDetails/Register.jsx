import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();


  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) errors.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("Include at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Include at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Include at least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push("Include at least one special character");
    
    return errors;
  };

 
  useEffect(() => {
    if (password) {
      const errors = validatePassword(password);
      setPasswordError(errors.length ? errors.join(", ") : "");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }
    
    try {
      const checkResponse = await axios.post("http://localhost:5104/api/Qtech/RegisterVerification", { email });
      
      if (checkResponse.data.exists) {
        setErrorMessage("You already have an account. Please log in.");
        return;
      }

     
      setOtpSent(true);
      setErrorMessage(""); 
      alert("OTP sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      
      await axios.post("http://localhost:5104/api/Qtech/RegisterVerification", { email });
      alert("OTP resent to your email.");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrorMessage("Failed to resend OTP. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
   
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join(", "));
      return;
    }

    const user = {
      email,
      firstName,
      lastName,
      password,
      otp
    };

    try {
      const response = await axios.post("http://localhost:5104/api/Qtech/Registration", user);

      if (response.data) {
        alert("Registration successful");
        setIsRegistered(true);
        navigate("/login"); 
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("There was an error registering the user!", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mt-4">Register</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-lg shadow-lg border border-gray-200">
    {!isRegistered ? (
      <>
        {!otpSent ? (
          <>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                required
                placeholder="Enter your email"
              />
            </div>
            <button 
              onClick={handleSendOtp} 
              className="w-full text-white px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-300 font-medium"
              style={{ backgroundColor: "#A32CC4" }}
            >
              Send OTP
            </button>
            {errorMessage && (
              <p className="mt-4 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{errorMessage}</p>
            )}
          </>
        ) : (
          <>
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="mt-1">
                  <input
                    placeholder="Enter Your First Name"
                    type="text"
                    name="fname"
                    id="fname"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="mt-1">
                  <input
                    placeholder="Enter Your Last Name"
                    type="text"
                    name="lname"
                    id="lname"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border ${passwordError ? 'border-red-300' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-purple-600 focus:border-purple-600'} transition-all`}
                  />
                </div>
                {passwordError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    <p className="font-medium mb-1">Password must contain:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {validatePassword(password).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {password && !passwordError && (
                  <p className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                    Password meets all requirements ✓
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP sent to your email"
                    className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={!!passwordError}
                  className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${!passwordError ? 'hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-300`}
                  style={!passwordError ? { backgroundColor: "#A32CC4" } : {}}
                >
                  Register
                </button>
              </div>
              <div className="mt-3 text-center">
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  className="text-sm font-medium focus:outline-none focus:underline transition-all"
                  style={{ color: "#A32CC4" }}
                >
                  Resend OTP
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="mt-4 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{errorMessage}</p>
            )}
          </>
        )}
      </>
    ) : (
      <div className="text-center py-6">
        <div className="mb-4" style={{ color: "#A32CC4" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xl font-medium text-gray-900">Registration complete!</p>
        <p className="text-gray-600 mt-2">Redirecting to login page...</p>
      </div>
    )}
  </div>
</div>
  );
};

export default Register;