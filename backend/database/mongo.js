const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/social-media-test'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(res => {
    console.log("connected")
}).catch(err => console.log("error", err))