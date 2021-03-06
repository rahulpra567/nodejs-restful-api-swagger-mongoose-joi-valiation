
const express = require("express");
const bodyParser = require("body-parser");
const swaggerDocument = require('./swagger.json');
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const mongoose = require('mongoose');
const  fs = require('fs');
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many accounts created from this IP, please try again after a minute"
});


// Router
const todoRouter = require('./routes/todoRoutes');
const indexRouter = require('./routes/authRoutes');

const port = process.env.TOKEN_SERVER_PORT;
const app = express();
app.use(express.json());
const mongoDB = 'mongodb://127.0.0.1/todos';
app.use(limiter);
app.use(morgan("common"));
app.use(helmet({referrerPolicy: false}));

app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));
app.use('/api',indexRouter);
app.use('/api/todos/',todoRouter);


mongoose.connect(mongoDB, {
  useNewUrlParser: true, useUnifiedTopology: true
 }).then(() => {
  app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
}).catch(err => {
   console.log('Could not connect to the database. Exiting now...', err);
   process.exit();
});
