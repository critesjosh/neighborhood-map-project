//Model


var initialLocations = [
  {
    name: 'Belle Isle',
    location: {lat: 42.343252, lng: -82.9745114}
  },
  {
    name: 'The Heidelberg Project',
    location: {lat: 42.358652, lng: -83.0209799}
  },
  {
    name: 'Kings Books',
    location: {lat: 42.3275032, lng: -83.0571634}
  },
  {
    name: 'Detroit Public Library',
    location: {lat: 42.3340067, lng: -83.0468543}
  },
  {
    name: 'Detroit Institute of Arts',
    location: {lat: 42.3594349, lng: -83.0645227}
  }
]

var initialOptions = []

/*//Meetup AJAX request
var meetupUrl = "https://api.meetup.com/find/groups?key=1b301d2714a753518795772603ef2e&sign=true&photo-host=public&location=detroit&order=distance&page=10";

$.ajax({
  url: meetupUrl,
  dataType: 'jsonp'
}).done(function(data){
      meetupGroups = data.data;
      console.log(meetupGroups);
      initialOptions.meetups.push(meetupGroups);
      for (var i = 0; i < meetupGroups.length; i++) {
        var meetupGroup = meetupGroups[i];
      };
    });


//Wikipedia AJAX request

var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=detroit&format=json&callback=wikiCallback";

$.ajax({
  url: wikiUrl,
  dataType: 'jsonp',
  }).done(function(data){
    initialOptions.wikipediaApiData = data;
  });

*/

var Option = function(data) {
  this.option = ko.observable(data.option);
  this.apiList = ko.observableArray(data.apiList);
}

var ViewModel = function () {
  var self = this;

  this.optionList = ko.observableArray([]);

  initialOptions.forEach(function(data){
    self.optionList.push( new Option(data));
  });

  this.currentOption = ko.observable( this.optionList() );

  this.optionChange = function(option) {
   self.currentOption(option);
   console.log(self.currentOption());
 };

}

ko.applyBindings(new ViewModel());
