/**
 * This will contain all applicatin wide variables used
 * 
 */
var ApplicationConstants = {
    
    /**
     * id field for each element 
     */
    "idField" : "name",
    /**
     * Sort field for the table
     * TBD - Should be an array to handle multiple sort
     */
    "sortField" : "lastChangeAsk",
    /**
     * Used to create table
     */
    "columnArray" : [
        {"name" : "Name", "field" : "name"},
        {"name" : "Best Ask", field : "bestAsk"},
        {"name" : "Best Bid", field : "bestBid"},
        {"name" : "Last Changed Ask Price", field : "lastChangeAsk"},
        {"name" : "Open Ask", field : "openAsk"},
        {"name" : "Open Bid", field : "openBid"},
        {"name" : "Change", field : "midPrice", type : "sparkline"}
    ]
}

module.exports = ApplicationConstants;