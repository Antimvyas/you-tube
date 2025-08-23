const express = require("express");
const { model } = require("mongoose");
const User = require("../Module/user");
const Blog = require("../Module/blog")
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