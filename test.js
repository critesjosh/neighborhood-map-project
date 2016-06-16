//Model

  var startLocations = [
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


function Location(data) {
  var self = this;

  self.name = ko.observable(data.name);
  self.location = ko.observable(data.location);
  self.source = ko.observable(data.source);
  self.selected = ko.observable(false);
}

function ViewModel() {
  var self = this;

  self.locationsList = ko.observableArray([]);

  startLocations.forEach( function(data) {
    self.locationsList.push( new Location(data) );
  });

  self.filter = ko.observable(" ");
  var filter = function() {
    var text = self.filter();
    console.log(text)
  }
}

ko.applyBindings( new ViewModel() );



//meetup information
  this.meetupLocations = ko.observableArray([]);

  this.meetupInfo = function(meetupObject) {
    var self = meetupObject;
    var location = self.location();
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

      console.log(self.filteredItems());
      console.log(markers().visible);
      console.log(self.filteredMarkers());

  }
