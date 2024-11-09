import { NextResponse } from "next/server";
import { query, hashPassword } from "@/lib/db";

export async function POST(request) {
  try {
    const { rows } = await query(
      "SELECT registration_enabled FROM app_settings LIMIT 1"
    );
    if (!rows[0].registration_enabled) {
      return NextResponse.json(
        { error: "Registration is currently disabled" },
        { status: 403 }
      );
    }

    const { username, password } = await request.json();
    const hashedPassword = await hashPassword(password);
    await query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
