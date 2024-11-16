"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const res = await fetch("/api/admin/appsettings");
        if (res.ok) {
          const data = await res.json();
          // console.log(data.registrationEnabled);
          setRegistrationEnabled(data.registrationEnabled);

          if (!data.registrationEnabled) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    checkRegistrationStatus();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center hightfull">
      {registrationEnabled ? (
        <div className="d-flex flex-column fixedWidth text-center gap-4">
          <div className="logo">
            <Image src="/logo.png" width="50" height="50" alt="PNote Logo" />
          </div>
          <h2 className="">Create an account</h2>

          <form
            className="form-group d-flex flex-column"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="remember" value="true" />

            <input
              id="username"
              name="username"
              type="text"
              required
              className="form-control mb-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg">
              Register
            </button>
          </form>
          <div className="">
            <Link href="/login" className="">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
