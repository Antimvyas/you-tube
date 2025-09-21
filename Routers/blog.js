const express = require("express");
const { model } = require("mongoose");
const User = require("../Module/user");
const Blog = require("../Module/blog");
const Comment = require("../Module/comment")
const router = express.Router();
const path = require('path');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
    }
})

const upload = multer({ storage: storage })
router.get("/add-new", (req, res) => {
    return res.render("addblog",
        {
            user: req.user
        }
    )
});
router.get("/:id", async (req, res) => {
    try {
        console.log("Route hit with id:", req.params.id);

        const blog = await Blog.findById(req.params.id).populate("createdby");
        console.log("Blog:", blog);

        const comments = await Comment.find({ blogId: req.params.id })
                                      .populate("createdby");
        console.log("Comments:", comments);

        return res.render("blog", {
            user: req.user,
            blog,
            comments
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Server Error");
    }
});

router.post("/comment/:blogId",async(req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdby:req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`)
});

router.post("/", upload.single('coverImage'), async (req, res) => {
    try {
        const { body, title } = req.body;

        const blog = await Blog.create({
            body,
            title,
            createdby: req.user._id,
            coverImage: `/uploads/${req.file.filename}`
        });

        return res.redirect(`/blog/${blog._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


module.exports = router;