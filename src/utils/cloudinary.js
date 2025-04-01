import { v2 as cloudinay } from 'cloudinary';
import fs from 'fs';

cloudinay.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinay.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file uploaded successfully
        console.log("file uploaded : " , response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        // remove locally saved temporary file
        return null;
    }
}

export { uploadOnCloudinary };