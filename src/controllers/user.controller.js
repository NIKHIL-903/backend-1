import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResonse.js";

const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user= await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshTokens= refreshToken // store it in DB

        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
    }
}

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
    const avatarLocalPath=req.files?.avatar[0]?.path;
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage=""
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        const coverImageLocalPath=req.files?.coverImage[0]?.path 
        coverImage=await uploadOnCloudinary(coverImageLocalPath)
    }

    
    // const avatar = await uploadOnCloudinary(avatarLocalPath.replace(/\\/g,"/"))


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

const loginUser= asyncHandler( async (req,res)=>{
    // take login details like username or email , password 
    // check if empty or not or as per format 
    // validate it with existing user data
    // if matched proceed

    const {email,username,password} = req.body
    if(!username || !email){
        throw new ApiError(400,"username or password is required")
    }

    const user = await User.findOne({
        $or: [{username: username},{email: email}]
    })

    if(!user) throw new ApiError(404,"User does not exist")

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid) throw new ApiError(401,"Invalid user credentials")

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await user.findById(user._id).select("-password -refreshToken")

    const options= {
        httpOnly:true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const logoutUser= asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options= {
        httpOnly:true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))
})
export { registerUser, loginUser, logoutUser }
