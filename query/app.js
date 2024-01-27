const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};
/*
 * postId ->  title,id,comments
 
*/

app.get("/posts", (req, res) => {
  return res.json(posts);
});
const handleEvent = (type,data) =>{
  if (type === "postCreated") {
    posts[data.id] = { id:data.id, title:data.title, comments: [] };
  } else if (type === "commentCreated") {
    post = posts[data.postId];
    post.comments.push({ id: data.id, comment: data.comment, status:data.status });
    console.log('type',JSON.stringify(posts))
  }else if(type==='commentModerated'){
    let commentsArray = posts[data.postId].comments.map(comment=>{
      if(comment.id===data.id){
        comment.status = data.status
      }
      return comment
    })
    console.log(type,commentsArray,data)
    posts[data.postId].comments = commentsArray
  }
}
app.post("/events", (req, res) => {
  try {
    const type = req.body.type;
  const data = req.body.data;
  
  handleEvent(type,data)
  return res.send({})
  } catch (error) {
    console.log(error)
  }
  return res.send({ messsae: "OK" });
});

app.listen(4002, async () => {
  console.log("Query server running on 4002");
  const data = await axios.get('http://event-bus-service:4005/events')
  data.data.map(event=>{
    console.log(event.type)
    handleEvent(event.type,event.data)
  })
});
