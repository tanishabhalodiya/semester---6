import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-soft">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <button
        className="mt-6 bg-accent text-white w-full py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
