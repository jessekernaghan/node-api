// @flow
import config from "./config";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors({}));


app.use("/", function(req,res) {
  res.status(200).json({ message: "hello world" });
});


app.listen(process.env.PORT, () => {
  console.log(`app listening on port: ${process.env.PORT || 'unknown'}`);
});
