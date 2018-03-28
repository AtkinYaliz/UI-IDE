function Provider(channel) {
   this.channel = channel;
   this.subscribers = [];
}
Provider.prototype.subscribe = function(subscriber) {
   this.subscribers.push(subscriber);
   return this;
}
Provider.prototype.unsubscribe = function(subscriber) {
   var index = this.subscribers.findIndex(function(s) { return s === subscriber; });
   if( index > -1) {
      this.subscribers.splice(index, 1);
   }
   return this;
}
Provider.prototype.publish = function() {
   var that = this;
   this.subscribers.forEach(function(subscriber) { 
      console.log(`${subscriber.name} @ ${that.channel}`); 
   });
   return this;
}

function Subscriber(name) {
   this.name = name;
}

var newsProvider = new Provider('news');
var sportsProvider = new Provider('sports');
var econProvider = new Provider('economy');

var john = new Subscriber('John');
var marry = new Subscriber('Marry');
var adam = new Subscriber('Adam');

newsProvider
   .subscribe(adam)
   .subscribe(marry)
   .subscribe(john);
sportsProvider
   .subscribe(john)
   .subscribe(adam);
econProvider.subscribe(john);

newsProvider.publish();
sportsProvider.publish();

newsProvider
   .unsubscribe(marry)
   .unsubscribe(marry);
newsProvider.publish();

