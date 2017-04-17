import * as Router from 'koa-router';
import axios from 'axios';

const router = new Router({ prefix: '/api' });

const baseURL = 'http://localhost:8000';

router.get('/transitions', async (ctx, next) => {
  try {
    const response = await axios.get(`${baseURL}/transitions`);
    ctx.body = response.data;
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

router.post('/transitions', async (ctx, next) => {
  try {
    const response = await axios.post(`${baseURL}/transitions`, ctx.request.body);
    ctx.body = 'success!' + response.data;
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

router.delete('/transitions/:id', async (ctx, next) => {
  try {
    const response = await axios.delete(`${baseURL}/transitions/${ctx.params.id}`, { data: {} });
    ctx.body = ('success!' + response.data);
  } catch (e) {
    console.error(e);
    ctx.body = ('error');
  }
});

router.get('/statuses', async (ctx, next) => {
  try {
    const response = await axios.get(`${baseURL}/statuses`);
    ctx.body = response.data;
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

router.post('/statuses', async (ctx, next) => {
  try {
    const response = await axios.post(`${baseURL}/statuses`, ctx.request.body);
    ctx.body = response.data;
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

router.delete('/statuses/:stubName', async (ctx, next) => {
  try {
    const response = await axios.delete(`${baseURL}/statuses/${ctx.params.stubName}`, { data: {} });
    ctx.body = 'success' + response.data;
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

export default router;
