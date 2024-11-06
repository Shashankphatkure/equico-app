import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Parser } from "json2csv";

export async function GET(req) {
  try {
    const userId = req.user.id;
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    // Get analytics data
    const data = await fetchAnalyticsData(userId, period);

    // Convert to CSV
    const fields = ["date", "views", "sales", "revenue", "savedCount"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    // Set headers for file download
    const headers = new Headers();
    headers.append("Content-Type", "text/csv");
    headers.append("Content-Disposition", "attachment; filename=analytics.csv");

    return new NextResponse(csv, { headers });
  } catch (error) {
    console.error("Error exporting analytics:", error);
    return NextResponse.json(
      { error: "Error exporting analytics" },
      { status: 500 }
    );
  }
}
