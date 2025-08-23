const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");
const { createTokenfor, validateToken } = require('../Services/auth')
const userSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },

    salt: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.jpg",
    },
    role: {
        type: String,
        enm: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next()
});
userSchema.static("matchpassword", async function (email, password) {
    const user = await this.findOne({ email });
    // console.log("user",user);

    if (!user) throw new Error('User not found');
    const salt = user.salt;
    const hashedPassword = user.password;
    // console.log(hashedPassword);

    const userprovided = createHmac("sha256", salt)
        .update(password)
        .digest('hex');
    // console.log(userprovided);

    if (hashedPassword !== userprovided) throw new Error("Incorrect Password");
    const token = createTokenfor(user);
    //    console.log(token)
    return token;
    // return {...User,passwrod:undefined,salt:undefined}
})
const User = model('User', userSchema);
module.exports = User;