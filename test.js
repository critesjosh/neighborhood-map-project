//Model
var locations = [
  {
    name: 'location1'
  },
  {
    name: 'location2'
  },
  {
    name: 'location3'
  }
]

function Location(data) {
  var self = this;

  self.name = ko.observable(data.name);
}

function ViewModel() {
  var self = this;

  self.locationsList = ko.observableArray([]);
  locations.forEach(function(data){
    self.locationsList.push( new Location(data) );
  });

  self.currentLocation = ko.observable( self.locationsList() );

}

ko.applyBindings( new ViewModel() );
