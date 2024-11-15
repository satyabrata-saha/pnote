"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Users from "@/components/Users";

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

  const handleDelete = async (id) => {
    setError("");
    // console.log(id);
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setError("User deleted successfully");
        fetchAdminData();
      } else {
        setError(
          "Failed to delete user it possibly has some notes attached to it please told the user to delete them first"
        );
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while deleting the user");
    }
  };

  console.log(users);

  return (
    <div className="container">
      <div className="my-4">
        {error && <p className="error">{error}</p>}
        <h1 className="">Admin Dashboard</h1>
        <div className="">
          <div>
            <h2 className="">Users</h2>
            <Suspense fallback={<p className="suspense">Loading...</p>}>
              <Users users={users} handleDelete={handleDelete} />
            </Suspense>
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
