/**
 * Get the image URL from either a GridFS file ID or a regular URL
 * @param image - GridFS file ID or URL string
 * @returns The full URL to the image
 */
export function getImageUrl(image: string): string {
  // If it's already a full URL or starts with /, return as is
  if (image.startsWith('http') || image.startsWith('/')) {
    return image;
  }
  // Otherwise, treat it as a GridFS file ID
  return `/api/images/${image}`;
}



