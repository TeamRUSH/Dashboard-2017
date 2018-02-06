
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "white"
var download = "";
var xOffset = 0;
var yOffset = 0;
var pointArray = new Array();
var screenWidth = 1006;
var screenHeight = 440;
var chartLabels = ["x","y"]
var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
var heightIn = (screenHeight-92);

    function handleMouseDown(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    $("#downlog").html("Down: " + mouseX + " / " + mouseY);

    // Put your mousedown stuff here

    drawLineTo(mouseX, mouseY);
}
/*(154,46) = top left of field
(846,392) = bottom right
692 wide, 343 high


*/
var events = {
  clicked: false,
};

function update(){
ctx.save();
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.restore();
  }

function drawField(){
  var img=document.getElementById("field");
  ctx.drawImage(img,0,0);
}

ctx.beginPath();
//ctx.moveTo(0,0);

function drawLineTo(xpos, ypos){
  count+=1;
  if(count===1){
    xOffset=xpos;
    yOffset=ypos;
    xOffset/=12.8518519;
    yOffset/=12.8518519;
    xOffset*=12;
    yOffset*=12;
  }
  ctx.lineTo((xpos),(ypos));
  ctx.stroke();
  ctx.moveTo((xpos), (ypos));

  xpos-=154;
  ypos-=46;
  //rounded number = 12.852
  xpos/=12.8518519;
  ypos/=12.8518519;
  xpos*=12;
  ypos*=12;

  pointArray.push([(Math.round((xpos-xOffset+143.79)*100)/100),
    (-1*Math.round((ypos-heightIn-yOffset+390.95)*100)/100)]);


  ctx.fillText(("(" + (Math.round((xpos-xOffset+143.79)*100)/100) + " in, " +
    ((-1*Math.round((ypos-heightIn-yOffset+390.95)*100)/100)) + " in)"),
    (((xpos)*12.8518519/12+154)), ((ypos*12.8518519/12+46)));
}

function logPoints(){
  for(var j=0; j<pointArray.length; j++){
  console.log(pointArray[j]);
}
}

function saveData(){
  var csv = Papa.unparse({
    fields: chartLabels,
    data: pointArray
  });
  var fileName = (download + " point auton.csv");
  var prefix = 'data:text/csv;charset=utf-8,';
  var fileData = encodeURI(prefix + csv);
  var link = document.createElement('a');

  link.setAttribute('href', fileData);
  link.setAttribute('download', fileName);
  link.click();
}

function run(){
	update();
  drawField();
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

run();

$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#nameFile").mousedown(function(){
  download = "test";
});
$("#btnSavePoints").mousedown(function(){
  saveData();
});
