const fs = require('fs');
const http = require('http');
const path = require('path');

const sonarConfigFilePath = path.join(process.cwd(), 'sonar-project.properties');
const contentSonarConfigFile = fs.readFileSync(sonarConfigFilePath, 'utf-8');
// Tách từng dòng, loại bỏ dòng comment và dòng trống
const lines = contentSonarConfigFile.split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'));

// Phân tích thành object key-value
const result = {};
lines.forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    result[key.trim()] = rest.join('=').trim();
  }
});

const projectKey = result['sonar.projectKey'];
const token = result['sonar.token'];

if (!projectKey || !token) {
  throw new Error('Missing sonar.projectKey or sonar.token in sonar-project.properties');
}
const imageUrl = 'http://192.168.1.9:3900/api/sonar-report'; // Đổi thành URL ảnh bạn muốn lấy
const imageFileName = 'sonar-qube-report.png';
const imageFilePath = path.join(__dirname, 'readme-media/report', imageFileName);

function fetchImageBuffer(url, postData) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, port } = new URL(url);

    const options = {
      hostname,
      port: port || 80,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => reject(errorData));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function saveBufferToFile(buffer, dest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, buffer, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Sử dụng
async function addImageToReadme() {
  try {
    const postData = JSON.stringify({ projectKey, token });
    const buffer = await fetchImageBuffer(imageUrl, postData);
    await saveBufferToFile(buffer, imageFilePath);
    console.log('Image saved!');
  } catch (error) {
    console.log('Error:', error);
  }
}

addImageToReadme();