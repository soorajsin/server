const {
          default: mongoose
} = require("mongoose");
const validator = require("validatorjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "jklknhgfdreswercfghbnjhkilmnjhg";




const userSchema = new mongoose.Schema({
          name: {
                    type: String,
                    required: true
          },
          email: {
                    type: String,
                    unique: true,
                    required: true,
                    validator(value) {
                              if (!validator.isEmail(value)) {
                                        throw new Error('Invalid Email');
                              }
                    }
          },
          password: {
                    type: String,
                    required: true,
                    minlength: 6
          },
          cpassword: {
                    type: String,
                    required: true,
                    minlength: 6
          },
          tokens: [{
                    token: {
                              type: String,
                              required: true
                    }
          }],
          skills: [{
                    type: String,
                    required: true
          }],
          personalInfo: [{
                    birthday: String,
                    age: String,
                    email: String,
                    course: String,
                    phone: String,
                    city: String,
          }],
          education: [{
                    duration: String,
                    course: String,
                    description: String
          }],
          experience: [{
                    duration: String,
                    department: String,
                    description: String
          }],
          service: [{
                    url: String,
                    name: String,
                    description: String
          }],
          project: [{
                    url: String,
                    projectURL: String,
                    name: String,
                    technology: String,
                    description: String
          }],
          certificate: [{
                    certificateIMGURL: String,
                    certificateLiveURL: String,
                    name: String,
                    description: String
          }],
          contact: [{
                    contactImgURL: String,
                    contactURL: String,
                    name: String
          }],
          photo: [{
                    name: String,
                    url: String
          }]


});




//hash password
userSchema.pre('save', async function (next) {
          if (this.isModified('password')) {
                    this.password = await bcrypt.hash(this.password, 12);
                    this.cpassword = await bcrypt.hash(this.cpassword, 12);
          }
          return next();
});


//generate token
userSchema.methods.getSignedToken = async function () {
          try {
                    const token = jwt.sign({
                              _id: this._id
                    }, keysecret);
                    this.tokens = this.tokens.concat({
                              token
                    });
                    await this.save();
                    return token;
          } catch (error) {
                    throw new Error("Failed to generate token");
          }
}


const userdb = mongoose.model("users", userSchema);

module.exports = userdb;