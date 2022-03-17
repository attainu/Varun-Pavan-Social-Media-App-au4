const mongoose = require('mongoose');
const uri = 'mongodb+srv://socialmedia:C$a_3191@social-media-vzeg5.mongodb.net/test?retryWrites=true&w=majority'
// const uri = 'mongodb://localhost:27017/social-media-test'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(res => {
    console.log("connected")
}).catch(err => console.log("error", err))