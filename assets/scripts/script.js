
let proxy = 'https://cors-anywhere.herokuapp.com/';
window.onload = function () {

  latLon();

  $("#search").on("click", function (event) {
    event.preventDefault();
    let search = $("#cityName").val();
    
    $.ajax({
      url: "https://api.opencagedata.com/geocode/v1/json?key=2a2e4cd294074aceaeedaa336caa3426&q=" + search,
      method: "GET"
    }).then(function (data) {
      console.log(data)
      let lat = data.results[0].geometry.lat;
      let lon = data.results[0].geometry.lng; 
      weatherCall(lat, lon)
    }
    )
  })

  function latLon() {
    let browserLocationURL = "https://api.ipgeolocation.io/ipgeo?apiKey=046a27f2390c47298644a5a88760ffbb";
    //getting current location cordnates
    $.ajax({
      url: proxy + browserLocationURL,
      success: function (data) {
        console.log(data);
        let lat = data.latitude;
        let lon = data.longitude;
        $("iframe").attr("src", "https://virtualsky.lco.global/embed/index.html?longitude="+lon+"&latitude="+ lat +"&projection=stereo&constellations=true&constellationlabels=true&meteorshowers=true&showdate=false&showposition=false&gridlines_az=true&live=true&az=358.25")

        // using cordnates to get weather
        weatherCall(lat, lon);
      }
    })
  }
}
function weatherCall(lat, lon) {
  let weatherURL = "https://api.darksky.net/forecast/19d4aef9221d5ce3862530f322baf2bb/" + lat + "," + lon;
  $.ajax({
    url: proxy + weatherURL,
    success: function (data) {
      console.log(data);
    }
  })
  for(let i = 0; i<7; i++){
    let date= ""
    if (i == 0){
    date = ""
   }else{
    date = "&date=" + moment().add(i +1, 'days').format().slice(0,10)
  }

   
  let astronomyURL = "https://api.ipgeolocation.io/astronomy?apiKey=046a27f2390c47298644a5a88760ffbb&lat=" + lat + "&long=" + lon + date;
  $.ajax({
    url: proxy + astronomyURL,
    success: function (data) {
      console.log(data);

    }
    })
}
  }
  
