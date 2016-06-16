//Model

var map;
var detroit = {lat: 42.3314, lng: -83.0458};
var infowindow;
var infowindows = [];
var markers = ko.observableArray([]);
var locationsList = ko.observableArray([]);

function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
      center: detroit,
      zoom: 12});

  infowindow = new google.maps.InfoWindow();

  function createMarker() {
    for (var i = 0; i < locationsList().length; i++ ){
      var initialLocation = locationsList()[i];
      var placeLoc = initialLocation.location;
      var marker = new google.maps.Marker({
      map: map,
      position: placeLoc,
      title: initialLocation.name,
      visible: true
      });
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(initialLocation) {
        var name = initialLocation.name;
        var rating = initialLocation.rating;
        return function() {
          closeAllInfoWindows();
          deselectAll();
          initialLocation.selected(true);
          var contentString = '<p><b>' + name + '</b></br><p>Rating: ' + rating + '/10</p>';
          infowindow.setContent(contentString);
          infowindow.open(map, this);
          infowindows.push(infowindow);
        };
      })(initialLocation));

        };
      };

    createMarker();
  }

var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
        return string.substring(0, startsWith.length) === startsWith;
      };

//closes all info windows
var closeAllInfoWindows = function () {
    for (var i = 0; i < infowindows.length; i++){
      infowindows[i].close();
        };
      };
      closeAllInfoWindows();

//deselect all items
deselectAll = function() {
  //this code unselects the previous items
  for (var i = 0; i < locationsList().length; i++){
    var item = self.locationsList()[i];
    item.selected(false);
  };
}

var initialLocations = [
  {
    name: 'Belle Isle',
    location: {lat: 42.343252, lng: -82.9745114},
    source: 'initial',
    visible: 'true'
  },
  {
    name: 'The Heidelberg Project',
    location: {lat: 42.358652, lng: -83.0209799},
    source: 'initial',
    visible: 'true'
  },
  {
    name: 'Kings Books',
    location: {lat: 42.3275032, lng: -83.0571634},
    source: 'initial',
    visible: 'true'
  },
  {
    name: 'Detroit Public Library',
    location: {lat: 42.3340067, lng: -83.0468543},
    source: 'initial',
    visible: 'true'
  },
  {
    name: 'Detroit Institute of Arts',
    location: {lat: 42.3594349, lng: -83.0645227},
    source: 'initial',
    visible: 'true'
  }
]

/*
//Wikipedia AJAX request

var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=detroit&format=json&callback=wikiCallback";

$.ajax({
  url: wikiUrl,
  dataType: 'jsonp',
  }).done(function(data){
    initialOptions.wikipediaApiData = data;
  });
*/

var Location = function(data, comingFrom) {

  this.source = comingFrom;
  this.name = data.name;
  this.location = data.location;
  this.selected = ko.observable(false);
}

