import { google } from 'googleapis';
import { Readable } from 'stream';

function getGoogleDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive credentials are missing in environment variables.');
  }

  // Ensure escaped newlines in private key are properly formatted
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

export interface UploadResult {
  fileId: string;
  directUrl: string;
  name: string;
  mimeType: string;
  size?: number;
}

/**
 * Uploads a file buffer to the configured Google Drive folder and makes it publicly viewable.
 */
export async function uploadToGoogleDrive(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}): Promise<UploadResult> {
  const drive = getGoogleDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const stream = Readable.from(params.buffer);

  // 1. Upload file into Google Drive Folder
  const fileMetadata: any = {
    name: `${Date.now()}-${params.fileName.replace(/[^\w.-]/g, '_')}`,
  };

  if (folderId) {
    fileMetadata.parents = [folderId];
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: params.mimeType,
      body: stream,
    },
    fields: 'id, name, mimeType, size, webViewLink, webContentLink',
  });

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error('Failed to retrieve file ID from Google Drive response.');
  }

  // 2. Make the file public so anyone can view the image
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (permError) {
    console.warn('⚠️ Warning: Failed to set public permission on Drive file:', permError);
  }

  // 3. High-speed Google CDN direct link
  // https://lh3.googleusercontent.com/d/{fileId} is Google's fast CDN direct content delivery endpoint
  const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

  return {
    fileId,
    directUrl,
    name: response.data.name || params.fileName,
    mimeType: response.data.mimeType || params.mimeType,
    size: response.data.size ? Number(response.data.size) : undefined,
  };
}

/**
 * Deletes a file from Google Drive by file ID.
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<boolean> {
  try {
    const drive = getGoogleDriveClient();
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('❌ Failed to delete file from Google Drive:', error);
    return false;
  }
}
