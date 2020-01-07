"use strict";
var express = require("express");
var axios = require("axios");


//get the nodejs sdk
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
  // console.log(" when null, word to check is " + hound);

  const requestUrl = "https://dog.ceo/api/breed/" + hound + "/images"

  var temp = "";

  var catalystApp = catalyst.initialize(req);

  axios
    .get(requestUrl)
    .then(function (response) {
      //   console.log("Reponse is " + response);

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
  // console.log(' in getBreedList >>>>> ');
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
      // console.log(queryResult);
      // console.log(queryResult.length);
      var breedNames = [];
      var tempName = '';
      for (var i = 0; i < queryResult.length; i++) {

        tempName = queryResult[i];
        //    console.log('tempName is ----' + tempName.dog_breed.breed_name);
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
      //   console.log('db rows are ' + queryResult.length);
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
