"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

// Base path for uploads on the server - using absolute path for Hostinger
const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/Images";
// Base URL for uploaded files - using the domain URL structure
const BASE_URL = process.env.BASE_URL || "https://thang-truong.com/Images";

/**
 * Test function to manually upload a file to the server
 * This can be used to diagnose upload issues
 */
export async function testFileUpload(): Promise<{
  success: boolean;
  message: string;
  filePath: string | null;
  url: string | null;
  error?: any;
}> {
  try {
    // Create a test file content
    const testContent = `This is a test file created at ${new Date().toISOString()}`;
    const fileName = `test-${uuidv4()}.txt`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Ensure the upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      console.log(`Creating directory: ${UPLOAD_DIR}`);
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Write the test file
    console.log(`Writing test file to: ${filePath}`);
    await writeFile(filePath, testContent);

    // Generate the URL
    const url = `${BASE_URL}/${fileName}`;
    console.log(`Test file accessible at: ${url}`);

    return {
      success: true,
      message: "Test file uploaded successfully",
      filePath,
      url,
    };
  } catch (error) {
    console.error("Error in test file upload:", error);

    let errorMessage = "Failed to upload test file";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "Permission denied. Please check server permissions.";
      } else if (error.message.includes("disk")) {
        errorMessage = "Disk space error. Please check server storage.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      filePath: null,
      url: null,
      error,
    };
  }
}
