// search.js

const fs = require('fs');
const path = require('path');

function search(searchWord, folderPath) {

    if (!fs.existsSync(folderPath)) {
        throw new Error('Đường dẫn không tồn tại');
    }

    const stat = fs.statSync(folderPath);
    if (searchWord.includes('\n') || searchWord.includes('"')) {
        throw new Error('Dữ liệu không mong muốn');
    }
    if (stat.isFile() && path.extname(folderPath) !== '.txt') {
        throw new Error('File không phải định dạng .txt');
    } else if (stat.isFile()) {
        if (path.extname(folderPath) === '.txt') {
            const content = fs.readFileSync(folderPath, 'utf8');
            if (content.includes(searchWord)) {
                const firstLine = content.trim().split('\n')[0];
                return [{fileName: path.basename(folderPath), firstLine: firstLine}];
            }
        }
        return [];
    } else if (stat.isDirectory()) {
        // Lấy danh sách các file trong thư mục
        const files = fs.readdirSync(folderPath);

        // Lặp qua các file để kiểm tra nội dung
        const result = [];
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            try {
                const fileStat = fs.statSync(filePath);
                if (fileStat.isFile() && path.extname(file) === '.txt') {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes(searchWord)) {
                        const firstLine = content.trim().split('\n')[0];
                        result.push({fileName: filePath, firstLine: firstLine});
                        console.log('result', result)
                    }
                } else if (fileStat.isDirectory()) {
                    // Đệ quy tìm kiếm trong thư mục con
                    const subResult = search(searchWord, filePath);
                    result.push(...subResult);
                }
            } catch (err) {
                console.error(`Lỗi khi đọc file ${folderPath}: ${err.message}`);
            }
        }

        return result;
    }

}
search('fox', './test_files')
module.exports = search;

