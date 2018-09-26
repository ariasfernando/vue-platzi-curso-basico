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
    if (typeof image !== 'object' && RegExp('^https?://').test(image)) {
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

function checkSize(image, size, dontAllowSmaller) {
  return new Promise((resolve, reject) => {
    const strict = image.includes('data:image/gif;base64');
    if (!dontAllowSmaller && !strict) {
      return resolve();
    }
    const tmpImg = new Image();
    let hasErr = false;
    let msg = 'Image size must be ';
    tmpImg.onload = () => {
      const width = tmpImg.naturalWidth;
      const height = tmpImg.naturalHeight;
      if ((strict && width !== size.width) || (!strict && width < size.width)) {
        hasErr = true;
        msg = msg.concat(`${strict ? '' : 'at least'} ${size.width}px wide`);
      }
      if ((strict && !size.auto && height !== size.height) || (!strict && !size.auto && height < size.height)) {
        if (hasErr) {
          msg = msg.concat(' and ');
        }
        hasErr = true;
        msg = msg.concat(`${strict ? '' : 'at least'} ${size.height}px high`);
      }

      if (hasErr) {
        return reject(msg);
      }
      return resolve();
    };
    tmpImg.src = image;
  });
}

export default {
  getBase64Img,
  checkFile,
  checkSize,
};
