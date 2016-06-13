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

var meetupLocations = ko.observableArray([]);

var meetupInfo = function(meetupObject) {
  var self = meetupObject;
  var location = self.location();
  console.log(location);
  
};

//find Meetups button
var findMeetups = function() {

//Meetup AJAX request
var meetupUrl = "https://api.meetup.com/find/groups?key=1b301d2714a753518795772603ef2e&sign=true&photo-host=public&location=detroit&order=distance&page=10";

$.ajax({
  url: meetupUrl,
  dataType: 'jsonp'
}).done(function(data){
      meetupGroups = data.data;
      console.log(meetupGroups);
      meetupGroups.forEach(function (data){
        meetupLocations.push( new MeetupLocation (data));
      });
    });

    $("#meetup-locations").show();
}

var hideMeetups = function () {
  console.log('hi');
  $("#meetup-locations").hide();
}

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


var Location = function(data) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.selected = ko.observable(false);
}

var MeetupLocation = function(data) {
  this.source = 'meetup';
  this.name = ko.observable(data.name);
  var latitude = data.lat;
  var longitude = data.lon;
  this.location = ko.observable({'lat': latitude, 'long': longitude});
}

var ViewModel = function (data) {
  var self = this;

//intial locations information
  this.initialLocationsList = ko.observableArray([]);

  initialLocations.forEach(function(data){
    self.initialLocationsList.push( new Location(data) );
  });

  this.currentLocation = ko.observable( this.initialLocationsList() );

  this.locationChange = function(place) {
    var name = place.name();
    var location = place.location();
    self.currentLocation(place);

    var infowindow = new google.maps.InfoWindow({
      content: name,
      position: location
    });

    infowindow.setContent(name);
    infowindow.open(map, this.currentLocation);
  };

  this.selected = function(object) {
    $(object).addClass('selected');
    console.log(object);
  }

//meetup information
//  this.meetupLocationsList = ko.observableArray([]);

}

ko.applyBindings(new ViewModel());
