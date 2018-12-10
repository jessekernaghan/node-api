import config from "./config";

import PubSub from "./services/pubsub";
import db from "./services/db";


db.connect()
  .then(client => {

  });
PubSub.connect().then((connection) => {
  connection.subscribe("foobar", () => {
    console.log('tick tock!');
  });

  connection.publish("foobar", "hello world");
});
