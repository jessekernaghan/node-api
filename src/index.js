// @flow
import nconf from "nconf";
import express from "express";
import cors from "cors";

const app = express();

nconf.argv().env();
app.use(cors({}));


app.use("/", function(req,res) {
  res.status(200).json({ message: "hello world" });
});


app.listen(process.env.PORT, () => {
  console.log('app listening');
});
