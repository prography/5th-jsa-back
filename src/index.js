import app from './app';

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`server is running on ${port}`)
});