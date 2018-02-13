/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

var FeedTable = require('./site/src/FeedTable/FeedTable.js');
var MessageQueue = require('./site/src/messsageQueue/MessageQueue.js');
var EventPipeline = require('./site/src/eventPipeline/EventPipeline.js');

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

var feedtable = new FeedTable();
var eventPipeline = new EventPipeline();
var messageQueue = new MessageQueue();

function connectCallback() {
  feedtable.setMessageQueue(messageQueue);
  feedtable.createTable( document.getElementById('stomp-status') );
  startPipeline();
  //document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  subscription = client.subscribe("/fx/prices", callback);
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message);
})

/**
 * MessageQueue : To make sure that only one update 
 * happens at a time on the table.
 * All the changes/updates are stored here and updated on the grid one by one
 */


function startPipeline(){
  eventPipeline.addSubscriber("ADD_ROW_TO_TABLE", feedtable.createOrUpdateRows);
}


function callback(evt){
  var quote = JSON.parse(evt.body);
  messageQueue.add(quote);
}







