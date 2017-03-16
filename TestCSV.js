"use strict";

//var dataActual=[];
var data=[];

var shooter_left_actualRPM;
var shooter_left_requestedRPM;
var shooter_right_actualRPM;
var shooter_right_requestedRPM;

var lineChart;
var requestedVelocity;
var labels = [];
var i = 0;
var recording = false;
var count = 1;

var chartLabels = ['Time', 'Requested RPMs Left', 'Actual RPMs Left', 'Requested RPMs Right', 'Actual RPMs Right', 'P l', 'I l', 'D l', 'P r', 'I r', 'D r'];

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

	$('#toggleStreaming').change(function() {
		count+=1;
		if(count % 2 === 0){
			recording = true;
		}
		else{
			recording = false;
		}
	   if ($(this).prop('checked')) {
			i = 0;
			data = [];
			window.IntervalId = setInterval(function() {

				i = i + 1;

				var y1 = parseInt($("#shooter_left_rpm").val());
				var y2 = shooter_left_actualRPM;
				var y3 = parseInt($("#shooter_right_rpm").val());
				var y4 = shooter_right_actualRPM;
				var pleft = parseInt($('#shooter_left_pGain').val());
				var ileft = parseInt($('#shooter_left_iGain').val());
				var dleft = parseInt($('#shooter_left_pGain').val());
				var pright = parseInt($('#shooter_right_pGain').val());
				var iright = parseInt($('#shooter_right_iGain').val());
				var dright = parseInt($('#shooter_right_pGain').val());

				//if (i < 5) { alert(y1 + '   ' + y2 + (i/10.0));}
				y1 = 34.3;
				y2 = 7;
				y3 = 12;
				y4 = 8.9;
				pleft = 9;
				ileft = 7;
				dleft = 8;
				pright = 9;
				iright = 7;
				dright = 8;
				data.push([i/10.0, y1, y2, y3, y4, pleft, ileft, dleft, pright, iright, dright]);

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
	NetworkTables.putValue('/SmartDashboard/shooter_left_setPoint', $('#shooter_left_rpm').val());
	NetworkTables.putValue('/SmartDashboard/shooter_left_fGain', $('#shooter_left_fGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_left_pGain', $('#shooter_left_pGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_left_iGain', $('#shooter_left_iGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_left_dGain', $('#shooter_left_dGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_right_setPoint', $('#shooter_right_rpm').val());
	NetworkTables.putValue('/SmartDashboard/shooter_right_fGain', $('#shooter_right_fGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_right_pGain', $('#shooter_right_pGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_right_iGain', $('#shooter_right_iGain').val());
	NetworkTables.putValue('/SmartDashboard/shooter_right_dGain', $('#shooter_right_dGain').val());
	NetworkTables.putValue('/SmartDashboard/feederPowerLeft', $('#feederLeft').val());
  NetworkTables.putValue('/SmartDashboard/feederPowerRight', $('#feederRight').val());

	Lockr.set('shooter_left_setPoint', $('#shooter_left_rpm').val());
	Lockr.set('shooter_left_fGain', $('#shooter_left_fGain').val());
	Lockr.set('shooter_left_pGain', $('#shooter_left_pGain').val());
	Lockr.set('shooter_left_iGain', $('#shooter_left_iGain').val());
	Lockr.set('shooter_left_dGain', $('#shooter_left_dGain').val());
	Lockr.set('shooter_right_setPoint', $('#shooter_right_rpm').val());
	Lockr.set('shooter_right_fGain', $('#shooter_right_fGain').val());
	Lockr.set('shooter_right_pGain', $('#shooter_right_pGain').val());
	Lockr.set('shooter_right_iGain', $('#shooter_right_iGain').val());
	Lockr.set('shooter_right_dGain', $('#shooter_right_dGain').val());
	Lockr.set('feederPowerLeft', $('#feederLeft').val());
	Lockr.set('feederPowerRight', $('#feederRight').val());
}

function initFromLocalStorage() {
	$('#shooter_left_rpm').val(Lockr.get('shooter_left_setPoint'));
	$('#shooter_left_fGain').val(Lockr.get('shooter_left_fGain'));
	$('#shooter_left_pGain').val(Lockr.get('shooter_left_pGain'));
	$('#shooter_left_iGain').val(Lockr.get('shooter_left_iGain'));
	$('#shooter_left_dGain').val(Lockr.get('shooter_left_dGain'));
	$('#shooter_right_rpm').val(Lockr.get('shooter_right_setPoint'));
	$('#shooter_right_fGain').val(Lockr.get('shooter_right_fGain'));
	$('#shooter_right_pGain').val(Lockr.get('shooter_right_pGain'));
	$('#shooter_right_iGain').val(Lockr.get('shooter_right_iGain'));
	$('#shooter_right_dGain').val(Lockr.get('shooter_right_dGain'));
	$('#feederLeft').val(Lockr.get('feederPowerLeft'));
	$('#feederRight').val(Lockr.get('feederPowerRight'));
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
	if (key == '/SmartDashboard/shooter_left_actualRPM') {
		shooter_left_actualRPM = Math.abs(parseInt(value));
		//alert(actualRPM);
	}

	if (key == '/SmartDashboard/shooter_right_actualRPM') {
		shooter_right_actualRPM = Math.abs(parseInt(value));
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
							valueRange: [2800, 4400],
							labels: chartLabels
							});

}
