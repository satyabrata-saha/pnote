import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // ('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [decoded.userId])
    // INNER JOIN users ON notes.user_id = users.id
    const { rows } = await query(
      "select notes.id, notes.user_id, notes.content, notes.created_at, username from notes left join users on notes.user_id = users.id order by notes.created_at desc;"
    );
    // console.log(rows);

    const { userId, isAdmin, username } = decoded;

    return NextResponse.json({ rows, userId, username, isAdmin });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const { content } = await request.json();
    const { rows } = await query(
      "INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING *",
      [decoded.userId, content]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
