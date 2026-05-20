const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
    'w_hero.jpg': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
    'w_design.jpg': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    'w_photo.jpg': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    'w_write.jpg': 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=800&q=80',
    'w_pottery.jpg': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'
};

const imgDir = path.join(__dirname, 'images');

function download(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return resolve(); // Skip silently on failure, will fallback in HTML
            }
            
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${path.basename(filename)}`);
                resolve();
            });
        }).on('error', resolve);
    });
}

async function main() {
    for (const [filename, url] of Object.entries(images)) {
        await download(url, path.join(imgDir, filename));
    }
}

main();
