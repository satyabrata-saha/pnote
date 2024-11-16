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
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { rows: users } = await query(
      "SELECT id, username, is_admin FROM users"
    );
    const { rows: settings } = await query(
      "SELECT registration_enabled FROM app_settings LIMIT 1"
    );
    return NextResponse.json({
      users,
      registrationEnabled: settings[0].registration_enabled,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
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
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { registrationEnabled } = await request.json();
    await query("UPDATE app_settings SET registration_enabled = $1", [
      registrationEnabled,
    ]);
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
