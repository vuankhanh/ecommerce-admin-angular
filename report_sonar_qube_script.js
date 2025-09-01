import * as fs from 'fs';
import * as http from 'http';
import { fileURLToPath } from 'url';
import * as path from 'path';

// Thêm đoạn này ở đầu file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const imageUrl = 'http://localhost:3900/api/sonar-report'; // Đổi thành URL ảnh bạn muốn lấy
const imageFileName = 'sonar_qube_report.png';
const imageFilePath = path.join(__dirname, 'report',imageFileName);

// Tải ảnh về
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    // Phân tích URL
    const { hostname, pathname, port } = new URL(url);

    const postData = JSON.stringify({
      projectKey,
      token
    });

    const options = {
      hostname,
      port: port || 443,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    req.on('error', (err) => {
      fs.unlink(dest, () => { });
      reject(err);
    });
req.write(postData); // Gửi body POST 
    req.end();
  });
}

// Thêm ảnh vào README.md
async function addImageToReadme() {
  try {
    await downloadImage(imageUrl, imageFilePath);
  } catch (error) {
    console.log('Lỗi khi tải ảnh:', error);
  }
}

addImageToReadme();