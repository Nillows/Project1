let getLat;
let getLang;
var map;
let Lat;
let Lng;
async function initMap() {
    try {
        const location = await getLocation();
        initialize(location.Lat, location.Lng);
    } catch (error) {
        console.error("Error getting location:", error);
        initialize(40.713955826286025, -74.00390625);  // Defaults to New York City if there's an error
    }
}
async function getLocation() {
    const url = 'https://ip-geo-location4.p.rapidapi.com/?format=json';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '649763c47bmsh14b40453fb9ebccp1e4669jsn5c184d8b6f20',
        'X-RapidAPI-Host': 'ip-geo-location4.p.rapidapi.com'
    }
};
    const response = await fetch(url, options);
    const result = await response.text();
    const obj = JSON.parse(result);
    Lat = obj.location.latitude;
    Lng = obj.location.longitude;
  
  return { Lat, Lng };

}
    function initialize(latitude, longitude) {
    var myLatlng = new google.maps.LatLng(latitude,longitude);
  
    var myOptions = {
       zoom: 8,
       center: myLatlng,
       mapTypeId: google.maps.MapTypeId.ROADMAP
       }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
  
    var marker = new google.maps.Marker({
    draggable: true,
    position: myLatlng, 
    map: map,
    title: "Your location"
    });
  
    google.maps.event.addListener(marker, 'click', function (event) {
    document.getElementById("latbox").value = event.latLng.lat();
    document.getElementById("lngbox").value = event.latLng.lng();
});

google.maps.event.addListener(marker, 'dragend', function (event) {
    getLat = this.getPosition().lat();
    getLang = this.getPosition() .lng();
    // localStorage.setItem("getLat", getLat);
    // localStorage.setItem("getLang", getLang);
    document.getElementById("latbox").value = this.getPosition().lat();
    document.getElementById("lngbox").value = this.getPosition().lng();
    //localStorage.setItem("longit", document.getElementById("lngbox").value)
    // locationFind.setItem("latitude");
    return reverseGeo();
    
});

  
  }
  let cityLocal;
  let targetLan;
  
  
  function reverseGeo() {
    // var cityLat =localStorage.getItem("getLat");
    // var cityLon = localStorage.getItem("getLang");
     fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${getLat}&lon=${getLang}&limit=5&appid=26f0afb86e9cf6226ab49ee5e767a358`)
    .then(function (response){
        return response.json();
    }).then (function (data){
        console.log(data);
        cityLocal = data[0].country;
        document.querySelector("#firstptag").textContent= data[0].name;
        document.querySelector("#secondptag").textContent= cityLocal;
        return getCountry();
    })
    
  }
  let exTar;

  function getCountry() {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "pYyOks18m688CTFInbtsWfh7SklnQvxS");
    
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    fetch(`https://api.apilayer.com/geo/country/code/${cityLocal}`, requestOptions)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
        document.querySelector("#thirdptag").textContent= data[0].name;
        document.querySelector("#fourthptag").textContent=data[0].languages[0].name;
        document.querySelector("#fifthptag").textContent=data[0].capital;
        document.querySelector("#sixthptag").textContent=data[0].population;
        exTar = data[0].currencies[0].code;
        exchange();
        document.querySelector("#seventhptag").textContent=data[0].currencies[0].code;
        targetLan = textContent=data[0].languages[0].iso639_1;
        document.querySelector("#eighthptag").textContent=data[0].languages[0].iso639_1;
    })
}
const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
const translateParagraphs = async () => {
  const inputTexttest = document.querySelector("#transSearch");
  const inputText = inputTexttest.value;
  const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': '437aa4723dmsh8eae8a882ee1508p18ab89jsn2da10d04f34f',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      body: new URLSearchParams({
          q: inputText,
          target:  `${targetLan}`,
          source: 'en'
      })
  };
 


  try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (result.data.translations.length > 0) {
        const translatedText = result.data.translations[0].translatedText;

        const pTarget = document.querySelector("#translatedPop")
        pTarget.textContent = translatedText;
       
    } else {
        console.warn("No translation found.");
    }
} catch (error) {
    console.error(error);
}
};
document.querySelector("#searchBtn").addEventListener("click", translateParagraphs);
function showDes(event) {
    const sections = event.currentTarget;
    // sections.forEach(section => {
        sections.classList.toggle("show-description");
    }


document.querySelectorAll("section").forEach(section => {
    section.addEventListener("click", showDes);
});


async function exchange() {
    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_NKtmTMsXpVnAOBStOLKV1mGWodW5Of23cls4PwcD`)
    .then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data.data);
        document.querySelector("#ninthptag").textContent= data.data[exTar];
    })
}


async function queryInitialMarkerLocation() {
    let location;
    try {
        location = await getLocation();
    } catch (error) {
        console.error("Error getting location:", error);
        // Defaults to New York City if there's an error
        location = { Lat: 40.713955826286025, Lng: -74.00390625 };
    }
    
  
    const myLatlng = new google.maps.LatLng(location.Lat, location.Lng);
    
    getLat = myLatlng.lat();
    getLang = myLatlng.lng();
    
    reverseGeo();  
}

window.onload = queryInitialMarkerLocation;