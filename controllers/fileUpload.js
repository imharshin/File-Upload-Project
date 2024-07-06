const File = require("../models/File");
const cloudinary = require('cloudinary').v2
//localfileupload -> handler function

exports.localFileUpload = async (req, res) => {
    try {

        //fetch filefrom request
        const file = req.files.file;
        console.log("FILE AAGYI JEE -> ", file);


        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH-> ", path)

        //add path to the move fucntion
        file.mv(path, (err) => {
            console.log(err);
        });

        //create a successful response
        res.json({
            success: true,
            message: 'Local File Uploaded Successfully',
        });

    }
    catch (error) {
        console.log("Not able to upload the file on server")
        console.log(error);
    }
}

function isFileTypeSupported(fileType, supportedType) {
    return supportedType.includes(fileType);
}
async function uploadFileToClodinary(file, folder, quality) {
    const options = {folder}
    console.log(file.tempFilePath)

    if(quality){
        options.quality = quality
    }

    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
// image upload ka handler 
exports.imageUpload = async (req, res) => {
    try {
        // data fetch 
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);


        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.json({
                success: true,
                message: "File format not supported"
            })
        }

        // file format supported 
        let folder = 'harshin'
        const response = await uploadFileToClodinary(file, folder)
        console.log(response)

        //we have to create entry for Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })


        res.json({
            success: true,
            imageurl:response.secure_url,
            message: "Image Successfully loaded"
        })


    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

//video upload ka handler 

exports.videoUpload = async (req, res) =>{
    try{
         // data fetch 
         const { name, tags, email } = req.body;
         console.log(name, tags, email);

         const file = req.files.videoFile;

        //validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.json({
                success: true,
                message: "File format not supported"
            })
        }

          // file format supported hai
          let folder = 'harshin'
          const response = await uploadFileToClodinary(file, folder)
          console.log(response)

           //db me entry ave karna hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })

        res.json({
            success: true,
            imageurl:response.secure_url,
            message: "Video Successfully loaded"
        })


    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong while uploading video"
        })
    }
}



//image-reduce upload
exports.imageSizeReducer = async (req, res) => {
    try{
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);


        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.json({
                success: true,
                message: "File format not supported"
            })
        }

        // file format supported 
        let folder = 'harshin'
        const response = await uploadFileToClodinary(file, folder, 90)
        console.log(response)

         //we have to create entry for Database
         const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })


        res.json({
            success: true,
            imageurl:response.secure_url,
            message: "Image Successfully loaded"
        })

    }
    catch(err){
        console.log(err)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}