
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // remove the "data:mime/type;base64," prefix
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getImageUrl = (imageSrc: string): string => {
  if (imageSrc.startsWith('data:image') || imageSrc.startsWith('http')) {
    return imageSrc;
  }
  // Assume it's a raw base64 string and default to jpeg.
  return `data:image/jpeg;base64,${imageSrc}`;
};
