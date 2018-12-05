function drawRectangle(context, color, width, height) {
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
}

function drawText(context, width, height, font, fontColor) {
  const fontBase = 640;
  const fontSizeBase = 48;
  const fontSize = (width * (fontSizeBase / fontBase));
  context.font = `${fontSize}px ${font}`;
  context.textAlign = 'center';
  context.fillStyle = fontColor;
  const fontX = width / 2;
  const fontY = (height / 2) + (fontSize * 0.25);
  const textW = Math.round(width);
  const textH = Math.round(height);
  context.fillText(`${textW}x${textH}`, fontX, fontY);
}

function drawLines(context, width, height, lineColor) {
  context.beginPath();
  context.strokeStyle = lineColor;
  context.moveTo(0, 0);
  context.lineTo(width, height);
  context.moveTo(0, height);
  context.lineTo(width, 0);
  context.closePath();
  context.stroke();
}
export default {
  methods: {
    createPlaceholder(width, height, color = '#514960', font = '"Open Sans", Arial, sans-serif',
      fontColor = 'white', lineColor = 'grey') {
      const cHeight = height === 'auto' ? (width / 16) * 9 : height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = cHeight;
      const context = canvas.getContext('2d');
      drawRectangle(context, color, width, cHeight);
      drawLines(context, width, cHeight, lineColor);
      drawText(context, width, cHeight, font, fontColor);
      return canvas.toDataURL();
    },

  },
};
