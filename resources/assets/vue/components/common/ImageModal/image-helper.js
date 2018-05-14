function checkFile(file) {
  const fileTypes = ['image/jpeg', 'image/gif', 'image/png'];
  const loadImage = new Promise((resolve, reject) => {
    const photo = file.files[0];
    if (typeof photo === 'undefined' || photo === null) {
      file.setCustomValidity('There was an error reading your file');
      return reject('There was an error reading your file');
    }
    if (fileTypes.indexOf(photo.type) === -1) {
      file.setCustomValidity('Not an accepted file type');
      return reject('Not an accepted file type');
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
      return reject('There was an error reading your file');
    };
    img.src = imgObj;
  });

  return loadImage;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject('Couldn\'t load resource');
    };
    xhr.send();
  });
}

function getBase64Img(image) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    }, false);
    if (typeof image !== 'object' && image.includes('http')) {
      loadImage(image)
        .then((img) => {
          reader.readAsDataURL(img);
        })
        .catch((e) => {
          reject(e);
        });
    } else {
      reader.readAsDataURL(image);
    }
  });
}

function checkGIFSize(image, size) {
  return new Promise((resolve, reject) => {
    if (!image.includes('data:image/gif;base64')) {
      return resolve();
    }
    const tmpImg = new Image();
    let hasErr = false;
    let msg = 'Image size should be ';
    tmpImg.onload = () => {
      const width = tmpImg.naturalWidth;
      const height = tmpImg.naturalHeight;
      if (width !== size.width) {
        hasErr = true;
        msg = msg.concat(`${size.width}px in width`);
      }
      if (!size.auto && height !== size.height) {
        if (hasErr) {
          msg = msg.concat(' and ');
        }
        hasErr = true;
        msg = msg.concat(`${size.height}px in height`);
      }

      if (hasErr) {
        return reject(msg);
      }
      return resolve();
    };
    tmpImg.src = image;
  });
}

function adjustSize(resize, image, size) {
  return new Promise((resolve, reject) => {
    if (!resize) {
      resolve();
    }
    const tmpImg = new Image();
    const newSize = size;
    tmpImg.onload = () => {
      const width = tmpImg.naturalWidth;
      const height = tmpImg.naturalHeight;
      if (height < size.height) {
        newSize.height = height;
      }
      if (width < size.width) {
        newSize.width = width;
      }
      return resolve(newSize);
    };

    tmpImg.onerror = () => reject();

    tmpImg.src = image;
  });  
}

export default {
  getBase64Img,
  checkFile,
  checkGIFSize,
  adjustSize,
};
