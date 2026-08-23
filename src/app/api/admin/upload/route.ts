export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { uploadToGoogleDrive } from '@/lib/googleDrive';

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided in upload request.' }, { status: 400 });
    }

    // Validate mime type (images or pdf)
    const allowedMimePrefixes = ['image/', 'application/pdf'];
    const isAllowed = allowedMimePrefixes.some((prefix) => file.type.startsWith(prefix));
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images (PNG, JPG, WEBP, SVG, GIF) and PDF are allowed.' },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 15MB limit.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadToGoogleDrive({
      buffer,
      fileName: file.name,
      mimeType: file.type || 'image/jpeg',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'File successfully uploaded to Google Drive!',
        data: {
          url: uploadResult.directUrl,
          fileId: uploadResult.fileId,
          name: uploadResult.name,
          mimeType: uploadResult.mimeType,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Google Drive Upload Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file to Google Drive.' },
      { status: 500 }
    );
  }
}
