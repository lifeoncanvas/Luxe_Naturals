const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'public', 'logo-light-mark.png');
const imgBuf = fs.readFileSync(imgPath);
const base64Img = imgBuf.toString('base64');

// Create dark green SVG with rounded corners and light logo mark
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="24" fill="#2D3A29"/>
  <image href="data:image/png;base64,${base64Img}" x="16" y="16" width="96" height="96"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, 'public', 'favicon-green.svg'), svgContent);

console.log("Dark green SVG favicons created successfully!");
