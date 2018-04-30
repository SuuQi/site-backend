import _ from 'lodash';
import path from 'path';
import dir from 'node-dir';
import Ftp from 'ftp';

/**
 * ftp服务
 * @module service/ftp
 */

const defaultConfig = {
    secure: false,
    secureOptions: {
        rejectUnauthorized: false
    }
};

/**
 * 连接ftp
 * @param  {Object} ftpConfig 连接ftp的配置
 * @return {Promise}           返回promise
 */
export function conncetFtp (ftpConfig) {
    return new Promise((resolve, reject) => {
        console.log(ftpConfig);
        const client = new Ftp();

        client.on('ready', () => {
            resolve(client);
        });

        client.on('error', err => {
            const error = new Error(`${err.message}，code：${err.code}`);
            error.stack = err.stack;
            reject(error);
        });

        client.connect(_.assign({}, defaultConfig, ftpConfig));
    });
}

/**
 * 上传文件到ftp
 * @param  {Object} ftpConfig 连接ftp的配置
 * @param  {Object} opts      上传文件配置
 * @param  {String} opts.localPath  本地上传的目录
 * @param  {String} opts.ftpPath    上传到ftp的目录
 * @param  {RegExp|Function} opts.match      匹配文件的正则或者判断是否匹配的函数
 * @return {Promise}           返回promise
 */
export function uploadToFtp (ftpConfig, opts) {
    return new Promise((resolve, reject) => {
        let hasError = false;

        conncetFtp({
            host: ftpConfig.domain,
            port: ftpConfig.port,
            user: ftpConfig.username,
            password: ftpConfig.password
        })
        .then(ftpClient => {
            ftpClient.on('error', err => {
                reject(err);
            });

            dir.files(opts.localPath, function (err, files) {
                if (err) { return reject(err); }

                const len = files.length;
                const changeSep = p => p.split(path.sep).join('/');
                let count = 0;
                let fileList = [];

                _.forEach(files, function (file) {
                    if (hasError) { return false; }
                    if ((_.isFunction(opts.match) && !opts.match(file))
                        || (_.isRegExp(opts.match) && !file.match(opts.match))) {
                        count++;
                        return;
                    }
                    const relativePath = path.relative(opts.localPath, file);
                    const uploadPath = changeSep(path.join(opts.ftpPath, relativePath));
                    const uploadDir = changeSep(path.join(uploadPath, '../'));

                    // 先确保目录存在，然后上传文件
                    ftpClient.mkdir(uploadDir, true, function (err) {
                        if (err) { hasError = true; return reject(err); }

                        ftpClient.put(file, uploadPath, function (err) {
                            if (err) { hasError = true; return reject(err); }

                            count++;
                            fileList.push(uploadPath);

                            if (count === len) {
                                ftpClient.end();
                                // 文件都成功上传后，调用回调
                                resolve(fileList);
                            }
                        });
                    });
                });

                if (count === len) {
                    resolve([]);
                }
            });
        })
        .catch(reject);
    });
}

/**
 * 递归遍历ftp路径，返回目录下所有文件名
 * @param  {Object} ftpClient ftp连接对象
 * @param  {Object} ftpPath 遍历的ftp路径
 * @return {Promise}        返回promise
 */
function mapFtpPath (ftpClient, ftpPath) {
    return new Promise((resolve, reject) => {
        ftpClient.list(ftpPath, (error, fileList) => {
            if (error) return reject(error);

            Promise.all(
                _.map(fileList, item => {
                    const name = ftpPath + '/' + item.name;

                    return item.type === 'd'
                        ? mapFtpPath(ftpClient, name)
                        : name;
                })
            )
            .then(res => resolve(_.flattenDeep(res)))
            .catch(reject);
        });
    });
}

/**
 * 获取目录下所有文件
 * @param  {Object} ftpConfig 连接ftp的配置
 * @param  {String} ftpPath    文件在ftp的目录
 * @return {Promise}           返回promise
 */
export function fetchFromFtp (ftpConfig, ftpPath) {
    return conncetFtp({
        host: ftpConfig.domain,
        port: ftpConfig.port,
        user: ftpConfig.username,
        password: ftpConfig.password
    })
    .then(async ftpClient => {
        const files = await mapFtpPath(ftpClient, ftpPath);
        console.log(files);
        ftpClient.end();
        return files;
    });
}
