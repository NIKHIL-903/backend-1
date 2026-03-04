import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResonse.js";

const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend(postman)
    // validation (format, isempty ) etc
    // check if user already exists: check username,email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object (nosql db creates objects) - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    // return response      

    // for data in forms , json
    const {fullName,email,username,password}=req.body  //content in incoming request
    console.log("email:",email);

    if(
        [fullName,email,username,password].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")  
    }
    
    const existedUser=await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }
    console.log(req.files)
    // console.log("avatarLocalPath:", avatarLocalPath)
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")

    const avatarLocalPath=req.files?.avatar[0]?.path;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        const coverImageLocalPath=req.files?.coverImage[0]?.path 
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    }

    
    // const avatar = await uploadOnCloudinary(avatarLocalPath.replace(/\\/g,"/"))
    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    //entry in DB
    const user=await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"  // exceptions
    ) // checking if user created or not and selecting all feilds excepts -{expections}

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
})

export { registerUser }
