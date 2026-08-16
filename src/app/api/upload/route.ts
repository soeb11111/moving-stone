import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireSession } from '@/lib/portfolio/session';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'Storage is not connected yet. Ask your developer to finish setup.' },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await requireSession())) {
          throw new Error('Not signed in.');
        }
        return {
          allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do — the editor records the returned address itself.
      },
    });
    return Response.json(result);
  } catch {
    return Response.json(
      { error: 'That upload did not go through. Try again.' },
      { status: 400 },
    );
  }
}
