import path from 'path';
import { mongoose, create } from 'site-middle-layer';
import router from './router';
import { MONGO } from './service/config';

// 设置mongoose使用的promise
mongoose.Promise = Promise;
// 连接数据库
mongoose.connect(MONGO.URI, MONGO.OPTIONS);

export default create({
    static: {
       root: path.join(__dirname, 'static')
    },
    router
});
