//list of locations to initially appear on the map
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
];

var map;
var detroit = {lat: 42.3314, lng: -83.0458};
var infowindow;
var infowindows = [];
var markers = ko.observableArray([]);
var locationsList = ko.observableArray([]);
var contentString = function(data){
  return '<p><b>' + data.name + '</b></br><p>Rating: ' + data.rating + '</br>from foursquare.com</p>' +
    'Wikipedia Info: ' + data.wikiLink + '</br></br>Flickr Photo:</br>' + data.photo;
  };

//call the function to initialize the google map
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
      center: detroit,
      zoom: 12});

    infowindow = new google.maps.InfoWindow();
  //creates markers for all of the locations
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
      initialLocation.marker = marker;
      markers.push(marker);
      //add event listeners to the markers to open the relevant infowindow
      google.maps.event.addListener(marker, 'click', (function(initialLocation) {
        return function() {
          closeAllInfoWindows();
          deselectAll();
          toggleBounce(initialLocation);
          initialLocation.selected(true);
          infowindow.setContent(contentString(initialLocation));
          infowindow.open(map, this);
          infowindows.push(infowindow);
        };
      })(initialLocation));
    }
  }
    createMarker();
}
// error handling here
var googleError = function () {
  $('#map').text("Map could not be loaded");
};

//closes all info windows
var closeAllInfoWindows = function () {
    for (var i = 0; i < infowindows.length; i++){
      infowindows[i].close();
      }
    };

//deselect all items
var deselectAll = function() {
  //this code unselects the previous items
  for (var i = 0; i < locationsList().length; i++){
    var item = locationsList()[i];
    item.selected(false);
    }
  };

//turns off the bounce animation for all of the markers on the map
var toggleBounce = function(place) {
  for (var i = 0; i < locationsList().length; i++){
    locationsList()[i].marker.setAnimation(null);
  }
  place.marker.setAnimation(google.maps.Animation.BOUNCE);
};

//class information for adding Locations to the locationList
var Location = function(data) {
  this.name = data.name;
  this.location = data.location;
  this.selected = ko.observable(false);
};

var ViewModel = function () {
  var self = this;
//intial locations information
  initialLocations.forEach(function(data){
    locationsList.push( (new Location(data)) );
  });

  this.currentLocationMarker = ko.observable( markers() );

  this.locationChange = function(place) {

    deselectAll();
    closeAllInfoWindows();

    place.selected(true);
    self.currentLocationMarker(place.marker);
    toggleBounce(place);
    //opens info window for the selected location
    infowindows.push(infowindow);
    infowindow.setContent(contentString(place));
    infowindow.open(map, self.currentLocationMarker());
  };

//code to make the filter work
  //this reads the text in the box
  this.filter = ko.observable("");
  this.filteredItems = ko.computed( function() {
    //this code reads the filter box text and filters the list and returns a list
    //of locations matching the filter box text
    var filter = self.filter().toLowerCase();
    deselectAll();
    if (!filter) {
      return locationsList();
    } else {
      var filtered = ko.utils.arrayFilter(locationsList(), function(item){
        if(item.name.toLowerCase().indexOf(filter) >= 0){
          return(item);
        }
      });
        return filtered;
      }
  });

  //this function is called as the filter textbox is updated so the markers match
  this.filteredMarkers = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      //if there is no filter, then return the whole list
      return markers();
    } else {
      return ko.utils.arrayFilter(markers(), function(item) {
        if(item.title.toLowerCase().indexOf(filter) >= 0){
          return(item);
        }
      });
    }
  });

  //turns off markers not being filtered, turns on markers that return true
  this.displayMarkers = ko.computed(function() {
    closeAllInfoWindows();
    for( var i = 0; i < markers().length; i++){
      markers()[i].setVisible(false);
    }
    for( i = 0; i < self.filteredMarkers().length; i++){
      self.filteredMarkers()[i].setVisible(true);
    }
  });

//Foursquare AJAX request and add venue to the location information to add
// a rating to the infowindow
  locationsList().forEach(function(item){
    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/explore',
      dataType: 'json',
      data: 'limit=1&ll='+item.location.lat+','+item.location.lng+ '&query=' + item.name +'&client_id=B3Q0KONKTC0PX2F52YNXPOIYYCEN4AH23UNDTNGEYDBJ522S&client_secret=LY2WFGMIRHO5Q2T4XVOCGOZMOFO5NFVBTEOI4WIWBYUCU3O2&v=20160616',
      async: true}).done(function(data) {
        item.rating = data.response.groups[0].items[0].venue.rating + '/10';
      }).fail(function(){
        item.rating = "foursquare data failed to load";
      });
    });

//Wikipedia AJAX request
  locationsList().forEach(function(item){
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + item.name + '&format=json&callback=wikiCallback';
    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      }).done(function(data){
        if (data[3].length >= 1){
          data[3] = data[3][1];
          item.wikiLink = '<a href=' + data[3] + '>' + item.name + '</a>';
        } else if (data[3].length === 0){
          item.wikiLink = "Wikipedia link could not be loaded";
        } 
      }).fail(function(){
        item.wikiLink = "Wikipedia link could not be loaded";
      });
    });

//Flickr API function
/*
Detroit Map
Key:
8bef3d00f541acb443ae9e5caba6123a

Secret:
93ea6962ac8ed600
*/
  locationsList().forEach(function(item){
    var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    $.getJSON( flickerAPI, {
      tags: item.name,
      tagmode: "any",
      format: 'json'
    }).done(function(data){
      var recentPhotoLink = data.items[0].media.m;
      item.photo = '<img src=' + recentPhotoLink + ' alt=' + item.name + '>';
    }).fail(function(){
      item.photo = 'Flickr photo failed to load :('
    });
  });
};

ko.applyBindings(new ViewModel());
