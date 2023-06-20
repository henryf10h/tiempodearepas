// Function to create a new image from the crop area of the original image
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
   
     return new Promise((resolve) => {
       canvas.toBlob((file) => {
         resolve(file);
       }, 'image/jpeg');
     });
   }
   