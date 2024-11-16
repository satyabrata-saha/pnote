import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request) {
  try {
    const { rows: settings } = await query(
      "SELECT registration_enabled FROM app_settings LIMIT 1"
    );
    return NextResponse.json({
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
