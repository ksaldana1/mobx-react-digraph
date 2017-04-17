import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
import router from './routes';

const app = new Koa();
app.use(bodyParser())
  .use(serve((__dirname + '/../dist'), {}))
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
