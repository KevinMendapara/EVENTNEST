const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = {
    'arijit.jpg': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    'neha.jpg': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'badshah.jpg': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    'shreya.jpg': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'movie2.jpg': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'
};

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return resolve(`Skipped ${filename} - Status ${res.statusCode}`);
            }
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${path.basename(filename)}`);
                resolve();
            });
        });
        req.on('error', (err) => {
            console.error(`Error downloading ${filename}:`, err);
            resolve();
        });
    });
}

async function run() {
    for (const [filename, url] of Object.entries(downloads)) {
        await downloadImage(url, path.join(imgDir, filename));
    }
    console.log('All image downloads completed successfully!');
}

run();
