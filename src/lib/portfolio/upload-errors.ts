export function uploadErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('not signed in') || message.includes('401') || message.includes('unauthorized')) {
    return 'Your session has ended. Please sign in again.';
  }
  if (
    message.includes('413') ||
    message.includes('too large') ||
    message.includes('maximum') ||
    message.includes('size')
  ) {
    return 'That file is too big to upload.';
  }
  if (
    message.includes('content type') ||
    message.includes('content-type') ||
    message.includes('415') ||
    message.includes('not allowed')
  ) {
    return 'That kind of file is not supported. Try a photo or a video.';
  }
  if (message.includes('storage is not connected') || message.includes('503')) {
    return 'Storage is not set up yet. Ask your developer to finish setup.';
  }
  return 'That upload did not go through. Check your connection and try again.';
}
