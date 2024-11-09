"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");
  const [clikeinnote, setClikeinnote] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
    fetchAdminData();
    setClikeinnote(false);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to fetch notes");
      }
    } catch (error) {
      setError("An error occurred while fetching notes");
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        console.log(users);
      } else {
        setError("Failed to fetch admin data");
      }
    } catch (error) {
      setError("An error occurred while fetching admin data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        setNewNote("");
        fetchNotes();
      } else {
        setError("Failed to create note");
      }
    } catch (error) {
      setError("An error occurred while creating the note");
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

  const handleclikeinnote = () => {
    setClikeinnote(!clikeinnote);
  };

  return (
    <div className="container">
      <div className="">
        <div className="">
          <ul className="">
            {notes.map((note) => (
              <li key={note.id} className="">
                {note.content}
              </li>
            ))}
          </ul>

          <button onClick={handleLogout} className="">
            Logout
          </button>
        </div>
      </div>

      <div className=" fixed-bottom m-5 rounded">
        {clikeinnote ? (
          <>
            <form
              onSubmit={handleSubmit}
              className=" container mb-5 d-flex flex-column bg-emphasis"
            >
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="New Note"
                className="p-2 rounded mb-1"
              />
              <button type="submit" className="">
                Add Note
              </button>
            </form>
          </>
        ) : (
          console.log("hello")
        )}
      </div>

      <nav className="navbar fixed-bottom mx-5 mb-1">
        <div className="container justify-content-center">
          <div className="d-flex justify-content-evenly p-2 bg-body-tertiary rounded fixedWidth">
            <div
              onClick={handleclikeinnote}
              className="text-dark text-center"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-plus-square"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              <p className="m-0">Note</p>
            </div>
            <div className="text-dark text-center" href="#">
              <Link href="/admin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                </svg>
              </Link>
              <p className="m-0">Admin</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
