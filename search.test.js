// test.js

const search = require('./search');
const expect = require('chai').expect;

describe('search()', () => {

    //1.Kiểm tra trường hợp đường dẫn không tồn tại.
    it('1.đường dẫn không tồn tại', () => {
        expect(() => {
            search('fox', './path_does_not_exist');
        }).to.throws('Đường dẫn không tồn tại');
    });

    //2.Kiểm tra trường hợp đường dẫn đến một file không phải là file .txt.
    it('2.file không phải định dạng .txt', () => {
        expect(() => {
            search('fox', './test_files/test3.md');
        }).to.throws('File không phải định dạng .txt');
    });
    //3.Kiểm tra trường hợp đường dẫn đến một file .txt chứa searchWord.
    it('3.tìm kiếm thành công trong file', () => {
        const result = search('fox', './test_files/test1.txt');
        expect(result).to.deep.equal([{fileName: 'test1.txt', firstLine: 'The quick brown fox\r'}]);

    });

    //4.Kiểm tra trường hợp đường dẫn đến một file .txt không chứa searchWord.
    it('4.tìm kiếm trường hợp txt không chưa searchWord', () => {
        const result = search('foxss', './test_files/test1.txt');
        expect(result).to.deep.equal([]);

    });

    //5.Kiểm tra trường hợp đường dẫn đến một thư mục không chứa file .txt hoặc thư mục rỗng.
    it('5.thư mục không chứa file .txt', () => {
        const result = search('fox', './test_files/notxt');
        expect(result).to.deep.equal([]);
    });
    //6.Kiểm tra trường hợp tìm kiếm được nhiều kết quả.
    it('6.Kiểm tra trường hợp tìm kiếm được nhiều kết quả.', () => {
        const result = search('fox', './test_files');
        expect(result).to.deep.equal([
            // { fileName: 'test1.txt', firstLine: 'The quick brown fox\r' },
            // { fileName: 'subdir/test2.txt', firstLine: 'The lazy dog\r' },
            {
                "fileName": "test_files\\test1.txt",
                "firstLine": "The quick brown fox\r"
            },
            {
                "fileName": "test_files\\test2.txt",
                "firstLine": "The lazy dog\r"
            }

        ]);
    });

    //7.Kiểm tra trường hợp nội dung tìm kiếm chứa ký tự \n.
    it('7.nội dung tìm kiếm chứa "\\n"', () => {
        expect(() => {
            search('fox\n', './test_files/test1.txt');
        }).to.throw('Dữ liệu không mong muốn');
    });
    //8.Kiểm tra trường hợp nội dung tìm kiếm chứa ký tự ".
    it('8.nội dung tìm kiếm chứa ký tự "', () => {
        expect(() => {
            search('fox" dog', './test_files/test1.txt');
        }).to.throw('Dữ liệu không mong muốn');
    });


});