import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const isAdmin = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (user.role !== 'Admin') {
        return next(new ApiError('Access denied: Admins only', 403));
    }
    next();
})

const isModerator = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (user.role !== 'Moderator' && user.role !== 'Admin') {
        return next(new ApiError('Access denied: Moderators only', 403));
    }
    next();
})

export {isAdmin, isModerator}