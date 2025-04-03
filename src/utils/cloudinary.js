// This module handles uploading files to Cloudinary.
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File not found:", localFilePath);
            return null;
        }

        // Upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File uploaded successfully
        console.log("File uploaded successfully:", response.url);
        
        // Remove the locally saved temporary file
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Clean up the local file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };