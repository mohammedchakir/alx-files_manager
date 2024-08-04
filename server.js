import express from 'express';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 5000;

const redisClient = createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'files_manager';
let db;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  db = client.db(dbName);
});

app.use((req, res, next) => {
  req.db = db;
  req.redisClient = redisClient;
  next();
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
