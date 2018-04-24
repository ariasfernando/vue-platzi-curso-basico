function checkFile(file) {
  const fileTypes = ['image/jpeg', 'image/gif', 'image/png'];
  const loadImage = new Promise((resolve, reject) => {
    const photo = file.files[0];
    if (typeof photo === 'undefined' || photo === null) {
      file.setCustomValidity('There was an error reading your file');
      return reject();
    }
    if (fileTypes.indexOf(photo.type) === -1) {
      file.setCustomValidity('Not an accepted file type');
      return reject();
    }

    const img = new Image();
    const imgObj = URL.createObjectURL(photo);
    img.onload = () => {
      file.setCustomValidity('');
      URL.revokeObjectURL(imgObj);
      return resolve(photo);
    };
    img.onerror = () => {
      file.setCustomValidity('There was an error reading your file');
      URL.revokeObjectURL(imgObj);
      return reject();
    };
    img.src = imgObj;
  });

  return loadImage;
}

function getBase64ImgFromURL(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      return resolve(canvas.toDataURL());
    };
    img.src = url;
  });
}

function getBase64ImgFromFile(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      return resolve(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(file);
  });
}

export default {
  getBase64ImgFromFile,
  getBase64ImgFromURL,
  checkFile,
};
