const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

let events = [];

app.post("/events", async (req, res) => {
  events.push({ type: req.body.type, data: req.body.data });
  try {
    await axios.post("http://posts-service:4000/events", {
      type: req.body.type,
      data: req.body.data,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await axios.post("http://comment-service:4001/events", {
      type: req.body.type,
      data: req.body.data,
    });
  } catch (error) {
    console.log(error);
  }
  try {
    await axios.post("http://query-service:4002/events", {
      type: req.body.type,
      data: req.body.data,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await axios.post("http://moderation-service:4003/events", {
      type: req.body.type,
      data: req.body.data,
    });
  } catch (error) {
    console.log(error);
  }

  
  return res.send({});
});

app.get("/events", (req, res) => {
  return res.json(events);
});

app.listen(4005, () => {
  console.log("Event bus running on 4005");
});
