var ApplicationConstants = require('../constants/ApplicationConstants');
function FeedTable(){

    var columnArray = ApplicationConstants.columnArray;
    var idField = ApplicationConstants.idField;
    var sortField = ApplicationConstants.sortField;
    var headRow;
    var graphCreated = false;
    var sparkLinesData = {};
    
    var messageQueue;

    /**
     * Set the message queue instance
     */
    this.setMessageQueue = function(mq){
        messageQueue = mq;
    }

    /**
     * Create table by reading the column definition array
     */
    this.createTable = function(container){

        var table = document.createElement("table");
        table.className="gridtable";
        table.style.height = "500px";
        
        var thead = document.createElement("thead");
        headRow = document.createElement("tr");
        headRow.style.height = "30px";

        columnArray.forEach(function(el) {
            var th=document.createElement("th");
            th.className = el.field;
            th.appendChild(document.createTextNode(el.name));
            if(el.type){
                th.setAttribute('colType', el.type);
            }
            headRow.appendChild(th);
        });

        thead.appendChild(headRow);
        table.appendChild(thead); 

        tbody = document.createElement("tbody");
        table.appendChild(tbody);    

        container.appendChild(table);
        setInterval(createGraph, 30000);
    }

    /**
     * Function to create or update an row
     */
    this.createOrUpdateRows = function(data){
        var midPrice = calculateMidPrice(data["bestBid"], data["bestAsk"]);
        var row = document.getElementById(data[idField]);
        if(!row){
            createRows(data, midPrice);
        }
        else{
            updateRows(row, data, midPrice);
        }
    }

    /**
     * Function to calculate the mid price
     */
    function calculateMidPrice(bestBid, bestAsk){
        if(!Number.isNaN(bestBid) && !Number.isNaN(bestAsk)){
            return (bestBid + bestAsk)/2;
        }
        return 0;
    }

    /**
     * Function to create individual rows
     * each row is given and id which will be the "name"
     * field from the dataprovider
     */
    var createRows = function(data, midPrice){
      data["midPrice"] = "";
      sparkLinesData[data[idField]] = {};
      sparkLinesData[data[idField]]["data"] = [];
      sparkLinesData[data[idField]]["data"].push(midPrice);
      row = document.createElement("tr");
      var headItems = headRow.childNodes;
      for(var i = 0; i < headItems.length; i++){
          var hItem = headItems[i];
          row.id = data[idField];
          var td = document.createElement("td");
          td.className = hItem.className;
          row.appendChild(td);
          if(hItem.getAttribute("colType") != "sparkline"){
            
            td.appendChild(document.createTextNode(data[hItem.className]));
          }
      };
      sortTable(data, sortField, row, "create");
    }

    /**
     * If the element is already present, we need to update an row
     */
    var updateRows = function(row, data, midPrice){
        sparkLinesData[data[idField]]["data"].push(midPrice);
        //sparkLinesData[data[idField]]["sparkline"].draw(sparkLinesData[data[idField]]["data"]);
        updateData(row, data);
        sortTable(data, sortField, row, "update");
    }

    /**
     * Update the data on an existing row
     */
    function updateData(row,rowData){
        var headItems = headRow.childNodes;
        for(var i = 0; i < headItems.length; i++){
            if(headItems[i].className != "midPrice")
                row.getElementsByClassName(headItems[i].className)[0].innerHTML = rowData[headItems[i].className];
        }
    }

    /**
     * Function to create the sparklines
     */
    function createGraph(td, item ){
        messageQueue.stopUpdate();
        for(var item in sparkLinesData){
            var row = document.getElementById(item);
            if(row){
                var td = row.getElementsByClassName("midPrice")[0];
                if(td.getElementsByClassName("sparklineholder").length == 0){
                    var sparkElement =  document.createElement('span');
                    sparkElement.className = "sparklineholder";
                    var sparkline = new Sparkline(sparkElement);
                    sparkLinesData[item]["sparkline"] = sparkline;
                    td.appendChild(sparkElement);
                }
                if(sparkLinesData[item]["data"])
                    sparkLinesData[item]["sparkline"].draw(sparkLinesData[item]["data"].slice(0));
                sparkLinesData[item]["data"] = [];
            }
        }
       
        graphCreated = true;
        messageQueue.resumeUpdate();
    } 

    /**
     * Function to update teh graphs after each 30 seconds
     * For now, we will only remove one element after every 30 seconds 
     * only if available elements are more than 2
     * TBD - Need to clarify with Elliot
     */
    function updateGraph(){
         for(var item in sparkLinesData){
             if( sparkLinesData[item]){
                sparkLinesData[item]["data"] = [];
             }
        }
    }

    /**
     * 
     * Function to sort the rows in table
     * This is done by comparing the new data's sortfield 
     * with each existing element.
     * If it is less than a particular element, we use insertBefore
     * Else we use insertAdjacentElement to add it to the end of table
     */
    function sortTable(data, prop, tr, op){
        var rows = tbody.getElementsByTagName("TR");
        var row = document.getElementById(data[idField]);
        if(!row){
            row = row ? row[0] : tr;
        }
        var currentRows = tbody.getElementsByClassName(sortField);

        if(!currentRows || currentRows.length == 0){
            tbody.appendChild(tr);
        }
        else{
            var found = false;
            var i;
            for(i = 0; i < currentRows.length; i++){
                var val = parseFloat(currentRows[i].innerHTML);
                if(val && data[sortField]){
                    if(val > data[sortField]){
                        found = true;
                        tbody.insertBefore(row, rows[i]);
                        break;
                    }
                }
            }
            if(!found){
                rows[currentRows.length - 1].insertAdjacentElement('afterend',row);
            }
        }
        messageQueue.remove();
        
    }
}


module.exports = FeedTable;