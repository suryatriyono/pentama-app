import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Directory for saved upload files
const UPLOAD_DIR = path.join(process.cwd(), "public", "assets", "uploads");
const AVATAR_DIR = path.join(UPLOAD_DIR, "avatars");

// Make sure the upload directory already exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

/**
 * Saved file to local directory
 * @param file Filr buffer to be daved
 * @param filename filename
 * @returns Relative path of the saved file
 */
export const saveFile = async (fileBuffer: Buffer, originalFilename: string): Promise<string> => {
  // Generate unique filename
  const fileExtension = path.extname(originalFilename);
  const filename = `${uuidv4()}${fileExtension}`;


  // Path directory for user
  const userDir = path.join(AVATAR_DIR);

  // Full flie path
  const filePath = path.join(userDir, filename);

  // Write file to disk
  fs.writeFileSync(filePath, fileBuffer);

  // Return relative path
  console.log(path.relative(UPLOAD_DIR, filePath))
  return `/assets/uploads/avatars/${filename}`;
}

/**
 * Deleted file from local directory
 * @param filePath Relative path from the file to be deleted
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    // Convert relative path to absolute path
    const absolutePath = path.join(process.cwd(), "public", filePath);

    // Check if file exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    throw new Error(`Error deleting file: ${error instanceof Error ? error.message : "Failed to delete file"}`);
  }
}

/**
 * Ekstrak file path from URL
 * @param url URL file
 * @returns Reative path from file
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    // From local URL, we just need the path
    // e.g. /uploads/avatars/image.png
    if (url.startsWith('/assets/')) {
      return url;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse URL:", error);
    return null;
  }
}