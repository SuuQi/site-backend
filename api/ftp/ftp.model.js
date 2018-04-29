import { mongoose } from 'site-middle-layer';
import _ from 'lodash';

const ftpConfig = {
    username: { type: String },
    password: { type: String },
    domain: { type: String, default: 'upload.cms.netease.com', required: [true, '域不能为空'] },
    port: { type: Number, default: 5021, required: [true, '端口不能为空'] },
    path: { type: String, required: [true, '地址不能为空'] }
};

const FtpSchema = new mongoose.Schema({
    name: { type: String },                                                                      // ftp名称
    componentResourcesPathPrefix: { type: String, required: [true, '组件路径前缀不能为空'] },       // 组件资源在cdn的目录前缀
    projectResourcesPathPrefix: { type: String, required: [true, '项目路径前缀不能为空'] },         // 项目资源在cdn的目录前缀
    testHtml: _.cloneDeep(ftpConfig),                                                            // 测试html
    testResources: _.cloneDeep(ftpConfig),                                                       // 测试资源
    prodHtml: _.cloneDeep(ftpConfig),                                                            // 正式html
    prodResources: _.cloneDeep(ftpConfig)                                                        // 正式资源
});

FtpSchema
    .virtual('info')
    .get(function () {
        return {
            _id: this._id,
            name: this.name,
            testHtmlPath: this.testHtml.path,
            testResourcesPath: this.testResources.path,
            prodHtmlPath: this.prodHtml.path,
            prodResourcesPath: this.prodResources.path
        };
    });

export default mongoose.model('Ftp', FtpSchema);
