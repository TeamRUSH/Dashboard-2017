"use strict";

//var dataActual=[];
var data=[];

var wheel_left_actualRPM;
var wheel_left_requestedRPM;
var wheel_right_actualRPM;
var wheel_right_requestedRPM;

var lineChart;
var requestedVelocity;
var labels = [];
var i = 0;
var recording = false;
var count1 = 1;
var count2 = 1;
var a = 100;
var b = 200;

var chartLabels = ['Time', 'Requested RPMs Left', 'Actual RPMs Left', 'Requested RPMs Right', 'Actual RPMs Right'];

$(document).ready(function(){

	// sets a function that will be called when the websocket connects/disconnects
	NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

	// sets a function that will be called when the robot connects/disconnects
	NetworkTables.addRobotConnectionListener(onRobotConnection, true);

	// sets a function that will be called when any NetworkTables key/value changes
	NetworkTables.addGlobalListener(onValueChanged, true);

	initFromLocalStorage();

	$('#btnSendParms').click(function(){
		sendParms()
	});

	$('#toggleRecording').change(function() {
		count1+=1;
		if(count1 % 2 === 0){
			recording = true;
		}
		else{
			recording = false;
		}
	});
	$('#toggleStreaming').change(function() {

	   if ($(this).prop('checked')) {
			i = 0;
			data = [];
			window.IntervalId = setInterval(function() {

				i = i + 1;

				var y1 = parseInt($("#motor_left_RPM").val());
				var y2 = motor_left_actualRPM;
				var y3 = parseInt($("#motor_right_RPM").val());
				var y4 = motor_right_actualRPM;


				//if (i < 5) { alert(y1 + '   ' + y2 + (i/10.0));}
				data.push([i/10.0, y1, y2, y3, y4]);

				if (i > 120) {
					data.shift();
				}
				if(recording && i % 120 === 0 && i > 0){
	  			saveData();
	  		}
				//file can point to an actual system file or an array
				lineChart.updateOptions( { 'file': data } );
				}, 100);
	   }
	   else {
			clearInterval(window.IntervalId);
	   }
	});

	createchart();
	//NetworkTables.addKeyListener('velocity', onVelocityChanged, true);
	});
	function saveData(){
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth()+1;
		var day = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		var csv = Papa.unparse({
			fields: chartLabels,
			data: data
		});
		var fileName = (year + "-" + month + "-" + day + "_" + hour + "-" + minute + "-" + second + ".csv");
		var prefix = 'data:text/csv;charset=utf-8,';
		var fileData = encodeURI(prefix + csv);
		var link = document.createElement('a');

		link.setAttribute('href', fileData);
		link.setAttribute('download', fileName);
		link.click();
	}

function sendParms() {
	NetworkTables.putValue('/SmartDashboard/motor_left_setRPM', $('#motor_left_RPM').val());  //Find motor setPoint
	NetworkTables.putValue('/SmartDashboard/motor_right_setRPM', $('#motor_right_RPM').val());  //Find motor setPoint
  	//NetworkTables.putValue()

	Lockr.set('motor_left_setRPM', $('#motor_left_RPM').val()); //Find motor setPoint
	Lockr.set('motor_right_setRPM', $('#motor_right_RPM').val()); //Find motor setPoint
}

function initFromLocalStorage() {
	$('#motor_left_RPM').val(Lockr.get('motor_left_setRPM')); //Find motor setPoint
	$('#motor_right_RPM').val(Lockr.get('motor_right_setRPM')); //Find motor setPoint
}

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

	if (isNew) {
		var tr = $('<tr/>').appendTo($('#nt > tbody:last'));
		$('<td/>').text(key).appendTo(tr);
		$('<td></td>').attr('id', NetworkTables.keyToId(key))
					   .text(value)
					   .appendTo(tr);
	} else {

		// similarly, use keySelector to convert the key to a valid jQuery
		// selector. This should work for class names also, not just for ids
		$('#' + NetworkTables.keySelector(key)).text(value);
	}
	if (key == '/SmartDashboard/motor_left_actualRPM') { //Find motor setPoint
		motor_left_actualRPM = Math.abs(parseInt(value));
		//alert(actualRPM);
	}

	if (key == '/SmartDashboard/motor_right_actualRPM') { //Find motor setPoint
		motor_right_actualRPM = Math.abs(parseInt(value));
		//alert(actualRPM);
	}

}


function createchart() {
	lineChart = new Dygraph(document.getElementById("chart"),
							data,
							{
							height: 400,
							width: 950,
							colors: ["rgb(40,220,40)", "rgb(0, 62, 126)", "rgb(40,220,40)", "rgb(254,205,10)"],
							drawPoints: true,
							showRoller: false,
							valueRange: [a, b + (b/20)],
							labels: chartLabels
							});

}
