# dog-dictionary
Serverless Example using Zoho Catalyst . Uses Applogic.

Earlier we had built a Chuck Norris Jokes Applogic app. Check the earlier example.

It did not use much of the Catalyst assets. Let us delve a bit deeper now.

Let us now build an application that not only gets the list of breeds of dogs but also shows us the images of any chosen breed of dog.

Catalyst assets used :-

1. Client

2. Applogic

3. DataStore

4. ZCQL 

So DataStore and ZCQL are the new increments. Woohoo! You are learning really fast!

So let us begin :-

A. Create a project and name it DogDictionary

B. Install the CLI 

C. Create an empty directory called dogdictionary

D. Initialize your project with catalyst login command

E. As we had discussed earlier, this application will have a client and a server, so Select client and App Logic by pressing the space bar and click Enter.  Since we have already created a project ‘DogDictionary’ via the web console earlier, just choose that again.

F. Now, you will be asked for the Client (static content) name. Just choose any name or just click Enter.

G. Then you will be asked for a package name, entry point and author of your App Logic. Here, click Enter so that the default values will be applied. Next, you will be asked to install the required dependencies. Just click Enter which will install the required dependencies as shown below,

H. Now you will find the following inside the dog dictionary folder :-

applogic	catalyst.json	client



I. Inside apologic, you will find a folder dog_dictionary







J. Inside dog_dictionary folder, you will have the following :-

catalyst-config.json

	index.js		

node_modules	

	package-lock.json	package.json









K. Now, let us see what does the client folder hold -



client-package.json

	index.html	

	main.css	

	main.js



The index.html is where you make your client.This time we will split our screen into two halves. In one half, we will get the dog breeds info from the dog.ceo site and populate the database and then fetch that list from the database and show in the left column. 



On the right column, we will auto-load the images of the first dog-breed chosen and then based on the drop-down, we will show images of the other breeds.



Simple enough ? 



 

The logic will be like this -

I click  the Get Breeds button.

This invokes the getBreeds method in the main.js file.

The main.js file invokes the server side  getBreeds()  present in the index.js file present under the applogic folder. Alright ?



So here is the code for the index.html file.


<!DOCTYPE html>

<html>



<head>

  <meta charset="utf-8" />

  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <title>DogDictionaryClient</title>

  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <link rel="stylesheet" type="text/css" media="screen" href="main.css" />

  <script src="https://code.jquery.com/jquery-3.4.1.min.js"> </script>



  <script src="main.js"></script>

</head>



<body onload="getBreedsListFromDB()">



  <div class="row">



   	<div class="column" style="background-color:#DEB887;">

     

	  <button id="getBreeds" name="getBreeds" onclick="getBreeds();return false">Get Breeds</button>



      <div id="breed_List"> </div>





   </div>





    <div class="column" style="background-color:#ffb380;">

    

		  <div class="dropdown">



       					<select id='myBreeds' onchange='OnChange(this);'> </select>

    	  </div>



      <div id="meaning_Details">  </div>

   

 </div>



  </div>





</body>



</html>





So let us look at the above code.

I have added the jquery library

I have also referred the main.js file so that the button action can be invoked in main.js file.


So there is one row inside which we have created 2 columns. 

In the LHS column, as mentioned, we have a button which helps to get the breeds info and populate the database and 

Then show the list of breeds on the LHS column.

In the RHS column, we show the images of the various breeds. In addition, the first breed that is populated on the drop-down, we show the image of the breed automatically.



Now, let us look at the main.js file. This file is the heart of the client operations. So all the client-side magic goes here.



function getBreedImage(breedName) {

  $("#meaning_Details").html(

    '<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"/>'

  );

  $.ajax({

    type: "POST",

    url: "/server/english_dictionary/getBreedImage",

    contentType: "application/json",

    data: '{"data":"' + breedName + '"}',

    success: function (data) {

      $("#meaning_Details").html(data);

    },

    error: function (error) {

      alert("Error is " + error);

    }

  });

}



function getBreeds() {

    $.ajax({

    type: "GET",

    url: "/server/english_dictionary/getBreeds",

    contentType: "application/json",

    success: function (data) {

          $("#breed_List").html(data);

    },

    error: function (error) {

      alert("Error is " + error);

    }

  });

}



