const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const comments = {};
/*
 * postId ->  [comment,id ]
 
*/

app.get("/comments/:id", (req, res) => {
  const postId = req.params.id;
  const commentsOfPost = comments[postId] ? comments[postId] : [];
  return res.json(commentsOfPost);
});

app.post("/comments/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    
    const commentId = randomBytes(4).toString("hex");
    const commentsArray = comments[postId] ? comments[postId] : [];
    commentsArray.push({
      id: commentId,
      comment: req.body.comment,
      status: "pending",
    });
    comments[postId] = commentsArray;
    await axios.post("http://event-bus-service:4005/events", {
      type: "commentCreated",
      data: {
        id: commentId,
        comment: req.body.comment,
        postId,
        status: "pending",
      },
    });
  } catch (error) {
    console.log(error);
  }
  return res.json(comments[postId]);
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  if (req.body.type === "commentModerated") {
    let commentsArray = comments[req.body.data.postId].map((comment) => {
      if (comment.id === req.body.data.id) {
        comment.status = req.body.data.status;
      }
      return comment;
    });
    comments[req.body.data.postId] = commentsArray;
  }
  return res.send({});
});

app.listen(4001, () => {
  console.log("Comments Server running on 4001");
});
