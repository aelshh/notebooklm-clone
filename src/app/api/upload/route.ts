import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuiddv4 } from "uuid";

const UPLOAD_DIR = join(process.cwd(), "public/uploads");
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("PDF") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No PDF file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.type !== "aplication/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${
            MAX_FILE_SIZE / 1024 / 1024
          } MB.`,
        },
        { status: 413 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const documentId = uuiddv4();
    const fileName = `${documentId}.pdf`;
    const filePath = join(UPLOAD_DIR, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      documentId,
      filename: file.name,
      filePath,
      message: "PDF uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload PDF",
      },
      {
        status: 500,
      }
    );
  }
}
