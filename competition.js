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

    armState = NetworkTables.getValue('/SmartDashboard/armDeployed', 'no');
    harvesterState = NetworkTables.getValue('/SmartDashboard/harvesterRunning', 'no');
    flipperState = NetworkTables.getValue('/SmartDashboard/flipperDeployed', 'no');

    if (Object.is(armState,'no')) {
        $(".arm").removeClass('red');
        $(".arm").removeClass('green');
        $(".arm").addClass('yellow');
    } else if (armState) {
        $(".arm").removeClass('green');
        $(".arm").removeClass('yellow');
        $(".arm").addClass('red');
    } else {
        $(".arm").removeClass('red');
        $(".arm").removeClass('yellow');
        $(".arm").addClass('green');
    }
    if (Object.is(harvesterState,'no')) {
        $(".harvester").removeClass('red');
        $(".harvester").removeClass('green');
        $(".harvester").addClass('yellow');
    } else if (harvesterState) {
        $(".harvester").removeClass('green');
        $(".harvester").removeClass('yellow');
        $(".harvester").addClass('red');
    } else {
        $(".harvester").removeClass('red');
        $(".harvester").removeClass('yellow');
        $(".harvester").addClass('green');
    }
    if (Object.is(flipperState,'no')) {
        $(".flipper").removeClass('red');
        $(".flipper").removeClass('green');
        $(".flipper").addClass('yellow');
    } else if (flipperState) {
        $(".flipper").removeClass('green');
        $(".flipper").removeClass('yellow');
        $(".flipper").addClass('red');
    } else {
        $(".flipper").removeClass('red');
        $(".flipper").removeClass('yellow');
        $(".flipper").addClass('green');
    }
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

    if (key == '/SmartDashboard/armDeployed') {
        if (value) {
            $(".arm").removeClass('yellow');
            $(".arm").removeClass('green');
            $(".arm").addClass('red');
        } else {
            $(".arm").removeClass('yellow');
            $(".arm").removeClass('red');
            $(".arm").addClass('green');
        }
    }

    if (key == '/SmartDashboard/harvesterRunning') {
        if (value) {
            $(".harvester").removeClass('yellow');
            $(".harvester").removeClass('green');
            $(".harvester").addClass('red');
        } else {
            $(".harvester").removeClass('yellow');
            $(".harvester").removeClass('red');
            $(".harvester").addClass('green');
        }
    }

    if (key == '/SmartDashboard/flipperDeployed') {
        if (value) {
            $(".flipper").removeClass('yellow');
            $(".flipper").removeClass('green');
            $(".flipper").addClass('red');
        } else {
            $(".flipper").removeClass('yellow');
            $(".flipper").removeClass('red');
            $(".flipper").addClass('green');
        }
    }
}
