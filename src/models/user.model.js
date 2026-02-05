import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import { jwt } from "jsonwebtoken"
const userSchema=new Schema(
    {
        username:{
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required:true,
            trim: true,
            index: true
        },
        avatar:{
            type:  String, // cloudinary 
            required:"true"
        },
        coverImage: {
            type:  String// cloudinary url
        },
        watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
        ],
        password:{
            type: String,
            required:[true,"Password is Required"]
        },
        refreshTokens: {
            type:String
        }
        
    },{
        timeseries:true
    }
)

userSchema.pre("save",async function (next) { //pre hook or middleware
    if(!this.isModified("password"))  return next()
    this.password=await bcrypt.hash(this.password,10)
    next() // tells mongoose I'm done , continue saving
})

// for password verification
userSchema.methods.isPasswordCorrect=async  function (password){
    return await bcrypt.compare(password,this.password) // we hash the typed password and compare with hashed version
}
userSchema.methods.generateAcessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User", userSchema)