var ViewModel = function () {

  var self = this;

//intial locations information
  initialLocations.forEach(function(data){
    locationsList.push( (new Location(data, 0)) );
  });

  this.currentLocation = ko.observable( locationsList() );

  this.locationChange = function(place) {

    deselectAll();

    closeAllInfoWindows();

    var name = place.name;
    var location = place.location;
    var rating = place.rating;
    place.selected(true);
    self.currentLocation(place);
    //opens info window for the selected location
    var contentString = '<p><b>' + name + '</b></br><p>Rating: ' + rating + '/10</p>';
    var infowindow = new google.maps.InfoWindow({
      content: name,
      position: location
    });
    infowindows.push(infowindow);
    infowindow.setContent(contentString);
    infowindow.open(map, this.currentLocation);
  };

//code to make the filter work
  //this reads the text in the box
  this.filter = ko.observable("");

  this.filteredItems = ko.computed( function() {
    //this code read the filter box and filters the list
    var filter = self.filter().toLowerCase();
    deselectAll()
    if (!filter) {
      return locationsList();
    } else {
      var filtered = ko.utils.arrayFilter(locationsList(), function(item){
        return stringStartsWith(item.name.toLowerCase(), filter);
      });
      return filtered;
    };
  });

  //this function is called as the filter textbox is updated to update the markers
  this.filteredMarkers = ko.computed(function() {
      var filter = self.filter().toLowerCase();
        if (!filter) {
          //if there is no filter, then return the whole list
          return markers();
        } else {
          return ko.utils.arrayFilter(markers(), function(item) {
             return stringStartsWith(item.title.toLowerCase(), filter);
               });
              };
    });

    //turns off markers not being filtered, turns on markers that return true
    this.displayMarkers = ko.computed(function() {
      closeAllInfoWindows();
      for( i = 0; i < markers().length; i++){
        markers()[i].setVisible(false);
      };
      for( i = 0; i < self.filteredMarkers().length; i++){
        self.filteredMarkers()[i].setVisible(true);
      }
    });

    this.test = function() {
console.log(locationsList()[0].rating);
    }

//Yelp AJAX stuff

var yelpSearchTerm = ko.observable("");
var yelpSearchLocation = ko.observable("");


/*
API v2.0
Consumer Key	N2ke23vHS5X3ZHlqCiTSSA
Consumer Secret	2UVQ_Kp1txNmCwcZqdej2ZBJCAs
Token	v8qxg-WjwDmfM931BonIGbaMWyxJaUXZ
Token Secret	-BUZf7Jbqbi-XSvdrLdakxdLu0g
*/

this.getYelpData = function() {

  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  var parameters = {
    oauth_consumer_key: 'N2ke23vHS5X3ZHlqCiTSSA',
    oauth_token: 'v8qxg-WjwDmfM931BonIGbaMWyxJaUXZ',
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb'
  }

  var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

  var yelpUrl = "https://api.yelp.com/v2/search?term=food&location=San+Francisco"
  $.ajax({
    url: yelpUrl,
//    url: 'https://api.yelp.com/v2/search?term=' + yelpSearchTerm + '&location=' + yelpSearchLocation + '',
    dataType: 'jsonp',
    cache: true,
    data: parameters
  }).done(function(data){
    console.log(data);
  }).fail(function(){
    $('#yelp-header').text("Yelp results could not be loaded :(");
  });
}


//Foursquare AJAX request
  locationsList().forEach(function(item){
    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/explore',
      dataType: 'json',
      data: 'limit=1&ll='+item.location.lat+','+item.location.lng+ '&query=' + item.name +'&client_id=B3Q0KONKTC0PX2F52YNXPOIYYCEN4AH23UNDTNGEYDBJ522S&client_secret=LY2WFGMIRHO5Q2T4XVOCGOZMOFO5NFVBTEOI4WIWBYUCU3O2&v=20160616',
      async: true}).done(function(data) {
        item.rating = data.response.groups[0].items[0].venue.rating;
    });
  })
/*
this.foursquareSearchTerm = ko.observable("");
this.foursquareSearchLocation = ko.observable("");
var foursquareSearchTerm = this.foursquareSearchTerm();
var foursquareSearchLocation = this.foursquareSearchLocation();

this.getFoursquareData = function(foursquareSearchTerm, foursquareSearchLocation) {
  console.log(foursquareSearchTerm);
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/search?query=' + foursquareSearchTerm + '&near=' + foursquareSearchLocation + '&client_id=B3Q0KONKTC0PX2F52YNXPOIYYCEN4AH23UNDTNGEYDBJ522S&client_secret=LY2WFGMIRHO5Q2T4XVOCGOZMOFO5NFVBTEOI4WIWBYUCU3O2&v=20160616'
  }).done(function(data){
    console.log(data);
  }).fail(function(){
    $('#foursquare-header').text("Fourquare results could not be loaded :(")
  })
}*/

}
ko.applyBindings(new ViewModel());
