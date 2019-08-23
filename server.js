/*
author: Deb
*/

/* 
* The code below is for importing all libraries needed to run the application into the application
*/

const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const parser = require("body-parser");
const crypto = require("crypto");
const mysql = require("mysql");

/*
Innitialise express with the app variable
Express helps us structure a web application to handle
 multiple different http requests at a specific url.
*/

const app = express();
/* save the path to the stalitic files within the cariable html_dir
*/
var html_dir = 'login_system/public/'
/* use morgan in the application so as to show the application logs 
in the console. and keep them short
*/
app.use(morgan("short"));
/*Do not add extentions to the urls
*/
app.use(parser.urlencoded({ extended: false }));

app.use(express.static("./public"));
/*Start a session with the properties below
*/
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialize: true
}));
/*Connect to Mysql database with the properties below
*/
const Connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'registration',
    password: 'testt'
  
  });
/*Route which returns the index.html file
*/
app.get('/', function (req, res) {
    res.sendfile(html_dir + 'index.html');
});
/*Route which returns the register.html file
*/
app.get('/register', function (req, res) {
    res.sendfile(html_dir + 'register.html');
    
});
/*Route which returns the login.html file
*/
app.get('/login', function (req, res) {
    res.sendfile(html_dir + 'login.html')
})
/*Route which posts the details of the registration 
form to the register database
*/
app.post("/userdetails", (req, res) => {
    let object = {
      userid: req.body.userid,
      password: req.body.password,
      name: req.body.name,
      address: req.body.address,
      country: req.body.country,
      zip: req.body.zip,
      mail: req.body.email,
      gender: req.body.gender,
      language: req.body.language,
      about: req.body.about,
      hash:crypto.createHash('md5').update(req.body.password).digest('hex')
    };

    /*Query to insert data into the database
    */
    const querrystring = "INSERT INTO register(userid,password,name,address,country,zip,mail,gender,language,about) VALUES(?,?,?,?,?,?,?,?,?,?)";
    Connection.query(querrystring,
      [
      object.userid,
      object.hash,
      object.name,
      object.address,
      object.country,
      object.zip,
      object.mail,
      object.gender,
      object.language,
      object.about
    ]);
  console.log("All the form inputs are"+ JSON.stringify(object));
  res.redirect("/login")
  res.end();
});
/*route for submitting login details
*/
app.post('/auth', (req, res)=>{
    var name = req.body.username;
    var password  = req.body.password;
    let hash = crypto.createHash('md5').update(req.body.password).digest('hex')

    let querystring = 'SELECT * FROM register WHERE name =? AND password=?'
    if(name && password){
        Connection.query(querystring, [name, hash], (error,results, fields)=>{
            if(results.length>0){
                req.session.loggedin = true;
                req.session.username = name
                res.redirect('/home')
            }else{
                res.send('incorect username and / or password')
            }
            res.end();

        });
    } else{
        res.send('please enter username and password')
    }
    console.log('captured' + name+hash)
    // res.end()
})
/*this application should run on this port 3002
*/
app.listen(3002);
console.log("App running at Port 3002");