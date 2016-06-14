//Model

var initialLocations = [
  {
    name: 'Belle Isle',
    location: {lat: 42.343252, lng: -82.9745114},
    source: 'initial'
  },
  {
    name: 'The Heidelberg Project',
    location: {lat: 42.358652, lng: -83.0209799},
    source: 'initial'
  },
  {
    name: 'Kings Books',
    location: {lat: 42.3275032, lng: -83.0571634},
    source: 'initial'
  },
  {
    name: 'Detroit Public Library',
    location: {lat: 42.3340067, lng: -83.0468543},
    source: 'initial'
  },
  {
    name: 'Detroit Institute of Arts',
    location: {lat: 42.3594349, lng: -83.0645227},
    source: 'initial'
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

  if (data.location){
    var location = data.location;
  } else {
    var latitude = data.lat;
    var longitude = data.lon;
    location = {'lat': latitude, 'lon': longitude};
  };
  this.source = ko.observable(comingFrom);
  this.name = ko.observable(data.name);
  this.location = ko.observable(location);
  this.selected = ko.observable(false);
}

var ViewModel = function () {
  var self = this;
  this.locationsList = ko.observableArray([]);
  self.infowindows = [];

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

    //closes all info windows
    var closeAllInfoWindows = function () {
      for (var i = 0; i < self.infowindows.length; i++){
        self.infowindows[i].close();
      }
    };
    closeAllInfoWindows();

    var name = place.name();
    var location = place.location();
    place.selected(true);
    self.currentLocation(place);
    //opens info window for the selected location
    var infowindow = new google.maps.InfoWindow({
      content: name,
      position: location
    });
    self.infowindows.push(infowindow);
    infowindow.setContent(name);
    infowindow.open(map, this.currentLocation);
  };

//meetup information
  this.meetupLocations = ko.observableArray([]);

  this.meetupInfo = function(meetupObject) {
    var self = meetupObject;
    var location = self.location();
    console.log(meetupObject);
  };

  this.findMeetups = function() {
  //Meetup AJAX request
    var meetupUrl = "https://api.meetup.com/find/groups?key=1b301d2714a753518795772603ef2e&sign=true&photo-host=public&location=detroit&order=distance&page=10";

    $.ajax({
      url: meetupUrl,
      dataType: 'jsonp'
    }).done(function(data){
      if(self.meetupLocations().length < 10){   //only adds new locations if the function has not yet been called
          meetupGroups = data.data;
          meetupGroups.forEach(function (data){
            self.locationsList.push( new Location (data, 'meetup'));
          });
          meetupGroups.forEach(function (data){
            self.meetupLocations.push( new Location (data, 'meetup'));
          });
        };
        console.log(self.meetupLocations());
      });
        $("#meetup-locations").show();
  }

  this.hideMeetups = function () {
      $("#meetup-locations").hide();
  }
//code to make the filter work
  //this reads the text in the box
  this.filter = ko.observable("");

  this.filteredItems = ko.computed( function() {
    var stringStartsWith = function (string, startsWith) {
      string = string || "";
      if (startsWith.length > string.length)
          return false;
          return string.substring(0, startsWith.length) === startsWith;
        };

    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.locationsList();
    } else {
      var filtered = ko.utils.arrayFilter(self.locationsList(), function(item){
        return stringStartsWith(item.name().toLowerCase(), filter);
      });
      console.log(filtered);
      return filtered;
    };
  });



  //this function is called by the filter button, reading the filterText
  this.filterMarkers = function () {
    }
}

ko.applyBindings(new ViewModel());
