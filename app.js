var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require("path");

// var mongoURL = "mongodb://localhost/url_shortener";
var mongoURL = "mongodb://danny:password@ds157971.mlab.com:57971/yelpcamp"
mongoose.connect(mongoURL);

//create schema
var urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: String,
    shortcut: Number
});

//create model
var Url = mongoose.model("Url", urlSchema);

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/new/:url*", function(req,res){
    //get original url
    var url = req.params.url + req.params['0'];
    
    //regex for url
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    // console.log(url + " " + regex.test(url));
    
    //if valid url save to database
    if(regex.test(url)) {
        var data = {};
        
         //create random number
        var random = Math.floor(Math.random()*9999)
        data.short_url = "https://freecodecampapi-dannynhois.c9users.io/" + random;
        data.shortcut = random;
        data.original_url = url;
        console.log(typeof(data.shortcut));
        
        //save to database
        var url_data = new Url(data);
        
        url_data.save(function(err, urls){
            if(err){
                console.log("There was an error: " + err);
                return err;
                
            } else {
                console.log(urls);
                return res.send({
                    original_url: urls.original_url,
                    short_url: urls.short_url
                });
            }
        })
    
    //not a valid url
    } else {
        return res.send({
                    error: "Wrong url format, make sure you have a valid protocol and real site."
                });
    }
})

//shortcut route
app.get("/:id", function(req,res){
    console.log("shortcut route");
    // var url = "https://freecodecampapi-dannynhois.c9users.io/" + req.params.id;
    Url.findOne({shortcut:Number(req.params.id)}, function(err,webpage){
        if(err){
            console.log(err);
            return res.send({error:"This url is not in the database"});
        } 
        else if (!webpage){
            return res.send({error:"This url is not in the database"});
        } else {
            console.log(webpage);
            return res.redirect(webpage.original_url);
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App started...");
})