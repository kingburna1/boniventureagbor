import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://hpjsdzugcoyyzwbiaitl.supabase.co';
const BUCKET_NAME = 'portfolio-media';

function getSupabaseClient() {
  let supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  // Normalize: Strip trailing slashes and /rest/v1 suffix if accidentally added
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error(
      'Missing Supabase Key. Please add SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export interface UploadResult {
  fileId: string;
  directUrl: string;
  name: string;
  mimeType: string;
  size?: number;
}

/**
 * Ensures the target public bucket exists in Supabase Storage.
 */
async function ensureBucketExists(supabase: ReturnType<typeof getSupabaseClient>) {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) return;

    const exists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024, // 15MB
      });
    }
  } catch (err) {
    // If bucket creation fails due to permissions, continue in case bucket already exists
    console.warn('Note: Bucket check/create encountered notice:', err);
  }
}

/**
 * Uploads a file buffer directly to Supabase Storage and returns its permanent public CDN URL.
 */
export async function uploadToSupabaseStorage(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}): Promise<UploadResult> {
  const supabase = getSupabaseClient();

  // Ensure public bucket exists
  await ensureBucketExists(supabase);

  // Generate clean, collision-free filename
  const cleanOriginalName = params.fileName.replace(/[^\w.-]/g, '_');
  const filePath = `${Date.now()}-${cleanOriginalName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, params.buffer, {
      contentType: params.mimeType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
  }

  // Get public CDN URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  const directUrl = publicUrlData.publicUrl;

  return {
    fileId: filePath,
    directUrl,
    name: params.fileName,
    mimeType: params.mimeType,
    size: params.buffer.length,
  };
}

/**
 * Deletes a file from Supabase Storage by its file path.
 */
export async function deleteFromSupabaseStorage(filePath: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      console.error('❌ Failed to delete file from Supabase Storage:', error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error during Supabase Storage deletion:', error);
    return false;
  }
}
