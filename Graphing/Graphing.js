"use strict";

//var dataActual=[];
var data=[];

var shooter_left_actualRPM;
var shooter_left_requestedRPM;
var shooter_right_actualRPM;
var shooter_right_requestedRPM;
var item1 = false;
var item2 = false;
var item3 = false;
var item4 = false;
var item5 = false;
var item6 = false;
var item7 = false;


var lineChart;
var requestedVelocity;
var labels = [];
var i = 0;
var recording = false;
var count1 = 1;
var count2 = 1;





var chartLabels = ['Time', 'D right', 'Box1', 'Box2', 'Box3', 'Box4', 'Box5', 'Box6', 'Box7'];

$(document).ready(function(){

	// sets a function that will be called when the websocket connects/disconnects
	NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

	// sets a function that will be called when the robot connects/disconnects
	NetworkTables.addRobotConnectionListener(onRobotConnection, true);

	// sets a function that will be called when any NetworkTables key/value changes
	NetworkTables.addGlobalListener(onValueChanged, true);

	initFromLocalStorage();

	$('#btnSendParms').click(function(){
		zoomGraph(parseInt($("#Minimum").val()), parseInt($("#Maximum").val()))
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

				var y1 = parseInt($("#shooter_left_rpm").val());
				var y2 = shooter_left_actualRPM;
				var y3 = parseInt($("#shooter_right_rpm").val());
				var y4 = shooter_right_actualRPM;
				var pleft = parseInt($('#shooter_left_pGain').val());
				var ileft = parseInt($('#shooter_left_iGain').val());
				var dleft = parseInt($('#shooter_left_pGain').val());
				var pright = parseInt($('#shooter_right_pGain').val());
				var iright = parseInt($('#shooter_right_iGain').val());
				var dright = 13
				var plot1;
				var plot2;
				var plot3;
				var plot4;
				var plot5;
				var plot6;
				var plot7;

				if (item1 == true) {
					plot1 = parseInt($("#option1").val());
					
				} else {
					plot1 = NaN;
				}

				if (item2 == true) {
					plot2 = parseInt($("#option2").val());
				} else {
					plot2 = NaN;
				}

				if (item3 == true) {
					
					plot3 = parseInt($("#option3").val());
				} else {
					plot3 = NaN;
				}

				if (item4 == true) {
					
					plot4 = parseInt($("#option4").val());
				} else {
					plot4 = 0;
				}

				if (item5 == true) {
					
					plot5 = parseInt($("#option5").val());
				} else {
					plot5 = NaN;
				}

				if (item6 == true) {
					
					plot6 = parseInt($("#option6").val());
				} else {
					plot6 = NaN;
				}

				if (item7 == true) {
					
					plot7 = parseInt($("#option7").val());
				} else {
					plot7 = NaN;
				}

				

				//if (i < 5) { alert(y1 + '   ' + y2 + (i/10.0));}
				data.push([i/10.0, dright, plot1, plot2, plot3, plot4, plot5, plot6, plot7]);

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

	$("#dropdown").change(function(){
		var options = $("#dropdown").selectedOptions;
		alert("The text has been changed.");

	//	options.foreach((opt) => {
	//		console.log(opt);
	//	});
	
		if ($("#dropdown").value=="#option1") {
			item1 = true;
		} else {
			item1 = false;
		}
		if ("#dropdown".value=="#option2") {
			item2 = true;
		} else {
			item2 = false;
		}
		if ("#dropdown".value=="#option3") {
			item3 = true;
		} else {
			item3 = false;
		}
		if ("#dropdown".value=="#option4") {
			item4 = true;
		} else {
			item4 = false;
		}
		if ("#dropdown".value=="#option5") {
			item5 = true;
		} else {
			item5 = false;
		}
		if ("#dropdown".value=="#option6") {
			item6 = true;
		} else {
			item6 = false;
		}
		if ("#dropdown".value=="#option7") {
			item7 = true;
		} else {
			item7 = false;
		}
	}); 
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
	NetworkTables.putValue('/SmartDashboard/Minimum', $('#Minimum').val());
	NetworkTables.putValue('/SmartDashboard/Maximum', $('#Maximum').val());
	NetworkTables.putValue('/SmartDashboard/option1', $('#option1').val());
	NetworkTables.putValue('/SmartDashboard/option2', $('#option2').val());
	NetworkTables.putValue('/SmartDashboard/option3', $('#option3').val());
	NetworkTables.putValue('/SmartDashboard/option4', $('#option4').val());
	NetworkTables.putValue('/SmartDashboard/option5', $('#option5').val());
	NetworkTables.putValue('/SmartDashboard/option6', $('#option6').val());
	NetworkTables.putValue('/SmartDashboard/option7', $('#option7').val());

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
	Lockr.set('Minimum', $('#Minimum').val());
	Lockr.set('Maximum', $('#Maximum').val());
	Lockr.set('option1', $('#option1').val());
	Lockr.set('option2', $('#option2').val());
	Lockr.set('option3', $('#option3').val());
	Lockr.set('option4', $('#option4').val());
	Lockr.set('option5', $('#option5').val());
	Lockr.set('option6', $('#option6').val());
	Lockr.set('option7', $('#option7').val());
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
	$('#Minimum').val(Lockr.get('Minimum'));
	$('#Maximum').val(Lockr.get('Maximum'));
	$('#option1').val(Lockr.get('option1'));
	$('#option2').val(Lockr.get('option2'));
	$('#option3').val(Lockr.get('option3'));
	$('#option4').val(Lockr.get('option4'));
	$('#option5').val(Lockr.get('option5'));
	$('#option6').val(Lockr.get('option6'));
	$('#option7').val(Lockr.get('option7'));
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

function zoomGraph(MIN, MAX) {
	lineChart.updateOptions({
		valueRange: [MIN, MAX]
	});
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
							valueRange: [, ],
							labels: chartLabels
							});

}
