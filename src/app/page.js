"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");
  const [clikeinnote, setClikeinnote] = useState(false);
  const [userData, setuserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
    setClikeinnote(false);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.rows);
        setuserData({
          isAdmin: data.isAdmin,
          username: data.username,
          userId: data.userId,
        });
        // console.log(data);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to fetch notes");
      }
    } catch (error) {
      setError("An error occurred while fetching notes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setClikeinnote(false);

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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchNotes();
      } else {
        setError("Failed to delete note");
      }
    } catch (error) {
      setError("An error occurred while deleting the note");
    }
  };
  // console.log(notes);

  return (
    <div className="container">
      <h2 className="text-center my-3 fs-5 textcolor">
        User: {userData.username}
      </h2>
      <Suspense fallback="Loading...">
        <div className="m-0">
          <ul className="m-0 list-unstyled">
            {notes.map((note) => (
              <div
                key={note.id}
                className="px-3 py-2 my-2 rounded li d-flex flex-column"
              >
                <li className="p-0">{note.content}</li>
                <div className="p-0 m-0 mt-2 text-secondary fontsize d-flex justify-content-between">
                  <div className="d-flex">
                    <p className="pe-2 m-0">@{note.username}</p>
                    <p className="pe-2 m-0">
                      {note.created_at?.substring(0, 10)}
                    </p>
                    <p className="pe-2 m-0">
                      {note.created_at?.substring(11, 19)}
                    </p>
                  </div>
                  <svg
                    onClick={() => handleDelete(note.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash pointer"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </div>
              </div>
            ))}
          </ul>
          <div className="marginy"></div>
        </div>
      </Suspense>

      <div className="fixed-bottom m-5 rounded z-index">
        {clikeinnote ? (
          <>
            <form
              onSubmit={handleSubmit}
              className=" container mb-5 d-flex flex-column bg-emphasis"
            >
              <textarea
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="New Note"
                className="p-2 rounded mb-3"
                rows="10"
              />
              <button type="submit">Add Note</button>
            </form>
          </>
        ) : // console.log("click to + add note")
        null}
      </div>

      <nav className="navbar fixed-bottom z-index">
        <div className="container mb-2 justify-content-center">
          <div className="d-flex justify-content-evenly p-2 bg-secondary textcolor rounded fixedWidth">
            <div onClick={handleclikeinnote} className=" text-center pointer">
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
            {userData.isAdmin ? (
              <div className=" text-center pointer">
                <Link href="/admin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-gear-fill textcolor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                  </svg>
                </Link>
                <p className="m-0">Admin</p>
              </div>
            ) : (
              <></>
            )}

            <div className=" text-center pointer">
              <div onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                  <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                </svg>
              </div>
              <p className="m-0">Logout</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
