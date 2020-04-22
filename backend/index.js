const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const cors = require('cors');

const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');
const port = 3010;

app.use(cors())
// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

const auth = require('./routes/verify');
require('./database/mongo');


app.use("/users", require("./routes/user"));
app.use("/posts", auth, require("./routes/post"));
app.use("/comments", auth, require("./routes/comment"));

app.get('/', (req, res) => {
    res.json({
        data: req.body
    })
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server started at ${port}`)
});