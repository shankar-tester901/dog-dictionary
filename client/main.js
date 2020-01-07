function getBreedImage(breedName) {
  $("#meaning_Details").html(
    '<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"/>'
  );
  $.ajax({
    type: "POST",
    url: "/server/english_dictionary/getBreedImage",
    contentType: "application/json",
    data: '{"data":"' + breedName + '"}',
    // data: JSON.stringify({
    //   "breed_Details": $('#breed_name').val()
    // }),
    success: function (data) {
      //  alert(data);
      //hide breed_list
      // $('#breed_List').hide();
      $("#meaning_Details").html(data);
    },
    error: function (error) {
      alert("Error is " + error);
    }
  });
}

function getBreeds() {
  // alert('fetching the breeds list ...');
  $.ajax({
    type: "GET",
    url: "/server/english_dictionary/getBreeds",
    contentType: "application/json",
    success: function (data) {
      //    alert(data);
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
      // alert('incoming');
      //   alert(data);
      var myOptions = data;
      var mySelect = $('#myBreeds');
      //  alert(mySelect);
      $('#myBreeds').empty();
      $.each(myOptions, function (val, text) {

        mySelect.append(
          $('<option></option>').val(val).html(text)
        );
      });
      $('#myBreeds').trigger("change");

    },
    error: function (error) {
      alert("The Breed List is not populated yet. Pls click on Get Breeds button to fetch the breeds list - " + error);
    }
  });

}



function OnChange(dropdown) {
  var breedName = $(dropdown).find(":selected").text();
  // alert(breedName);
  getBreedImage(breedName);
}

