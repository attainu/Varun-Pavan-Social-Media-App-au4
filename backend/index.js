const express = require('express');
const app = express();
const port = 3010;
require('./database/mongo')
app.use(express.json())
app.use(express.urlencoded());
app.use("/", require("./routes/user"));
app.get('/', (req, res) => {
    res.json({
        data: req.body
    })
})
app.listen(port, () => {
    console.log(`Server started at ${port}`)
})