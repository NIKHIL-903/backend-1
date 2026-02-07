import multer from "multer";

// used to accept files from http request and
//store them on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ 
    // storage: storage  below line also same
    storage,
})