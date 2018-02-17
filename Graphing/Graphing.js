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

var SourceNetTable = 'graphableData';

var pointArray = [];
var seriesArray = [];
var graphableDataArray = [];
var Rainbow = [];
var map = {NameMappings:[]};



var lineChart;
var requestedVelocity;
var labels = [];
var i = 0;
var recording = false;
var count1 = 1;
var count2 = 1;





var chartLabels = [];

$(document).ready(function(){

	// sets a function that will be called when the websocket connects/disconnects
	NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

	// sets a function that will be called when the robot connects/disconnects
	NetworkTables.addRobotConnectionListener(onRobotConnection, true);

	// sets a function that will be called when any NetworkTables key/value changes
	NetworkTables.addGlobalListener(onValueChanged, true);

	initFromLocalStorage();

	mockNetworkTableData();
	loadGraphSelectOptions();

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
//			console.log("clear", data)


			window.IntervalId = setInterval(function() {

				mockNetworkTableData();

				pointArray = [];
				i = i + 1;

				chartLabels = [];
				chartLabels.push('Time');
				chartLabels.push('D right');
				

				var dright = 13;

				pointArray.push(i/10.0);

				pointArray.push(dright);

				seriesArray.forEach(function(element){
					var y = element.value;
//					console.log(y);
					chartLabels.push(element.name);
//					console.log(element);
					pointArray.push(y);
				});

				lineChart.updateOptions({
					labels: chartLabels,
					 file: data
				})
//				console.log(pointArray);

				//if (i < 5) { alert(y1 + '   ' + y2 + (i/10.0));}
				//data push location [x, y, y, y, y, y, y, y, y, y, y, y, y]
				data.push(pointArray);

				if (i > 120) {
					data.shift();
				}
				if(recording && i % 120 === 0 && i > 0){
	  			saveData();
			    }
			  Rainbow = [];
			  for (var t = 0; t < 7; t++) {
				  var randomR = Math.floor(Math.random() * 255);
				  var randomG = Math.floor(Math.random() * 255);
				  var randomB = Math.floor(Math.random() * 255);
				  var myRainbow = "rgb("+randomR.toString() + "," +randomG.toString() + "," +randomB.toString() + ")"; 
				  Rainbow.push(myRainbow); 
			  }  
 

				//file can point to an actual system file or an array
				lineChart.updateOptions( { 'file': data, 'colors': Rainbow} );
				}, 100);

				

	   }
	   else {
			clearInterval(window.IntervalId);
	   }
	});




	createchart();

	$("#dropdown").change(function(){
		// var options = $("#dropdown").selectedOptions;
		// console.log(options);
		seriesArray = [];
		var annoyingArray = $('#dropdown').val();
		annoyingArray.forEach(function (element) {
			console.log(NetworkTables.getValue("/"+ SourceNetTable +"/" + element));
			seriesArray.push({
				name: element,
				value: NetworkTables.getValue("/"+SourceNetTable+"/" + element),
			})
		})

		
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
	NetworkTables.putValue('/SmartDashboard/Minimum', $('#Minimum').val());
	NetworkTables.putValue('/SmartDashboard/Maximum', $('#Maximum').val());
	/* NetworkTables.putValue('/SmartDashboard/option1', $('#option1').val());
	NetworkTables.putValue('/SmartDashboard/option2', $('#option2').val());
	NetworkTables.putValue('/SmartDashboard/option3', $('#option3').val());
	NetworkTables.putValue('/SmartDashboard/option4', $('#option4').val());
	NetworkTables.putValue('/SmartDashboard/option5', $('#option5').val());
	NetworkTables.putValue('/SmartDashboard/option6', $('#option6').val());
	NetworkTables.putValue('/SmartDashboard/option7', $('#option7').val()); */

	Lockr.set('Minimum', $('#Minimum').val());
	Lockr.set('Maximum', $('#Maximum').val());
	Lockr.set('option1', $('#option1').val());
	Lockr.set('option2', $('#option2').val());
	Lockr.set('option3', $('#option3').val());
	Lockr.set('option4', $('#option4').val());
	Lockr.set('option5', $('#option5').val());
	Lockr.set('option6', $('#option6').val());
	Lockr.set('option7', $('#option7').val());
	Lockr.set('map', map);
}

function initFromLocalStorage() {
	$('#Minimum').val(Lockr.get('Minimum'));
	$('#Maximum').val(Lockr.get('Maximum'));
	$('#option1').val(Lockr.get('option1'));
	$('#option2').val(Lockr.get('option2'));
	$('#option3').val(Lockr.get('option3'));
	$('#option4').val(Lockr.get('option4'));
	$('#option5').val(Lockr.get('option5'));
	$('#option6').val(Lockr.get('option6'));
	$('#option7').val(Lockr.get('option7'));
	map = Lockr.get('map');
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
		var pos = key.indexOf('/'+SourceNetTable+'/');
		  if (pos > -1) {  
			//graphableDataArray.push({
			//	name: key.substring(15),
			//	value: value
			graphableDataArray.push(key.substring(15));
			//})
				console.log({key: key, pos: pos});
		}
	} else {

		var pos = key.indexOf('/'+SourceNetTable+'/');
		  if (pos > -1) {
			  var keyName = key.substring(15);
			  var myMapping = {'gName': keyName, 'displayName': ''};
			  map.NameMappings.push(myMapping);
			  // /SmartDashboard/ = 16 for substring, /SmartDashboard/GraphableData/ = 30 for substring
			  var entryFound = false;
			  map.NameMappings.forEach(function(element) {
				  if (keyName == element.gName) {
					  entryFound = true;
				  }
			  })

			  if (!entryFound) {
				  map.NameMappings.push(myMapping);
			  }

			  seriesArray.forEach(function(element){
				if (element.name == keyName) {
					element.value = value;
				}
			});

		  }

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

function mockNetworkTableData() {
	var randomY1 = Math.random() * 17;
	var randomY2 = Math.random() * 12;
	var randomY3 = Math.random() * 6;
	var randomY4 = Math.random() * 8;
	var randomY5 = Math.random() * 17;
	var randomY6 = Math.random() * 9;

	NetworkTables.putValue('/'+SourceNetTable+'/option1', randomY1);
	NetworkTables.putValue('/'+SourceNetTable+'/option2', randomY2);
	NetworkTables.putValue('/'+SourceNetTable+'/option3', randomY3);
	NetworkTables.putValue('/'+SourceNetTable+'/option4', randomY4);
	NetworkTables.putValue('/'+SourceNetTable+'/option5', randomY5);
	NetworkTables.putValue('/'+SourceNetTable+'/option6', randomY6);
}



function loadGraphSelectOptions() {
	for (var i in graphableDataArray) {
		var abcde = '';
		map.NameMappings.forEach(function(element) {
			console.log(element.gName);
			if (element.gName == graphableDataArray[i]) {
				abcde = (element.displayName == '') ? element.gName : element.displayName;
			}
		})
		$("#dropdown").append($('<option>', {
			value: (abcde == '') ? graphableDataArray[i] : abcde,
			text: (abcde == '') ? graphableDataArray[i] : abcde,
			style: "color:rgb[0,0,0]",
		}))
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
							valueRange: [, ],
							labels: chartLabels
							});

}
