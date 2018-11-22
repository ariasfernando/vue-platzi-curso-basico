export default {
  methods: {
    createPlaceholder(width, height, bColor) {
      const cHeight = height === 'auto' ? (width / 16) * 9 : height;
      const cColor = bColor === '#ffffff' ? '#514960' : bColor;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = cHeight;
      const context = canvas.getContext('2d');
      this.createRectangle(context, cColor, width, cHeight);
      this.createLines(context, width, cHeight);
      this.createText(context, canvas, width, cHeight);
      return canvas.toDataURL();
    },
    createRectangle(context, cColor, width, cHeight) {
      context.fillStyle = cColor;
      context.fillRect(0, 0, width, cHeight);
    },
    createText(context, canvas, width, cHeight) {
      const fontBase = 640;
      const fontSizeBase = 48;
      context.font = `${(canvas.width * (fontSizeBase / fontBase))}px "Open Sans", Arial, sans-serif`;
      context.textAlign = 'center';
      context.fillStyle = 'white';
      const fontX = canvas.width / 2;
      const fontY = canvas.height / 2;
      const textW = Math.round(width);
      const textH = Math.round(cHeight);
      context.fillText(`${textW}x${textH}`, fontX, fontY);
    },
    createLines(context, width, height) {
      context.beginPath();
      context.strokeStyle = 'grey';
      context.moveTo(0, 0);
      context.lineTo(width, height);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.strokeStyle = 'grey';
      context.moveTo(0, height);
      context.lineTo(width, 0);
      context.closePath();
      context.stroke();
    },
  },
};
