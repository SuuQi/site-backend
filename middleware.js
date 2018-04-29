import createError from 'http-errors';

/**
 * @param  {Object}   ctx 路由上下文
 * @param  {Function} next next函数
 */
export async function errorHandler (ctx, next) {
    try {
        await next();

        const status = ctx.status || 404;

        if (status === 404) {
            throw new createError.NotFound();
        }
    } catch (err) {
        if (err instanceof createError.Unauthorized) {
            ctx.body = err.message;
            ctx.status = 401;
        } else if (err instanceof createError.Forbidden) {
            ctx.body = err.message;
            ctx.status = 403;
        } else {
            ctx.body = `${err.message}\n${err.stack}`;
            ctx.status = err.status || 500;
        }

        ctx.app.emit('error', err, ctx);
    }
}
