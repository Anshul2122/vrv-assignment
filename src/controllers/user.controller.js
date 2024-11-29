import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {isValidObjectId} from "mongoose";


const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false});

        return {accessToken, refreshToken}

    } catch (e) {
        throw new ApiError(500, "something went wrong while generating access and refresh tokens.");
    }
}

const registerUser = asyncHandler(async (req, res, next)=>{
    const {email, username, password, role} = req.body;
    if([username, email, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "all fields are required");
    }

    const existingUser = await User.findOne({$or:[{username},{email}]});
    if(existingUser){
        throw new ApiError(400, "User with email or username exists");
    }

    const avatarLocalPath = req.file?.path;
    console.log("avatar local path: ",avatarLocalPath);
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400, "avatar is required");
    }

    const user =  await User.create({
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        role
    });

    const createdUser = await User.findById(user._id).select(("-password -refreshToken"));

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user");
    }
    return res.status(201).json( new ApiResponse(200, createdUser, "user registered successfully!!") );
});

const loginUser = asyncHandler(async (req, res,next) => {
    // get user details from frontend
    const {email, username, password} = req.body;
    // validation - field not empty
    if(!username && !email){
        console.log("this is error")
        throw new ApiError(400, "username or email is required");
    }
    // check your with email or username exists or not
    const user = await User.findOne({$or:[{username},{email}]});
    if(!user){
        console.log("this is error 2");
        throw new ApiError(404, "user does not exists!");
    }
    //password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        console.log("this is error 3");
        throw new ApiError(401, "incorrect password!");
    }

    // assign token(access and refresh token) to user
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    // send token to cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options={
        httpOnly: true,
        secure: true,
    }

    // return response
    return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken",refreshToken).json(new ApiResponse(200,{user:loggedInUser,accessToken:accessToken,refreshToken:refreshToken}, "User logged in successfully!! "));
})

const logOutUser = asyncHandler(async (req, res,next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new : true
        }
    );
    const options={
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, {}, "User logged out successfully!!"));

});

const refreshAccessToken = asyncHandler(async (req, res,next) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized request");
        }
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(decodeToken);
        const user = await User.findById(decodeToken?._id);
        if(!user){
            throw new ApiError(401, "invalid refresh token");
        }

        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401, "refresh token is expired! and used");
        }

        const options={
            httpOnly: true,
            secure: true,
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", newRefreshToken).json(new ApiResponse(200,{accessToken, newRefreshToken},"access token refreshed"));

    } catch (e) {
        console.log(e);
        throw new ApiError(401, e?.message ||"invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res,next) => {
    const{oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "incorrect old password!");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(new ApiResponse(200, "password changed successfully!!"));
})

const getCurrentUser = asyncHandler(async (req, res,next) => {
    return res.status(200).json( new ApiResponse(200, req.user, "user fetched successfully"));
})

const updateAccountDetails = asyncHandler(async (req, res,next) => {
    const { username, email} = req.body;
    if(!username || !email){
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName:username,
                email:email,
            }
        },
        {new :true}
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "account details updated successfully!!"));

})

const updateUserAvatar = asyncHandler(async (req, res,next) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is missing");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "error while uploading avatar");
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set:{
            avatar:avatar.url
        }
    }, {new:true}).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "avatar image updated successfully!!"));
});

const deleteUser = asyncHandler(async (req, res,next)=>{
    const {id} = req.params;
    if(!isValidObjectId(id)){
        throw new ApiError(401, "ID is invalid");
    }
    const user = await User.findByIdAndDelete(id);
    if(!user){
        throw new ApiError(401, "user does not exist");
    }
    return res.status(200).json(new ApiResponse(200, {}, "user deleted successfully"));
})

export {registerUser,  loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, deleteUser}