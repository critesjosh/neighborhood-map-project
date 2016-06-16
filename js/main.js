//Model

var map;
var detroit = {lat: 42.3314, lng: -83.0458};
var infowindow;
var infowindows = [];
var markers = ko.observableArray([]);

function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
      center: detroit,
      zoom: 12});

  infowindow = new google.maps.InfoWindow();

  function createMarker() {
    for (var i = 0; i < initialLocations.length; i++ ){
      var initialLocation = initialLocations[i];
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
        return function() {
          closeAllInfoWindows();
          infowindow.setContent(name);
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
  this.locationsList = ko.observableArray([]);

//  self.infowindows = [];
//intial locations information
  initialLocations.forEach(function(data){
    self.locationsList.push( (new Location(data, 0)) );
  });

  this.currentLocation = ko.observable( this.locationsList() );

  this.locationChange = function(place) {
    //this code unselects the previous items
    for (var i = 0; i < self.locationsList().length; i++){
      var item = self.locationsList()[i];
      item.selected(false);
    };

    closeAllInfoWindows();

    var name = place.name;
    var location = place.location;
    place.selected(true);
    self.currentLocation(place);
    //opens info window for the selected location
    var infowindow = new google.maps.InfoWindow({
      content: name,
      position: location
    });
    infowindows.push(infowindow);
    infowindow.setContent(name);
    infowindow.open(map, this.currentLocation);
  };

//code to make the filter work
  //this reads the text in the box
  this.filter = ko.observable("");

  this.filteredItems = ko.computed( function() {
    //this code read the filter box and filters the list
    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.locationsList();
    } else {
      var filtered = ko.utils.arrayFilter(self.locationsList(), function(item){
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

    }

//Foursquare AJAX request
/*
self.placesArray().forEach(function(place) {
    $.getJSON('https://api.foursquare.com/v2/venues/'+ detroit + '?client_id=J5B15DIFBQULDELDRC00BET5PTEUKTEFUMFDZ5HAYSY2P33R&client_secret=XIH1G3153DXNXBNSEFUEHFCPTMY0YVAGK5LWGZJQOQFQKLMY&v=20130815&ll=37.7,-122'

});
*/
}
ko.applyBindings(new ViewModel());
