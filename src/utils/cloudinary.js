import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path:`.env` });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        localFilePath = localFilePath.replace(/\\/g, "/");
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type:"auto"});
        console.log("file uploaded on cloudinary!!");
         return response;
    } catch (e) {
        console.log(e);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async (cloudinaryFilePath)=>{
    try {
        if(!cloudinaryFilePath) return null;
        const fileName = cloudinaryFilePath.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(fileName);
        if(!response) {
            console.log("error in response in delete from cloudinary");
        }
        return response;
    } catch (e) {
        console.log("error in deleteFromCloudinary:" ,e);
        return null;
    }
}

export {deleteFromCloudinary, uploadOnCloudinary};