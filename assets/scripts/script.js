
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
        $("iframe").attr("src", "https://virtualsky.lco.global/embed/index.html?longitude=" + lon + "&latitude=" + lat + "&projection=stereo&constellations=true&constellationlabels=true&meteorshowers=true&showdate=false&showposition=false&gridlines_az=true&live=true&az=358.25")

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
      moonPhase(data);
    }
  })
  for (let i = 0; i < 7; i++) {
    let date = ""
    if (i == 0) {
      date = ""
    } else {
      date = "&date=" + moment().add(i + 1, 'days').format().slice(0, 10)
    }


    let astronomyURL = "https://api.ipgeolocation.io/astronomy?apiKey=046a27f2390c47298644a5a88760ffbb&lat=" + lat + "&long=" + lon + date;
    $.ajax({
      url: proxy + astronomyURL,
      success: function (data) {
        console.log(data);
        let moonrise = data.moonrise ;
        let moonset = data.moonset;
        $("#moonrise" + (i +1)).text("Moonrise: " +moonrise)
        $("#moonset" + (i +1)).text("Moonset: " +moonset)
      }
    })
  }
}

function moonPhase(input) {
  for (let i = 0; i < input.daily.data.length; i++) {
    let moon = input.daily.data[i].moonPhase
    if(moon < .05 ){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/0.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon < .20||moon>.95){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/10.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon< .30){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/25.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon<.45){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/40.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon <.55){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/50.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon<.70){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/60.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else if(moon<.80){
      $("#moonphase" + (i+1)).attr("src", "./assets/images/75.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }else{
      $("#moonphase" + (i+1)).attr("src", "./assets/images/90.png")
      $("#moonphase" + (i+1)).attr("height", "200px")
    }

}
}
