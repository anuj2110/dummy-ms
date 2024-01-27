const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(express.json())
const pause = async () => {
    return new Promise((res,rej)=>{
        setTimeout(res,5000)
    })
}
app.post('/events',async (req,res)=>{
    const type = req.body.type;
    try {
        const data = req.body.data;
    if(type==='commentCreated'){
        console.log('here')
        const commentsWords = data.comment.toLowerCase().split(' ')
        if(commentsWords.indexOf('orange')!==-1){
            data.status='failed'
        }else{
            data.status='passed'
        }

        await axios.post('http://event-bus-service:4005/events',{
            type:'commentModerated',
            data
        })
    }
    } catch (error) {
        console.log(error)
    }


    return res.send({})
})

app.listen(4003,()=>{
    console.log('Moderation service running on 4003')
})