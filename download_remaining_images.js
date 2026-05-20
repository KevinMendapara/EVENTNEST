const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = {
    // Missing workshop image
    'w_write.jpg': 'https://picsum.photos/seed/writing/800/500',
    
    // Seminar Avatars
    'av_turing.jpg': 'https://ui-avatars.com/api/?name=Alan+Turing&background=0D8ABC&color=fff&size=150',
    'av_satoshi.jpg': 'https://ui-avatars.com/api/?name=Satoshi+N&background=F7931A&color=fff&size=150',
    'av_sarah.jpg': 'https://ui-avatars.com/api/?name=Sarah+J&background=E50914&color=fff&size=150',
    'av_kevin.jpg': 'https://ui-avatars.com/api/?name=Kevin+M&background=28A745&color=fff&size=150',
    
    // Workshop Avatars
    'av_don.jpg': 'https://ui-avatars.com/api/?name=Don+Norman&background=F093FB&color=fff&size=150',
    'av_ansel.jpg': 'https://ui-avatars.com/api/?name=Ansel+Adams&background=000000&color=fff&size=150',
    'av_jk.jpg': 'https://ui-avatars.com/api/?name=JK+Rowling&background=F5576C&color=fff&size=150',
    'av_grayson.jpg': 'https://ui-avatars.com/api/?name=Grayson+P&background=4FACFE&color=fff&size=150'
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
        req.on('error', resolve);
    });
}

async function run() {
    for (const [filename, url] of Object.entries(downloads)) {
        await downloadImage(url, path.join(imgDir, filename));
    }
}

run();
