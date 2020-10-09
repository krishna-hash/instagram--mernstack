const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
const mongoose = require("mongoose");
const db = require("../backend/mongo");

const app = express();
app.use(express.json());
app.use(cors());

const pusher = new Pusher({
  appId: "1087179",
  key: "b92b632cd98031c54be9",
  secret: "9ab3ccdc19f8f667f6a6",
  cluster: "ap2",
  usetls: true,
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/uploads", (req, res) => {
  const body = req.body;
  db.create(body, (err, data) => {
    if (err) {
      res.send(err).status(500);
    } else {
      res.send(data).status(201);
    }
  });
});
app.get("/getups", (req, res) => {
  db.find((err, data) => {
    if (err) {
      res.send(err).status(500);
    } else {
      res.send(data).status(200);
    }
  });
});

const connecturl =
  "mongodb+srv://mern-instagram:karma111@cluster0.llr90.mongodb.net/instadb?retryWrites=true&w=majority";
mongoose.connect(connecturl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("db connected");

  const changer = mongoose.connection.collection("instadbs").watch();
  changer.on("change", (change) => {
    console.log("changing", change);

    if (change.operationType === "insert") {
      const details = change.fullDocument;
      pusher.trigger("instadbs", "inserted", {
        user: details.user,
        caption: details.caption,
        image: details.image,
      });
    } else {
      console.log("error occured in pusher");
    }
  });
});
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("port created"));
