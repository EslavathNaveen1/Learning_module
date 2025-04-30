
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import AuthContext from "../AuthContext";
import { useContext, useState } from "react";

const Login = () => {
  const [mail, setMail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login,isLogged} = useContext(AuthContext);

  const handleEmail = (e) => {
    setMail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangePassword = () => {
    navigate("/ChangePassword");
    console.log("Hello");
  };

  const onRegister = () => {
    navigate("/Register");
  };

  const onSubmitSuccess = async (e) => {
    e.preventDefault();
    const loginObject = {
      email: mail,
      fname: fname,
      lname: lname,
      password: password
    };
    

    try {
      const response = await axios.post('http://localhost:5104/api/Qtech/login', loginObject);
      

      if (response.data.token) {

        setFname(response.data.fname);
        setLname(response.data.lname);
        
        login(response.data.token, response.data.role, mail, response.data.fname, response.data.lname);
        
      
        console.log(response.data.fname);
      
        if (response.data.role === "Admin" || isLogged) {
          navigate("/Admin/Actions");
        } else if (response.data.role === "Manager" || isLogged) {
          navigate("/Manager/Actions");
        } else {
          navigate("/UserDashBoard" || isLogged);
        }
      }

    } catch (error) {
      console.error('Error during login:', error);
      alert("Invalid Email or Password");
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }

    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mt-4">Log In to QTech</h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <form className="space-y-6" action="#" method="POST" onSubmit={onSubmitSuccess}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  placeholder="Enter Your Email"
                  onChange={handleEmail}
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                />
              </div>
            </div>
  
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  onChange={handlePassword}
                  placeholder="Enter Your Password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                />
              </div>
              <div className="text-sm mt-2 text-right">
                <a 
                  href="#" 
                  className="text-sm font-medium focus:outline-none transition-all"
                  style={{ color: "#A32CC4" }} 
                  onClick={onChangePassword}
                >
                  Forgot password?
                </a>
              </div>
            </div>
  
            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-300"
                style={{ backgroundColor: "#A32CC4" }}
              >
                Log In
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a 
              href="#" 
              className="text-sm font-medium focus:outline-none transition-all"
              style={{ color: "#A32CC4" }} 
              onClick={onRegister}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;