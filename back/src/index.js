import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import loginRouter from '../router/loginRouter.js';
import authCheckRouter from '../router/authCheckRouter.js';
//add itemRouter
import itemRouter from '../router/itemRouter.js';
//saldo
import saldoRouter from '../router/saldoRouter.js';
//save to file
import saveToFile from '../router/saveToFileRouter.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../front')));


app.use(cors());
app.use(express.json());


app.use("/api", loginRouter);
app.use("/api", authCheckRouter);
app.use("/api", itemRouter);
app.use("/api", saldoRouter);
app.use("/api", saveToFile);

app.get(/^\/(?!.*\.\w+$).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../front/index.html'));
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
