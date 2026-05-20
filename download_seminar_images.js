const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
    's_hero.jpg': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80',
    's_ai.jpg': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    's_web3.jpg': 'https://images.unsplash.com/photo-1639762681485-074b7f4ec671?auto=format&fit=crop&w=800&q=80',
    's_cloud.jpg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    's_cyber.jpg': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
};

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function download(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }
            
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${path.basename(filename)}`);
                resolve();
            });
        }).on('error', reject);
    });
}

async function main() {
    for (const [filename, url] of Object.entries(images)) {
        try {
            await download(url, path.join(imgDir, filename));
        } catch (e) {
            console.error(`Error downloading ${filename}:`, e);
        }
    }
}

main();