function getBreedsListFromDB() {

  $.ajax({

    type: "GET",

    url: "/server/english_dictionary/fetchFromDB",

    contentType: "application/json",

    success: function (data) {

      var myOptions = data;

      var mySelect = $('#myBreeds');

      $('#myBreeds').empty();

      $.each(myOptions, function (val, text) {



        mySelect.append(

          $('<option></option>').val(val).html(text)

        );

      });

      $('#myBreeds').trigger("change");



    },

    error: function (error) {

      alert("Error is " + error);

    }

  });



}







function OnChange(dropdown) {

  var breedName = $(dropdown).find(":selected").text();

  getBreedImage(breedName);

}







Let us look at the above file. 



So let us analyse the flow here.



When we click the Get Breeds button on the client, that button-click triggers the getBreeds method here in main.js.

The main.js file in turn calls the getBreeds method in the server side file, that is , main.js. When the response comes,it populates the data in the breed_List div in the client. Simple, no?





L. Now let us go to the apologic folder.  Now this is the place where you need to install any package that you may need to run your server side code. This is the heart of the operation literally. So anytime you want to add any third-party package for server side, you install it here. If you are using nodejs, you need to install packages here using the nam install —save xyzzy.



A. Create a database table from the web client. Go to DataStore and create a table by the name dog_breed. Add a new column - “name” to it.



So  let us look at what our index.js looks like.





"use strict";

var express = require("express");

var axios = require("axios");



var catalyst = require("zcatalyst-sdk-node");

var app = express();



//If you do not use the following line, then you will never receive any post data

app.use(express.json());



app.post("/getBreedImage", (req, res) => {

  var hound = '';

  hound = req.body.data;

  console.log(" word to check is >>>>>>>>>>>>>>>" + req.body.data);

  if (hound == '') {

    hound = 'hound';

  }



  const requestUrl = "https://dog.ceo/api/breed/" + hound + "/images"



  var temp = "";



  var catalystApp = catalyst.initialize(req);



  axios

    .get(requestUrl)

    .then(function (response) {



      for (var i = 0; i < response.data["message"].length; i++) {



        var show_image = response.data["message"][i];

        var img = "<img src='" + show_image + "' style=width:350px;height:350px; </img>";

        temp =

          temp + "<tr><td><div>" + img + "</div></td></tr>";

      }



      res.send(

        '<p></p><html><body><table style=img-align: center; border="1"><tr><th>This is how I look</th></tr>' +

        temp +

        "</table></body</html>"

      );



    })

    .catch(err => {

      console.log("Error in get  : " + err);

    });

});





app.get('/getBreeds', (req, res) => {

  var catalystApp = catalyst.initialize(req);

  var temp = "";



  const requestUrl = "https://dog.ceo/api/breeds/list/all";





  axios

    .get(requestUrl)

    .then(function (response) {

      var testDump = response.data["message"];



      var keys = Object.keys(testDump);

      for (var i = 0; i < keys.length; i++) {



        var breed = keys[i];

        insertToDB(catalystApp, breed);



        temp = temp + "<tr><td>" + breed + "</td></tr>";

      }

      res.send(

        ' <p></p><html><body><table style=text-align: center; "width:50%" border="1"><tr><th>Breed Name</th></tr>' +

        temp +

        "</table></body</html>"

      );



    });



});



app.get('/fetchFromDB', (req, res) => {

  var catalystApp = catalyst.initialize(req);

  getFromDB(catalystApp).then(breedNames => {

    res.send(breedNames);

  });



});









function getFromDB(catalystApp) {

  //Execute the query by passing the query which in turn returns a promise

  return new Promise((resolve, reject) => {

    let zcql = catalystApp.zcql();

    let zcqlPromise = zcql.executeZCQLQuery("select breed_name from dog_breed");

    zcqlPromise.then(queryResult => {

           var breedNames = [];

      var tempName = '';

      for (var i = 0; i < queryResult.length; i++) {



        tempName = queryResult[i];

               breedNames.push(tempName.dog_breed.breed_name);



      }

      resolve(breedNames);

    }).catch(err => {

      reject(err);

    })

  });

}



