/**
 * @author Raffaello Bonghi raffaello.bonghi@officinerobotiche.it
 */

var ROSMAP = ROSMAP || {
	REVISION: '0.0.1'
};

ROSMAP.Editor = function(options) {
	var that = this;
	options = options || {};
	var ros = options.ros;
	this.rootObject = options.rootObject || new createjs.Container();
	
	this.color = '#000000';
	this.stroke = 10;
	this.drawingCanvas = new createjs.Shape();

	this.rootObject.addChild(this.drawingCanvas);
	
	this.handleMouseMove = function(event) {
		if (!event.primary) { return; }
		console.log("Move");
		var midPt = new createjs.Point(that.oldPt.x + event.stageX >> 1, that.oldPt.y + event.stageY >> 1);
		that.drawingCanvas.graphics.clear().setStrokeStyle(that.stroke, 'round', 'round').beginStroke(that.color).moveTo(midPt.x, midPt.y).curveTo(that.oldPt.x, that.oldPt.y, that.oldMidPt.x, that.oldMidPt.y);
		
		that.oldPt.x = event.stageX;
		that.oldPt.y = event.stageY;
	
		that.oldMidPt.x = midPt.x;
		that.oldMidPt.y = midPt.y;
		
		this.rootObject.update();
	};
	
	var handleMouseUp = function(event) {
		if (!event.primary) { return; }
		that.rootObject.removeEventListener("stagemousemove", that.handleMouseMove);
	};
	
	var handleMouseDown = function(event) {
		if (!event.primary) { return; }
		that.oldPt = new createjs.Point(event.stageX, event.stageY);
		that.oldMidPt = that.oldPt.clone();
		console.log("Down");
		that.rootObject.addEventListener("stagemousemove", that.handleMouseMove);
	};
	
	this.rootObject.addEventListener("stagemousedown", handleMouseDown);
	this.rootObject.addEventListener("stagemouseup", handleMouseUp);
	
	console.log("Load ROSMAP");
	
};
//ROSMAP.Editor.prototype.__proto__ = createjs.Bitmap.prototype;