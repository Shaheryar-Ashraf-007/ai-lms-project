import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    description:{
        type: String,

    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        
    },
    role: {
        type: String,
        enum : ["student" , "educator"],
        required: true
    },

    photoUrl: {
        type: String,
        default: ""
    },

    enrollcources:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]

},{timestamps:true})

// compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema)

export default User