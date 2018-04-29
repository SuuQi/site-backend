/**
 * mongodb配置
 * @type {Object}
 */
export const MONGO = {
    URI: process.env.NODE_ENV === 'production'
        ? 'mongodb://localhost/site'
        : 'mongodb://localhost/test-site',
    OPTIONS: {
        config: {
            autoIndex: false
        },
        db: {
            safe: true
        }
    }
};
