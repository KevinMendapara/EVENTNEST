const fs = require('fs');
const path = require('path');

const publicDir = __dirname;
const imagesDir = path.join(publicDir, 'images');

// Get all files recursively
function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.vscode' && file !== 'supabase') {
                getFiles(filePath, fileList);
            }
        } else {
            const ext = path.extname(file);
            if (['.html', '.js', '.css'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

// Get all actual images on disk (lowercased map for case checking)
const actualImages = {};
if (fs.existsSync(imagesDir)) {
    fs.readdirSync(imagesDir).forEach(img => {
        actualImages[img.toLowerCase()] = img; // map lowercase to exact case on disk
    });
}

console.log(`Found ${Object.keys(actualImages).length} actual images in images directory.`);

const allFiles = getFiles(publicDir);
console.log(`Scanning ${allFiles.length} files...`);

const issues = [];

allFiles.forEach(file => {
    const relativePath = path.relative(publicDir, file);
    const content = fs.readFileSync(file, 'utf8');
    
    // Regular expression to find image paths, src attributes, url() in CSS, and literal strings in JS
    // We look for anything that looks like "images/..." or "/images/..." or background: url(...)
    
    // 1. Check for absolute paths with leading slash: "/images/..."
    const leadingSlashRegex = /(src|href|url)\s*=\s*["']\/images\/([^"']+)["']/gi;
    let match;
    while ((match = leadingSlashRegex.exec(content)) !== null) {
        issues.push({
            file: relativePath,
            type: 'LEADING_SLASH',
            raw: match[0],
            path: '/images/' + match[2],
            suggestion: `Change to relative: 'images/${match[2]}'`
        });
    }

    // 2. Check for image references in strings
    const imageStringRegex = /["'](\/?images\/[^"']+\.(jpg|jpeg|png|gif|svg|webp))["']/gi;
    while ((match = imageStringRegex.exec(content)) !== null) {
        const imgPath = match[1];
        if (imgPath.startsWith('/')) {
            issues.push({
                file: relativePath,
                type: 'LEADING_SLASH_STRING',
                raw: match[0],
                path: imgPath,
                suggestion: `Remove leading slash: '${imgPath.slice(1)}'`
            });
        }
        
        // Case-sensitivity and existence check
        const parts = imgPath.split('/');
        const filename = decodeURIComponent(parts[parts.length - 1]);
        const lowerFilename = filename.toLowerCase();
        
        if (!actualImages[lowerFilename]) {
            // Check if it's a known dynamically downloaded image or movie poster
            if (!filename.includes('movie') && !filename.includes('placeholder')) {
                issues.push({
                    file: relativePath,
                    type: 'MISSING_FILE',
                    raw: match[0],
                    path: imgPath,
                    suggestion: `File '${filename}' does not exist in public/images/`
                });
            }
        } else {
            const exactFilename = actualImages[lowerFilename];
            if (exactFilename !== filename) {
                issues.push({
                    file: relativePath,
                    type: 'CASE_MISMATCH',
                    raw: match[0],
                    path: imgPath,
                    found: exactFilename,
                    suggestion: `Change case of '${filename}' to match disk: '${exactFilename}'`
                });
            }
        }
    }

    // 3. Scan CSS files for background-image urls
    if (file.endsWith('.css')) {
        const cssUrlRegex = /url\s*\(\s*["']?(\/?images\/[^"')]+)["']?\s*\)/gi;
        while ((match = cssUrlRegex.exec(content)) !== null) {
            const imgPath = match[1];
            if (imgPath.startsWith('/')) {
                issues.push({
                    file: relativePath,
                    type: 'CSS_LEADING_SLASH',
                    raw: match[0],
                    path: imgPath,
                    suggestion: `Remove leading slash: '${imgPath.slice(1)}'`
                });
            }
        }
    }
});

console.log('\n--- SCAN RESULTS ---');
if (issues.length === 0) {
    console.log('No issues found!');
} else {
    console.log(`Found ${issues.length} potential issues:`);
    console.log(JSON.stringify(issues, null, 2));
}

// Clean up
fs.writeFileSync(path.join(publicDir, 'diagnose_results.json'), JSON.stringify(issues, null, 2));
console.log('\nSaved results to diagnose_results.json');
