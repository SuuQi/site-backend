
import Publish from './publish.model';

export async function list (ctx) {
    ctx.body = await Publish.find().exec();
}

export async function save (ctx) {
    const fields = ctx.request.fields;
    const publish = new Publish(fields);
    
    ctx.body = await publish.save();
}
