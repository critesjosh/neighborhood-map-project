//Model


var initialOptions = [
  {
    option: 'Meetups',
    meetupsApiData: {}
  },
  {
    option: 'Wikipedia',
    wikipediaApiData: {}
  },
  {
    option: 'Foursquare'
  },
  {
    option: 'Yelp'
  }
]

//Meetup AJAX request
var meetupUrl = "https://api.meetup.com/find/groups?key=1b301d2714a753518795772603ef2e&sign=true&photo-host=public&location=detroit&order=distance&page=10";

$.ajax({
  url: meetupUrl,
  dataType: 'jsonp'
}).done(function(data){
      meetupGroups = data.data;
      console.log(meetupGroups);
      initialOptions.meetupsApiData.push(meetupGroups);
      for (var i = 0; i < meetupGroups.length; i++) {
        var meetupGroup = meetupGroups[i];
      };
    });
console.log(initialOptions.meetupsApiData);

//Wikipedia AJAX request

var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=detroit&format=json&callback=wikiCallback";

$.ajax({
  url: wikiUrl,
  dataType: 'jsonp',
  }).done(function(data){
    initialOptions.wikipediaApiData = data;
  });



var Option = function(data) {
  this.option = ko.observable(data.option);
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
