import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      console.log(res.data)

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      

      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-blue-900">

      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-96">

        <h1 className="text-2xl font-bold text-white text-center">
          Task Flow Manager
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Manage tasks efficiently
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>

        <div className="mt-6 p-4 bg-gray-700 rounded text-sm text-gray-200">

  <p className="font-semibold mb-2 text-center">Demo Access</p>

  <p><b>Super Admin:</b></p>
  <p>Email: superadmin1@test.com</p>
  <p>Password: 123456</p>

  <br />

  <p><b>Admin:</b></p>
  <p>Email: admin@test.com</p>
  <p>Password: 123456</p>

  <br />

  <p><b>User:</b></p>
  <p>Email: user@test.com</p>
  <p>Password: 123456</p>

</div>

      </div>

    </div>
    
  );
}

export default Login;