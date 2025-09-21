require('dotenv').config();
const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const app = express();
const blog = require("./Module/blog")
const userRouter = require("./Routers/user");
const blogRouter = require("./Routers/blog");
const { log } = require("console");
const cookieParser = require('cookie-parser');
const { checkforauthentication } = require("./middlewear/authentication");

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('./public')));
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
        console.log(process.env.MONGO_URL)
    })
    .catch((err) => console.log("MongoDB connection error:", err
    ));



app.use(cookieParser());
app.use(checkforauthentication('token'))


app.set("views", path.resolve("./views"))
app.get("/", async (req, res) => {
    try {
        const allblogs = await blog.find({});
        res.render("home", {
            user: req.user || null,
            blogs: allblogs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

app.use('/user', userRouter);
app.use('/blog', blogRouter);
const PORT=process.env.PORT || 8000;
app.listen(PORT, () => console.log("server on the port 8000 "));