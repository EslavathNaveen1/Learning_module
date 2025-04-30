import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState(null);
  const [mail, setMail] = useState(null);
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
     
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userMail = localStorage.getItem("mail");
    const userFname = localStorage.getItem("fname");
    const userLname = localStorage.getItem("lname");

    if (token && userRole && userMail && userFname && userLname) {
      setIsLogged(true);
      setRole(userRole);
      setMail(userMail);
      setFname(userFname);
      setLname(userLname);

    }
    setLoading(false);
  }, []);

  const login = (token, userRole, userMail, userFname, userLname) => {
    setIsLogged(true);
    setRole(userRole);
    setMail(userMail);
    setFname(userFname);
    setLname(userLname);

    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("mail", userMail);
    localStorage.setItem("fname", userFname);
    localStorage.setItem("lname", userLname);
  };

  const logout = () => {
    setIsLogged(false);
    setRole(null);
    setMail(null);
    setFname(null);
    setLname(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("mail");
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLogged, role, mail, fname, lname, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
