const { Schema, model } = require("mongoose");
const blogSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    coverImage: {
        type: String,
    },
    body: {
        type: String,
        require: true,
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });
const Blog = model('blog', blogSchema);
module.exports = Blog;
