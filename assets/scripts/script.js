
let proxy = 'https://cors-anywhere.herokuapp.com/';
let lat;
let lon;
window.onload = function () {

  latLon();

  $("li").on("click", function (event) {
    for (let i = 1; i < 8; i++) {
      $("#day" + i).attr("class", "white-text day invisible")
    }
    $("#" + $(this).attr("data-day")).attr("class", "white-text day")

  })


  $("#formwidth").on("submit", function (event) {
    event.preventDefault();

    let search = $("#search").val();

    $.ajax({
      url: "https://api.opencagedata.com/geocode/v1/json?key=2a2e4cd294074aceaeedaa336caa3426&q=" + search,
      method: "GET"
    }).then(function (data) {
      $("#location").text("");
      $("#location").text(data.results[0].components.city);
      lat = data.results[0].geometry.lat;
      lon = data.results[0].geometry.lng;
      weatherCall(lat, lon)
    }
    )
  })

}
function latLon() {
  getLocation();
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("no geolocation")
    }
  }

  function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(lat, lon)
    weatherCall(lat, lon);
    $.ajax({
      url: "https://api.opencagedata.com/geocode/v1/json?key=2a2e4cd294074aceaeedaa336caa3426&q=" + lat + "," + lon,
      method: "GET"
    }).then(function (data) {
      console.log(data)
      $("#location").text("");
      $("#location").text(data.results[0].components.city);
    }
    )
  }
}
// using cordnates to get weather



function weatherCall(lat, lon) {
  let weatherURL = "https://api.darksky.net/forecast/19d4aef9221d5ce3862530f322baf2bb/" + lat + "," + lon + "?extend=hourly";
  $.ajax({
    url: proxy + weatherURL,
    success: function (data) {
      getForcast(data);
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
        let moonrise = data.moonrise;
        let moonset = data.moonset;

        $("#moonrise" + (i + 1)).text("")
        $("#moonset" + (i + 1)).text("")
        $("#moonrise" + (i + 1)).text("Moonrise: " + moonrise)
        $("#moonset" + (i + 1)).text("Moonset: " + moonset)
      }
    })
  }
}
function getForcast(input) {
  let x = 1;

  for (let i = 0; i < input.hourly.data.length; i++) {
    let day = ["Sunday Night", "Monday Night", "Tuesday Night", "Wednesday Night", "Thursday Night", "Friday Night", "Saturday Night"];
    let unixTimeStamp = input.hourly.data[i].time;
    let date = new Date(unixTimeStamp * 1000);
    let hour = date.getHours();
    let clouds = input.hourly.data[i].cloudCover
    let lat = input.latitude
    let lon = input.longitude
    if (hour == 22) {
      console.log(input.hourly.data[i])
      let displayDate;
      if (x == 1) {

        displayDate = "Tonight"
      } else if (x == 2) {
        displayDate = "Tomorrow Night"
      } else {
        let weekDay = date.getDay();

        displayDate = day[weekDay];
      }
      let newDisplayDay = $("<p>").text(displayDate);

      let conditions = input.hourly.data[i].summary;
      let newConditions = $("<p>").text(conditions);

      let temp = input.hourly.data[i].temperature.toFixed(1);
      let newTemp = $("<p>").text(temp + "° F");

      let icon = input.hourly.data[i].icon;
      let newIcon = $("<img>").text(icon);
      $(".date" + x).text("");
      $("#conditions" + x).text("");
      $("#temp" + x).text("");

      $(".date" + x).append(newDisplayDay);
      $("#conditions" + x).append(newConditions);
      $("#conditions" + x).append(newIcon);
      $("#temp" + x).append(newTemp);
      if (clouds < .25) {
        $("#day" + x).attr("style", "background-size: cover;background-image: url(./assets/images/clear.jpg)")
      } else if (clouds < .6) {
        $("#day" + x).attr("style", "background-size: cover;background-image: url(./assets/images/light.jpg)")
      }
      else {
        $("#day" + x).attr("style", "background-size: cover;background-image: url(./assets/images/cloudy.jpg)")
      }
      $("#stars" + x).on("click", function () {
        let closebutton = $("<button>").attr("onclick", "closeout();");
        closebutton.attr("id", "closeout");
        let icon = $("<img>").attr("src", "./assets/images/times-solid.svg");
        icon.attr("id", "x")
        closebutton.append(icon);
        $("#bigdiv").attr("class", "overlay");
        $("#bigdiv").append(closebutton)
        $("iframe").attr("src", "https://virtualsky.lco.global/embed/index.html?longitude=" + lon + "&latitude=" + lat + "&projection=stereo&constellations=true&constellationlabels=true&magnitude=6&clock=" + date)
      })
      x++;
    }
  }


}

function closeout() {
  $("#bigdiv").attr("class", "invisible");
  $("iframe").attr("src", "");
  $("#closeout").remove();
}



function moonPhase(input) {
  for (let i = 0; i < input.daily.data.length; i++) {
    let moon = input.daily.data[i].moonPhase
    if (moon < .05) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/0.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .20 || moon > .95) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/10.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .30) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/25.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .45) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/40.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .55) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/50.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .70) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/60.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else if (moon < .80) {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/75.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    } else {
      $("#moonphase" + (i + 1)).attr("src", "./assets/images/90.png")
      $("#moonphase" + (i + 1)).attr("height", "150px")
    }

  }
}
