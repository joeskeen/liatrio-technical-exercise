import express from "express";
import rootRoute from "./root.js";
import { PORT } from './defaults.js';

const app = express();
app.use("/", rootRoute);

const port = process.env.PORT ?? PORT;
app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`);
});
