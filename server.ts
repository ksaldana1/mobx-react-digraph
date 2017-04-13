import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
// import cors from 'cors';
import axios from 'axios';

const app = express();

app.set('port', 4000);
app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));

app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors());

app.use(express.static('dist'));

app.post('/api/transitions', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/transitions', req.body);
    res.send('success!' + response.data);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
});

app.delete('/api/transitions/:id', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:8000/transitions/${req.params.id}`, { data: {} });
    res.send('success!' + response.data);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
});

app.post('/api/statuses', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/statuses', req.body);
    res.send(response.data);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
});

app.delete('/api/statuses/:stubName', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:8000/statuses/${req.params.stubName}`, { data: {} });
    res.send('success' + response.data);
  } catch (e) {
    console.error(e);
    res.send();
  }
});

// fallthrough
app.get('*', function (req, res) {
  res.send('index.html');
});
