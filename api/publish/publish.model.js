import { monsoose, mongoose } from 'site-middle-layer';

const PublishSchema = new mongoose.Schema({
    name: { type: String, required: true },                        // 项目名字
    desc: { type: String, required: true },                        // 项目简介
    git: { type: String, required: true },                         // 项目git地址
    url: { type: String },                                         // 项目正式地址
    prodPath: { type: String },                                    // 项目正式路径（组件不需要）
    testUrl: { type: String },                                     // 项目测试地址
});

export default mongoose.model('Publish', PublishSchema);
