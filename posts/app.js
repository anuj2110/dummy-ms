const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};
/*
 * postId ->  title,id 
 
*/

app.get("/", (req, res) => {
  return res.json(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  try {
    
    posts[id] = { title: req.body.title, id };
    await axios.post("http://event-bus-service:4005/events", {
      type: "postCreated",
      data: { id: id, title: req.body.title },
    });
  } catch (error) {
    console.log(error);
  }
  return res.json(posts[id]);
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  return res.send({});
});

app.listen(4000, () => {
  console.log('new change 2')
  console.log("Posts erver running on 4000");
});
