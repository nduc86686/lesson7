// test.js

const search = require('./search');
const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
describe('search()', () => {

    //1.Kiểm tra trường hợp đường dẫn không tồn tại.
    it('1.đường dẫn không tồn tại', () => {
        // Tạo một đối tượng stub cho fs.existsSync
        const existsSyncStub = sinon.stub(fs, 'existsSync');
        // Thiết lập kết quả trả về của stub là false
        existsSyncStub.returns(false);

        // Gọi hàm search với đường dẫn không tồn tại
        expect(() => {
            search('fox', './path_does_not_exist');
        }).to.throw('Đường dẫn không tồn tại');

        // Khôi phục lại trạng thái ban đầu của fs.existsSync
        existsSyncStub.restore();

    });

    //2.Kiểm tra trường hợp đường dẫn đến một file không phải là file .txt.
    it('2.file không phải định dạng .txt', () => {
        const extnameStub = sinon.stub(path, 'extname');
        // Thiết lập kết quả trả về của stub là '.md', đại diện cho file không phải .txt
        extnameStub.returns('.md');

        // Gọi hàm search với file không phải định dạng .txt
        expect(() => {
            search('fox', './test_files/test3.md');
        }).to.throw('File không phải định dạng .txt');

        // Khôi phục lại trạng thái ban đầu của path.extname
        extnameStub.restore();
    });
    //3.Kiểm tra trường hợp đường dẫn đến một file .txt chứa searchWord.
    it('3.tìm kiếm thành công trong file', () => {
        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns('The quick brown fox');

        expect(search('fox', './test_files/test1.txt', fs)).to.deep.equal([{
            fileName: 'test1.txt',
            firstLine: 'The quick brown fox'
        }]);

        readFileSyncStub.restore();
        // const result = search('fox', './test_files/test1.txt');
        // expect(result).to.deep.equal([{fileName: 'test1.txt', firstLine: 'The quick brown fox\r'}]);

    });

    //4.Kiểm tra trường hợp đường dẫn đến một file .txt không chứa searchWord.
    it('4.tìm kiếm trường hợp txt không chưa searchWord', () => {
        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns('The quick brown foxxxx');

        const result = search('foxss', './test_files/test1.txt');
        expect(result).to.deep.equal([]);
        readFileSyncStub.restore();
    });

    //5.Kiểm tra trường hợp đường dẫn đến một thư mục không chứa file .txt hoặc thư mục rỗng.
    it('5.thư mục không chứa file .txt', () => {

        // Tạo một đối tượng stub cho fs.readdirSync
        const readdirSyncStub = sinon.stub(fs, 'readdirSync');
        // Thiết lập kết quả trả về của stub là một mảng rỗng
        readdirSyncStub.returns([]);

        // Gọi hàm search với đường dẫn đến thư mục không chứa file .txt
        const result = search('fox', './test_files/notxt');

        // Kiểm tra kết quả trả về có đúng như mong đợi không
        expect(result).to.deep.equal([]);

        // Khôi phục lại trạng thái ban đầu của fs.readdirSync
        readdirSyncStub.restore();
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
        const fileContent = 'The quick brown fox\n';

        // Stub fs.readFileSync() để trả về nội dung của file
        sinon.stub(fs, 'readFileSync').returns(fileContent);

        expect(() => {
            search('fox\n', './test_files/test1.txt');
        }).to.throw('Dữ liệu không mong muốn');

        // Khôi phục stub
        fs.readFileSync.restore();
    });
    //8.Kiểm tra trường hợp nội dung tìm kiếm chứa ký tự ".
    it('8.nội dung tìm kiếm chứa ký tự "', () => {
        const fileContent = 'The quick brown fox\n';

        // Stub fs.readFileSync() để trả về nội dung của file
        sinon.stub(fs, 'readFileSync').returns(fileContent);
        expect(() => {
            search('fox" dog', './test_files/test1.txt');
        }).to.throw('Dữ liệu không mong muốn');
        // Khôi phục stub
        fs.readFileSync.restore();
    });

///"test": "mocha search.test.js",
});