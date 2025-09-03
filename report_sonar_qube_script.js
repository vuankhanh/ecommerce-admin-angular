const fs = require('fs');
const http = require('http');
const path = require('path');

// // Thêm đoạn này ở đầu file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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
const imageFileName = 'sonar-qube-report.png';
const imageFilePath = path.join(__dirname, 'readme-media/report', imageFileName);

// Tải ảnh về
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const tempFilePath = dest + '.tmp';
    const tempFile = fs.createWriteStream(tempFilePath);

    const { hostname, pathname, port } = new URL(url);

    const postData = JSON.stringify({
      projectKey,
      token
    });

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
        res.on('data', chunk => {
          errorData += chunk;
        });
        res.on('end', () => {
          tempFile.close();
          fs.unlink(tempFilePath, () => { });
          try {
            const errorJson = JSON.parse(errorData);
            const response = {
              status: res.statusCode,
              message: errorJson.error || 'Đã có lỗi xảy ra',
              data: null
            }
            reject(response)
          } catch (error) {
            reject(errorData); // Ném nguyên object lỗi ra ngoài
          }
        });
        return;
      }
      res.pipe(tempFile);
      tempFile.on('finish', () => {
        tempFile.close();
        fs.rename(tempFilePath, dest, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    req.on('error', (err) => {
      tempFile.close();
      fs.unlink(tempFilePath, () => { });
      reject(err);
    });
    req.write(postData);
    req.end();
  });
}

// Thêm ảnh vào README.md
async function addImageToReadme() {
  try {
    await downloadImage(imageUrl, imageFilePath);
  } catch (error) {
    console.log(error.message);
  }
}

addImageToReadme();