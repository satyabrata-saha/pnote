import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";

export async function DELETE(request, { params }) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    const { id } = await params;

    // check if the note belongs to the user
    const { rows } = await query(
      "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
      [id, decoded.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Note not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    // If the note belongs to the user, delete it
    await query("DELETE FROM notes WHERE id = $1", [id]);

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
