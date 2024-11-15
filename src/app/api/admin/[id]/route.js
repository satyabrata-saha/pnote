import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";

export async function DELETE(request, { params }) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // const decoded = verify(token, process.env.JWT_SECRET);

    // if (!decoded.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const { id } = await params;
    // console.log("user id: " + id);

    if (!id) {
      return NextResponse.json({ error: "User id not found" }, { status: 404 });
    }

    await query("DELETE FROM users WHERE id = $1", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error:
          "Failed to delete user it possibly has some notes attached to it please told the user to delete them first",
      },
      { status: 500 }
    );
  }
}
