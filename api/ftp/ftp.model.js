import { mongoose } from 'site-middle-layer';
import _ from 'lodash';

const ftpConfig = {
    username: { type: String, required: [true, '账号不能为空']  },
    password: { type: String, required: [true, '密码能为空']  },
    domain: { type: String, required: [true, '域不能为空'] },
    port: { type: Number, default: 5021, required: [true, '端口不能为空'] },
    path: { type: String, required: [true, '地址不能为空'] },
    ftpPathPrefix: { type: String, required: [true, '项目路径前缀不能为空'] } // 与path对应的ftp目录前缀
};

const FtpSchema = new mongoose.Schema({
    name: { type: String, default: '默认配置' },                                                                      // ftp名称
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
