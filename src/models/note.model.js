import mongoose from 'mongoose';


const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        writer:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
);


export const Note = mongoose.model('Note', NoteSchema);