function checkDBInsertStatus(catalystApp) {

  return new Promise((resolve, reject) => {

    let zcql = catalystApp.zcql();

    let zcqlPromise = zcql.executeZCQLQuery("select * from dog_breed");

    zcqlPromise.then(queryResult => {

    if (queryResult.length == 0) {

        resolve(queryResult);

      }



    }).catch(err => {

      reject(err);

    })

  });

}



function insertToDB(catalystApp, name) {

  let rowData = {

    breed_name: name

  };



  checkDBInsertStatus(catalystApp).then(queryResult => {



    let datastore = catalystApp.datastore();

    let table = datastore.table("dog_breed");

    let insertPromise = table.insertRow(rowData);

    insertPromise.then(row => {

      console.log('inserted in db now ');

    });

  });





}







module.exports = app;







This is quite interesting. Let us look at it closely.

So first things first.

We are using express and axis packages for this program. So we invoke them.

As we are dealing with Catalyst, we need to have the node sdk of catalyst involved. Hence we add that.


Have a look at the /getBreeds method. We initialise the catalystApp and then we make a GET request to the API exposing

The list of dog breeds.

Once we fetch the breed names, we make a call to insert them into the database by invoking insertToDB method. 

In the insertToDB method, we check if we have already invoked the method or not by using the checkDBInsertStatus method.

The checkDBInsertStatus method, uses ZCQL (Zoho Catalyst Query Language) to directly make a query to database and fetch the length of the table ie to get the number of rows in the dog_breed table. If the length is 0, then we know that we have never 

Populated the table earlier so now we can do that. So we make an insert to the database.



Parallelly, we make the UI response and then send it to the client. The client receives this in the getBreeds method in the main.js file and renders the UI in the breed_List div.



Now, there is another thing that happens as soon as you load the page. The bodyOnLoad method, triggers the getBreedsFromDB(). This in turn invokes the fetchFromDB method in the server. 

The server queries the dog_breed table using ZCQL and then populates the names in the dropdown in the client and also,

The first default select option is triggered. This in turn triggers the getBreedImage() in the client side.

The getBreedImage() triggers the function with the same name on the server side and then it queries the dog.ceo API and fetches the images of the breed and shows it on the RHS of the client.	

Keep in mind that in a server less computing environ, you do not start the server. Hence you need to package the code inside the 

module.exports = app line. This is the most important line else your program will NOT run.





M. Now, before we go trigger-happy, we need to install the various packages that we have used. Remember, we are doing heart-surgery here ;-) so we need to get all the relevant packages. 

So now we need to install packages used in the code here as follows :-

 npm install —save express

 npm install —save axios



N. Now we are ready to run the program.



There are 2 ways of testing this. We can test in live or we can test locally. It often makes sense to test locally so that we can fix the errors if any and then push it to server.





Catalyst serve



This will show us the following -

shankarr-0701@shankarr-0701 dog dictionary % catalyst serve



ℹ server will start at port 3000

ℹ you can test your applogic[dogdictionary] with URL : http://localhost:3000/server/dog_dictionary

ℹ you can test your client[DogDictionaryClient] with URL : http://localhost:3000/app/



So now we can go to http://localhost:3000/app/ and see our creation!

<Take screenshot pls>



So now we see it working in our test setup.



Now let us deploy on the server. Ready?



shankarr-0701@shankarr-0701 dogdictionary % catalyst deploy



ℹ functions(dog_dictionary): URL => https://dogdictionary-698653107.development.zohocatalyst.com/server/dog_dictionary/

✔ functions(dog_dictionary): deploy successful



✔ client: deploy successful

ℹ client: URL => https://dogdictionary-698653107.development.zohocatalyst.com/app/index.html

This will take sometime to respond as deploying on the server takes time. In a little over say 15secs, you will see the following on your screen.



So that is about it. Now, take the client URL that is - https://dogdictionary-698653107.development.zohocatalyst.com/app/index.html



Paste this in a new tab in the browser and .. Voila! Your app is live now./ Do ask your friends to give it a shot and also let us know how this went …. <Add Social Tags here>. So how many dog-breeds did you not know of? Interesting isn’t it ! I knew just 3 breeds.
