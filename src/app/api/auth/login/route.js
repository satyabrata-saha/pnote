import { NextResponse } from "next/server";
import { query, comparePassword } from "@/lib/db";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request) {
  const { username, password } = await request.json();

  try {
    const { rows } = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = rows[0];

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: user.id, username: user.username, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return NextResponse.json(
      { message: "Login successful", isAdmin: user.is_admin },
      { headers: { "Set-Cookie": serialized } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
