const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const static = require('koa-static');
const session = require('koa-session');
const koaBody = require('koa-body')
const flash = require('koa-connect-flash')
const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app, // equals to pug.use(app) and app.use(pug.middleware)
});

const errorHandler = require('./libs/error');
const config = require('./config');
const router = require('./routes');
const port = process.env.PORT || 3000;

app.use(static('./public'));

app.use(errorHandler);

app.on('error', (err, ctx) => {
  ctx.request
  ctx.response.body = {}
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

app.use(koaBody({
  formidable: {
    uploadDir: './public/assets/img/products',
    keepExtensions: true
  },
  multipart: true
}));

app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log(`> Ready On Server http://localhost:${port}`);
});

// module.exports = app.callback();
