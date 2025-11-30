import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.json({ message: 'API working from Vercel serverless!' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});

export default app;
