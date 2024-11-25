import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {isValidObjectId} from "mongoose";
import {Note} from "../models/note.model.js";
import {User} from "../models/user.model";

const getNoteById = asyncHandler(async (req, res) => {
    const {noteId} = req.params;
    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Not valid note id");
    }
    const note = await Note.findById(noteId);
    if(!note){
        throw new ApiError(404, "note does not exist");
    }
    return res.status(200).json(new ApiResponse(200, note, "note fetched successfully"));
})

const getUserNotes = asyncHandler(async (req, res,next) => {
    const userId = req.user?._id;
    if(!isValidObjectId(userId)){
        throw new ApiError(401, "userId not valid");
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(401, "user does not exist");
    }
    const notes = await Note.find(userId);

    if(!notes || notes.length === 0){
        throw new ApiError(401, "no notes found.");
    }

    return res.status(200).json( new ApiResponse(200, notes, "user notes fetched successfully!!"));
})

const createNote = asyncHandler(async (req, res,next)=>{
    const {title, description} = req.body;
    if(!title || !description){
        throw new ApiError(401, "title and description required");
    }
    const note = await Note.create({
        title,
        description,
        writer:req.user?._id,
    });

    if(!note){
        throw new ApiError(500, "error while creating note");
    }

    return res.status(201).json(new ApiResponse(200, note, "note created successfully!!"))

})

const updateNote = asyncHandler(async (req, res,next)=>{
    const {noteId} = req.params;
    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "noteId is invalid");
    }
    const {title, description} = req.body;
    if(!title || !description){
        throw new ApiError(400, "updated title and description required");
    }
    const note = await Note.findById(noteId);
    if(!note){
        throw new ApiError(404, "note does not exist");
    }
    if(note.writer!==req.user._id){
        throw new ApiError(403, "You are not allowed to update this video");
    }
    const updatedNote = await Note.findByIdAndUpdate(noteId, {
            $set: {
                title: title,
                description: description,
            }
        }, {new:true});
    return res.status(200).json(new ApiResponse(200, updatedNote, "note updated successfully!!"));
})

const deleteNote = asyncHandler(async (req, res,next)=>{
    const {noteId} = req.params;
    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "noteId is invalid");
    }
    const note = await Note.findById(noteId);
    if(!note){
        throw new ApiError(404, "note does not exist");
    }
    if(note.writer!==req.user._id){
        throw new ApiError(403, "You are not allowed to delete this video");
    }
    const deleteNote = await Note.findByIdAndDelete(note)
    if(!deleteNote){
        throw new ApiError(500, "error while deleting this note");
    }

    return res.status(200).json(new ApiResponse(200, {}, "note Deleted successfully!!"));
});

export {getNoteById, getUserNotes, createNote, updateNote, deleteNote};