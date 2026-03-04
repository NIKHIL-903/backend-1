import multer from "multer";


/*
Multer is a middleware used to handle form data
multer saves the files locally in the destination , it also names the file name 
Multer processes both files at a time so if you upload both files of same name , it causes after wards because one file overwrites other
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")  //callback(error, value) 
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})