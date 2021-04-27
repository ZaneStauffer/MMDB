const express = require("express");
const upload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Express Init
/*
MMDB Web App

User should be able to navigate and select images, text, audio, and video. Media should display appropriately.
User should be able to upload files.
User should be able to delete files.
*/

var app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(upload());


// Routes
app.get("/",function(request,response){
    var directory = getDirectory();
    response.render("home", {
        directory: directory
    })
});

app.post("/upload", function(request, response){
    //upload to server and cache
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    }
    var file = request.files.upload;
    const uploadPath = `${__dirname}/data/${file.name}`;
    // Transfer to server
    file.mv(uploadPath, err => {
        if(err){
            return response.status(500).send(err);
        }
        // Update database.json
        var json = getDatabaseJSON();
        var file_type = getFileType(file.name);
        json[file.name] = {
            type : file_type
        }
        console.log(json);
        //Then, we write it
        fs.writeFileSync(`${__dirname}/database.json`, JSON.stringify(json, null, 2));

        response.redirect("/");
    });
});

app.post("/delete/:file", function(request, response){
    //deletes a file and updates database.json
    var deletePath = `${__dirname}/data/${request.params.file}`;
    // Update database.json
    var json = getDatabaseJSON();
    delete json[request.params.file];
    fs.writeFileSync(`${__dirname}/database.json`, JSON.stringify(json, null, 2));
    // Delete
    fs.unlinkSync(deletePath);

    response.send("File deleted!");
});

app.get("/get/:file",function(request,response){
    // Pass file name, get file
    const dataPath = `${__dirname}/data/${request.params.file}`;
    response.sendFile(dataPath);
});

app.get("/directory", function(request, response){
    
});

// Helper functions
function getDatabaseJSON(){
    var data = fs.readFileSync(`${__dirname}/database.json`);
    var json = JSON.parse(data);
    return json;
}
function getFileType(file_name){
    //When given a file name, return the file type
    const text_exts = ['.txt'];
    const image_exts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.tiff', '.psd', '.raw', '.bmp'];
    const audio_exts = ['.mp3','.wav'];
    const video_exts = ['.mp4','.mov','.avi'];
    var ext = path.extname(file_name);

    if(text_exts.includes(ext)){
        return 'text';
    }else if(image_exts.includes(ext)){
        return 'image';
    }
    else if(audio_exts.includes(ext)){
        return 'audio';
    }else if(video_exts.includes(ext)){
        return 'video';
    }else{
        // Error case
        return 'unrecognized';
    }
}

function getDirectory(){
    // Returns list of files in data
    const dataPath =`${__dirname}/data`;
    var list = fs.readdirSync(dataPath);
    return list;
}

// Application
app.listen(port, function () {
    console.log("Started application on port %d", + port);
});