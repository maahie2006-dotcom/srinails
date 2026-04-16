import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📥 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 Make admin
  const makeAdmin = async (id) => {
    if (!window.confirm("Make this user admin?")) return;

    setLoading(true);
    try {
      await axios.put(`/api/users/${id}/make-admin`);
      alert("User is now Admin ✅");
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete user (optional)
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`/api/users/${id}`);
      alert("User deleted ❌");
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Users Management 👥</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <span
                      style={{
                        color: user.role === "admin" ? "green" : "gray",
                        fontWeight: "bold",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.role !== "admin" && (
                      <button
                        className="btn-admin"
                        onClick={() => makeAdmin(user._id)}
                        disabled={loading}
                      >
                        Make Admin
                      </button>
                    )}

                    <button
                      className="btn-delete"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;