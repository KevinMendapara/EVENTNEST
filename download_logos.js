const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = {
    'mi_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/l40j8p1487678631.png',
    'csk_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/okceh51487601098.png',
    'rcb_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/kynj5v1588331757.png',
    'kkr_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/ows99r1487678296.png',
    'dc_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/dg4g0z1587334054.png',
    'srh_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/sc7m161487419327.png',
    'rr_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/lehnfw1487601864.png',
    'gt_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/6qw4r71654174508.png',
    'pbks_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/r1tcie1630697821.png',
    'lsg_badge.png': 'https://r2.thesportsdb.com/images/media/team/badge/4tzmfa1647445839.png'
};

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, (response) => {
            if (response.statusCode === 200 || response.statusCode === 302) {
                if (response.statusCode === 302) {
                    download(response.headers.location, dest).then(resolve).catch(reject);
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(`Server responded with ${response.statusCode}`);
            }
        });
        
        req.on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

async function run() {
    for (const [filename, url] of Object.entries(logos)) {
        console.log(`Downloading ${filename}...`);
        try {
            await download(url, path.join(imgDir, filename));
            console.log(`Successfully downloaded ${filename}`);
        } catch (err) {
            console.error(`Failed to download ${filename}:`, err);
        }
    }
}

run();
