var EventPipeline = require('../eventPipeline/EventPipeline');

/**
 * Each message published will be pushed to the message queue.
 * And then we iterate the queue and give each element to the table
 * to create or update a given row
 */
function MessageQueue(){
    var eventPipeline = new EventPipeline();
    this.queue = [];
    this.queueInProgress = "false";

    /**
     * Function to add messages to queue
     * Once the message is pushed we start to iterate teh queue
     */
    this.add = function(data){
        this.queue.push(data);
        if(this.queueInProgress == "false"){
            this.queueInProgress = "true";
            this.startQueue();
        }
    }

    /**
     * Function to remove the messages from queue
     * Once we have created or updated row in a table
     * we remove that message from queue
     */
    this.remove = function(){
        this.queue.splice(0);
        if(this.queue.length == 0){
            this.queueInProgress = "false";
        }
    }

    /**
     * Function to pause the queue
     * TBD - Needs work
     */
    this.stopUpdate = function(){
        this.queueInProgress = "paused";
    }

    /**
     * Function to resume the queue after it has paused
     */
    this.resumeUpdate = function(){
        this.queueInProgress = this.queue.length > 0 ? "true" : "false";
        this.startQueue();
    }

    /**
     * Iterate on each element in queue and call the subscriber from event EventPipeline
     * 
     */
    this.startQueue = function(){
        var that = this;
        this.queue.forEach(function(element){
            eventPipeline.callSubscribers("ADD_ROW_TO_TABLE", element);
        })
        
    }

  
}

module.exports = MessageQueue;