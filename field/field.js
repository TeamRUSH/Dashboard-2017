var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "white"
var download = "";
var count = 0;
var xOffset = 0;
var yOffset = 0;
var origxpos = 0;
var origypos = 0;
var fPoint = false; 
var pointArray = new Array();
var screenWidth = 1006;
var screenHeight = 440;
var chartLabels = ["x","y"]
var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
var heightIn = (screenHeight-92);

    function handleMouseDown(e, firstPoint) {
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);    
    var pointPlaced = firstPoint;
    if (mouseX != 132 && pointPlaced == false) {
      $("#downlog").html("First Point Must Be Placed at X = 132");
    } else if (mouseX == 132 && pointPlaced == false) {
      $("#downlog").html("Down: " + 132 + " / " + mouseY + "; first point");
      drawLineTo(132, mouseY);
      fPoint = true;
    } else {
      $("#downlog").html("Down: " + mouseX + " / " + mouseY);
      drawLineTo(mouseX, mouseY);
    }



    // Put your mousedown stuff here

}
/*(154,46) = top left of field
(846,392) = bottom right
692 wide, 343 high


*/

function currentMousePos(e) {
  var x = e.clientX - offsetX;
  var y = e.clientY - offsetY;
  var coor = "Current Position: " + x + " / " + y;
  document.getElementById("currentPos").innerHTML = coor;
    }

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

function drawCurrentMouse(currentX, currentY){
  ctx.fillText(("(" + currentX + " in," + currentY + " in)")  , (currentX), (currentY));
}

function drawLineTo(xpos, ypos){

 // xpos/=1.085;
 // ypos/=1.085;


  
  ctx.lineTo((xpos),(ypos));
  ctx.stroke();
  ctx.moveTo((xpos), (ypos));


    if (count === 0){
      ctx.fillText(("(0 in, 0 in)"), (xpos), (ypos));
      origxpos=xpos;
      origypos=ypos;
      count+=1;
    }
  
    else {
      ctx.fillText(("(" + Math.round((xpos-origxpos)/1.085) + " in, " +
      Math.round((ypos-origypos)/1.085) + " in)"), (xpos), (ypos));
    }

  

  pointArray.push([(Math.round((xpos-xOffset+143.79)*100)/100),
    (-1*Math.round((ypos-heightIn-yOffset+390.95)*100)/100)]);

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
    handleMouseDown(e, fPoint);
});

$("#canvas").mousemove(function (e) {
    currentMousePos(e);
});

$("#nameFile").mousedown(function(){
  download = "test";
});
$("#btnSavePoints").mousedown(function(){
  saveData();
});
