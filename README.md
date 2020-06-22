# Hyperverge Project
This document has 2 parts, the first part describes how to run the project while the second part is a summary of the basic workflow and the technologies used to create this website.
This is a Portal for Data Annotators to annotate images along with an admin portal to upload a batch
of images for annotation.

### Steps to run the project:
1. Clone the repo
1. Install nodejs and mongoDB on your machine ( MongoDB Should be running on `localhost:27017` which is the default port )
1. Create a .env file in the top level directory which has the following contents `SESSION_SECRET=<your Secret >`
1. Run `npm install` to install all the dependencies from package.json
1. Run `npm run startServer` to start the nodejs server
1. Go to `localhost:4000` the website should be running over there

### The portal has 2 types of users, Administrator and Annotator. and keeping this segregation in mind we have the following pages.
1. Login pages for each type of users.
1. A single registeration page.
1. Dashboard for Annotator.
1. Dashboard for User.

### The mongoDB database has the following collections
1. AnnotatorData - Authentication details for Annotator
1. AdminData - Authentication details for Annotator
1. CurrentImages - Images uploaded by the administrator but not yet annotated. ( imagedata, admin Email, Question )
1. Annotated Images - Images annotated. ( imageData, admin, annotator, Question, Answer )

### The portal has the following features :
1. Sessions are maintained for each user.
1. Passwords are hashed before storage.
1. Authentication and authorisation is implemented. ( Administrator cannot visit the Annotator's dashboard and vice versa )
1. The user cannot visit the login/signup page if they are already logged in.
1. The user's current state is tracked using cookies.
1. Administrator can upload multiple images at once, along with a question.
1. Size of the image is limited to 1MB and the type is limited to jpeg, jpg, png, gif
1. Everything is stored in a mongoDB database.
1. If an image is annotated by a user, none of the other users will be able to see it on their dashboards.
1. One image can only be annotated by 1 user.
1. Image can be rotated both clockwise and anticlockwise, On hitting save after rotation, Annotated Images will contain the rotated image.
1. The annotated image data can be seen using the following postman collection.  
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/58de0b39df70a7a3c113)

### Postman Collection Details :
The postman collection comprises of 2 requests:
1. POST request to http://hyperverge.herokuapp.com/getAnnotatedDataWithImage - This will return a JSON containing
    * Admin who uploaded the image.
    * User who annotated the image
    * The Question and its answer
    * Image Details like title
    * The actual image
2. POST request to http://hyperverge.herokuapp.com/getAnnotatedData - This will return the same data as that of the above request but will not contain the actual image.

### The following software modules were used to create this portal
* MongoDB, NodeJS, Express, Multer, Passportjs, ejs, Jimp
* HTML, CSS, JavaScript, Materialize CSS

### Codebase details
The main code is divided between :
1. app.js: main nodejs-express server, contains all the routes.
1. function-library.js: contains all the helper functions called by the app.js
1. variables.js: contains the static variables like url's and database name
1. public/ :  contains the css and the client side javascript along with downloadable css and javascript files for vendors like bootstrap and materialize css.
1. views/ : contains the main .ejs files for the website, it also has a header and a footer subdirectory

### Future Plans
* Currently the annotated images are just stored in a database, a new page can be added to display the results.
