import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <div className="bg-gray-900 text-white p-4 flex justify-between">

      <h1 className="text-lg font-semibold">
        Task Flow Manager
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>

    </div>

  );
}

export default Navbar;