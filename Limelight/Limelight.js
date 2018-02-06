"use strict";

//var dataActual=[];
var data = [];

var armState;
var harvesterState;
var flipperState;

$(document).ready(function() {

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

});


function onRobotConnection(connected) {
    $('#robotstate').attr("class", connected ? "label label-success" : "label label-danger");
    $('#robotAddress').text(connected ? NetworkTables.getRobotAddress() : "");
}


function onNetworkTablesConnection(connected) {

    if (connected) {
        $("#connectstate").attr("class", "label label-success");

        // clear the table
        $("#nt tbody > tr").remove();

    } else {
        $("#connectstate").attr("class", "label label-danger");
    }
}

function onValueChanged(key, value, isNew) {

    // key thing here: we're using the various NetworkTable keys as
    // the id of the elements that we're appending, for simplicity. However,
    // the key names aren't always valid HTML identifiers, so we use
    // the NetworkTables.keyToId() function to convert them appropriately

    // if (isNew) {
    // 	var tr = $('<tr/>').appendTo($('#nt > tbody:last'));
    // 	$('<td/>').text(key).appendTo(tr);
    // 	$('<td></td>').attr('id', NetworkTables.keyToId(key))
    // 				   .text(value)
    // 				   .appendTo(tr);
    // } else {
    //
    // 	// similarly, use keySelector to convert the key to a valid jQuery
    // 	// selector. This should work for class names also, not just for ids
    // 	$('#' + NetworkTables.keySelector(key)).text(value);
    // }

    
}
