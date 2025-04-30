import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainHome from "../Home/MainHome";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [matchError, setMatchError] = useState("");


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
    if (newPassword) {
      const errors = validatePassword(newPassword);
      setPasswordError(errors.length ? errors : []);
    } else {
      setPasswordError([]);
    }
  }, [newPassword]);


  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setMatchError("Passwords do not match");
    } else {
      setMatchError("");
    }
  }, [newPassword, confirmPassword]);

  const onValidateEmail = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:5104/api/Qtech/forgotpassword", { email });

      if (response.status === 200) {
        setEmailValidated(true);
        alert("OTP sent to your email");
      } else {
        alert("Invalid email");
      }
    } catch (error) {
      console.error("Error validating email:", error);
      alert("Error validating email");
    }
  };

  const onResendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5104/api/Qtech/forgotpassword", { email });
      if (response.status === 200) {
        alert("OTP resent to your email");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Error resending OTP");
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMatchError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5104/api/Qtech/verifyotp", { email, otp, newPassword });

      if (response.status === 200) {
        alert("Password updated successfully");
        navigate("/");
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 
            className="text-center text-3xl font-bold tracking-tight mb-6" 
            style={{ color: "#A32CC4" }}
          >
            Reset Your Password
          </h2>
        </div>
  
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-xl shadow-lg" >
          <form className="space-y-5" onSubmit={onChangePassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="flex">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="block w-full rounded-lg px-4 py-3 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailValidated}
                />
                <button
                  type="button"
                  className="ml-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-300"
                  style={{ backgroundColor: "#A32CC4" }}
                  onClick={onValidateEmail}
                  disabled={emailValidated}
                >
                  Validate
                </button>
              </div>
            </div>
  
            {emailValidated && (
              <>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <div>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      required
                      placeholder="Enter OTP sent to your email"
                      className="block w-full rounded-lg px-4 py-3 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="mt-1 text-right">
                    <button 
                      type="button" 
                      onClick={onResendOtp} 
                      className="text-sm font-medium focus:outline-none hover:underline transition-all"
                      style={{ color: "#A32CC4" }}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
  
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      autoComplete="new-password"
                      required
                      placeholder="Enter new password"
                      className={`block w-full rounded-lg px-4 py-3 text-gray-900 border ${passwordError.length ? 'border-red-300' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      style={{ focusRing: passwordError.length ? "red" : "#A32CC4" }}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  {passwordError.length > 0 && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      <p className="font-medium mb-1">Password must contain:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {passwordError.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {newPassword && passwordError.length === 0 && (
                    <p className="mt-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      Password meets all requirements ✓
                    </p>
                  )}
                </div>
  
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="new-password"
                      required
                      placeholder="Confirm your new password"
                      className={`block w-full rounded-lg px-4 py-3 text-gray-900 border ${matchError ? 'border-red-300' : 'border-gray-300'} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      style={{ focusRing: matchError ? "red" : "#A32CC4" }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {matchError && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      {matchError}
                    </p>
                  )}
                  {confirmPassword && !matchError && (
                    <p className="mt-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                      Passwords match ✓
                    </p>
                  )}
                </div>
              </>
            )}
  
            <div className="pt-4">
              <button
                type="submit"
                disabled={!emailValidated || passwordError.length > 0 || matchError || !otp || !newPassword || !confirmPassword}
                className={`flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ${!emailValidated || passwordError.length > 0 || matchError || !otp || !newPassword || !confirmPassword ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'}`}
                style={{ backgroundColor: (!emailValidated || passwordError.length > 0 || matchError || !otp || !newPassword || !confirmPassword) ? undefined : "#A32CC4" }}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;