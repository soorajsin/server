const express = require("express");
const app = new express();
require("./DB/Connection");
const router = require("./Routers/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 4000 || process.env.PORT;


app.get("/", (req, res) => {
          res.send("<h1>Hello World</h1>");
})


app.use(express.json());
app.use(cookieParser());
app.use(cors({
          origin:["https://client-xi-flax.vercel.app"],
          methods:["POST", "GET"],
          credentials:true
}));
app.use(router);


app.listen(port, () => {
          console.log(`Server is running on ${port}`);
})
