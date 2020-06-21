let url = process.env.MONGODB_URI || "mongodb://localhost:27017";
let database = "hyperverge";
if( process.env.MONGODB_URI ){
    let index = url.lastIndexOf('/');
    let temp = url.substring(0,index);
    database = url.substring(index+1);
}

let images = [];
let vars = {};
vars.url = url;
vars.database = database;
vars.upload = null;
vars.storage = null;
vars.images = images;
vars.currentImagesDB = "currentimages";
vars.annotatedImagesDB = "annotatedimages";
module.exports = vars;