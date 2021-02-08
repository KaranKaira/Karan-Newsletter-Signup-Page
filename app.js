const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); // to render static files like styles.css and images


//  API KEY and List ID not shown

app.get('/',function(req,res){

    console.log('Sending File'); 
    res.sendFile(__dirname + '/signup.html');
});

app.post('/',function(req,res){

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;


    // this user is going to be added in our list
    const data = {
        members:[
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    };


    const jsonData = JSON.stringify(data);

    const url = 'https://us7.api.mailchimp.com/3.0/lists/{list_id}';

    //extra options to make different type of requests

    const options = {
        method : "POST",
        auth : 'KAKA:{api_key}'
    }

    // A type of request initialized (in this case it is a post request bcoz set in options)
   const request =  https.request( url , options ,function(response){


       if(response.statusCode == 200){
           res.sendFile(__dirname + '/success.html');
       }
       else res.sendFile(__dirname + '/failure.html');
       
        response.on('data',function(data){
            
            var responseData = JSON.parse(data);
            console.log(responseData);
        });
        

    });

    request.write(jsonData);
    request.end();  
});


app.post('/failure' , function(req,res){
    res.redirect('/');
});

app.listen( process.env.PORT || 3000,function(){
    console.log("Server Started on 3000");
});

