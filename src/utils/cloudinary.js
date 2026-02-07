import {v2 as cloudinary} from "cloudinary"
import fs from "fs" // file system : read,write (build in)

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
});


// uploading file on cloudinary 
const uploadOnCloudinary= async (localFilePath)=>{
    try{
        if(!localFilePath) {
            return null // no path
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        }) // returns a resolved value
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary",response.url)
        return response 

    }catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

/*
await key word unwraps the promise 
if resolved : gives value,
if rejected : throws error
*/

export {uploadOnCloudinary}






