var EventPipeline = (function () {
    var instance; //prevent modification of "instance" variable
    var message = [];
    var subscriber = [];
    function Singleton() {
        if (instance) {
            return instance;
        }
        instance = this;
        //Singleton initialization code

         this.addMessage = function(msgName, callback){
            message[msgName] = callback;
        }

        this.addSubscriber = function(msgName, subscriberObj){
            if(!subscriber[msgName]){
                subscriber[msgName] = [];
            }
            subscriber[msgName].push(subscriberObj);
        }

        this.callSubscribers = function(msgName, data){
            if(subscriber[msgName] && subscriber[msgName].length > 0){
                let subscriberFunc;
                for(let i = 0; i < subscriber[msgName].length; i++){
                    subscriberFunc = subscriber[msgName][i];
                    subscriberFunc(data);
                }
            }
        }

        this.removeSubscriber = function(msgName){
            subscriber[msgName] = null;
            delete subscriber[msgName];
        }
    }
    //instance accessor
    Singleton.getInstance = function () {
        return instance || new Singleton();
    }

   


    return Singleton;
}());



module.exports = EventPipeline;