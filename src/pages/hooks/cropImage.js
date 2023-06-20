export default async function getCroppedImg(imageSrc, cropArea) {
  if (typeof window === 'undefined') {
    return null;
  }

  const image = new Image();
  image.src = imageSrc;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return canvas.toDataURL('image/jpeg');
}
