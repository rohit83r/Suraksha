import React, {useEffect, useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const LoginForm = () => {
  const [formData, setFormData] = useState({
    role: "user",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error, success, role } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // dispatch(login(formData));
    
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-4 pb-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-cyan-400">Suraksha SignIn</h2>
        <p className="text-center text-gray-400 text-sm">
          Secure access for <span className="text-cyan-300">User</span>, <span className="text-cyan-300">Admin</span>, or <span className="text-cyan-300">Authority</span>
        </p>

        <SelectField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={["user", "admin", "authority"]}
        />

        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
        <button
          type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                     text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
        <span className="text-center text-gray-400 text-sm">New to Suraksha </span>
        <Link to="/register"><span className="text-cyan-300">SignUp</span></Link>
      </div>
      </form>
    </div>
    
    </>


  );
};

export default LoginForm;
