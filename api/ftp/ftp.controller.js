import _ from 'lodash';
import Ftp from './ftp.model';
import { conncetFtp } from 'service/ftp';

// 获取列表
export async function list (ctx) {
    ctx.body = await Ftp.find().exec();
    ctx.body = _.map(ctx.body, ftp => ftp.info);
}

// 获取详细
export async function detail (ctx) {
    const ftp = await Ftp.findById(ctx.params.id).exec();
    ctx.state.resource = ctx.body = ftp;
}

// 新增
export async function save (ctx) {
    const ftp = new Ftp(ctx.request.fields);
    ctx.body = await ftp.save();
}

// 更新
export async function update (ctx) {
    const ftp = await Ftp.findById(ctx.params.id).exec();
    const updated = _.assign(ftp, _.omit(ctx.request.fields, ['_id']));
    ctx.body = await updated.save();
}

// 删除
export async function remove (ctx) {
    const ftp = await Ftp.findById(ctx.params.id).exec();
    await ftp.remove();
    ctx.response.status = 204;
}

// 测试ftp是否能够连接
export async function test (ctx) {
    const client = await conncetFtp({
        host: ctx.request.fields.domain,
        port: ctx.request.fields.port,
        user: ctx.request.fields.username,
        password: ctx.request.fields.password
    });
    client.end();
    ctx.response.status = 200;
}
