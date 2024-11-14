"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setRegistrationEnabled(data.registrationEnabled);
      } else if (res.status === 401 || res.status === 403) {
        router.push("/login");
      } else {
        setError("Failed to fetch admin data");
      }
    } catch (error) {
      setError("An error occurred while fetching admin data");
    }
  };

  const handleToggleRegistration = async () => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationEnabled: !registrationEnabled }),
      });

      if (res.ok) {
        setRegistrationEnabled(!registrationEnabled);
        setError(
          `Registration ${!registrationEnabled ? "enabled" : "disabled"}. ${
            !registrationEnabled
              ? "Users can now register."
              : "New users will be redirected to the home page."
          }`
        );
      } else {
        setError("Failed to update registration settings");
      }
    } catch (error) {
      setError("An error occurred while updating registration settings");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      setError("Failed to logout");
    }
  };

  const handleDeleteUser = async (userId) => {
    // console.log(userId);

    // try {
    const res = await fetch(`/api/admin`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    // const res = await fetch(`/api/admin?id=${userId}`, { method: "DELETE" });
    //   if (res.ok) {
    //     setUsers(users.filter((user) => user.id !== userId));
    //     setError("User deleted successfully");
    //   } else {
    //     setError("Failed to delete user");
    //   }
    // } catch (error) {
    //   setError("An error occurred while deleting the user");
    // }
  };

  return (
    <div className="container">
      <div className="my-4">
        <h1 className="">Admin Dashboard</h1>
        <div className="">
          <div>
            <h2 className="">Users</h2>
            <ul className="m-0 list-unstyled">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 my-2 rounded"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  {user.username} {user.is_admin && "(Admin)"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-trash float-end pointer"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="">Registration Settings</h2>
            <div className="">
              <button
                onClick={handleToggleRegistration}
                className={`px-4 py-2 rounded ${
                  registrationEnabled
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {registrationEnabled
                  ? "Disable Registration"
                  : "Enable Registration"}
              </button>
            </div>
          </div>
          {error && <p className="">{error}</p>}
        </div>
      </div>
      <div className="">
        <button onClick={handleLogout} className="">
          Logout
        </button>
      </div>
    </div>
  );
}
