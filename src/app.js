const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.middleware");
const app = express();
const githubRoute=require('./routes/github.route')

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());
app.use(express.static('public'));
app.get("/",(_, res) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
  })
app.use('/github',githubRoute)  
app.use(errorHandler);

module.exports=app;