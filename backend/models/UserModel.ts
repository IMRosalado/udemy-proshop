import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

interface User {
  name: string,
  email: string,
  password: string,
  isAdmin: boolean,
  matchPassword: (enteredPassword:string)=>boolean
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false 
  }
}, {timestamps: true});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model("User", userSchema);
export default User
