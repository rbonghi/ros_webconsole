/**
 * @author Raffaello Bonghi raffaello.bonghi@officinerobotiche.it
 */

var ROSMAP = ROSMAP || {
	REVISION: '0.0.1'
};

ROSMAP.Editor = function(options) {
	var that = this;
	options = options || {};
	//var ros = options.ros;
	this.rootObject = options.rootObject || new createjs.Container();

	// draw the arrow
	this.graphics = new createjs.Graphics();	
    this.oldPt;
    this.oldMidPt;
  
    this.strokeSize = options.strokeSize || 3;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    
    this.handleMouseMove = function(event) {
        if (!event.primary) { return; }
        //var pos_tmp = that.rootObject.globalToRos(event.stageX, event.stageY);
		//var pose = new ROSLIB.Vector3(pos_tmp);
        var midPt = new createjs.Point(that.oldPt.x + event.stageX >> 1, that.oldPt.y + event.stageY >> 1);
        
        that.graphics.setStrokeStyle(that.strokeSize);
        that.graphics.beginStroke(that.strokeColor);
        that.graphics.moveTo(midPt.x, midPt.y);
        
        console.log("OLD [" + that.oldPt.x + "," + that.oldPt.y + "] - MID [" + that.oldMidPt.x + "," + that.oldMidPt.y + "]");
        that.graphics.curveTo(that.oldPt.x, that.oldPt.y, that.oldMidPt.x, that.oldMidPt.y);
        // create the shape
        createjs.Shape.call(that, that.graphics);
        /// Update all points
        that.oldPt.x = event.stageX;
		that.oldPt.y = event.stageY;
		that.oldMidPt.x = midPt.x;
		that.oldMidPt.y = midPt.y;
    };
    
	var handleMouseUp = function(event) {
		if (!event.primary) { return; }
		that.rootObject.removeEventListener("stagemousemove", that.handleMouseMove);
	};
	
	var handleMouseDown = function(event) {
		if (!event.primary) { return; }
		//var pos_tmp = that.rootObject.globalToRos(event.stageX, event.stageY);
		//var pose = new ROSLIB.Vector3(pos_tmp);
		that.oldPt = new createjs.Point(event.stageX, event.stageY);
		that.oldMidPt = that.oldPt.clone();
		that.rootObject.addEventListener("stagemousemove", that.handleMouseMove);
	};
	
	this.rootObject.addEventListener("stagemousedown", handleMouseDown);
	this.rootObject.addEventListener("stagemouseup", handleMouseUp);

	this.color = '#000000';
	this.stroke = 10;
	
	console.log("Load ROSMAP");
	
	this.y = -this.rootObject.canvas.width;
	this.rootObject.addChild(this);
	
};
ROSMAP.Editor.prototype.__proto__ = createjs.Shape.prototype;