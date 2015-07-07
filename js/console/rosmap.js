/**
 * @author Raffaello Bonghi raffaello.bonghi@officinerobotiche.it
 */

var ROSMAP = ROSMAP || {
	REVISION: '0.0.1'
};

/**
 * 
 */
ROSMAP.filterImage = function(image) {
	var data = new Array();
	for (var i = 0; i < image.length; i += 4) {
		data.push(image[i]);
	}
	return data;
}

/**
 * 
 */
ROSMAP.Editor = function(options) {
	var that = this;
	options = options || {};
	var ros = options.ros;
	var maptopic = options.topic || '/map';
	var mapeditortopic = options.topic || '/map_editor';
	this.client = options.client || null;
	this.rootObject = options.rootObject || new createjs.Container();
    this.strokeSize = options.strokeSize || 10;//3;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    
    // subscribe to the topic
    this.mapEditorTopic = new ROSLIB.Topic({
        ros : ros,
        name : mapeditortopic,
        messageType : 'nav_msgs/OccupancyGrid',
        //compression : 'png'
    });
    /*
    var init = true;
    
    this.client.on('change', function() {
        if(init) {
            console.log("AAA");
            that.rootObject.addChild(that);
            init = false;
        }
    });
    */
    
    
    
    // internal drawing canvas
    var canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
    
    this.width = this.rootObject.canvas.width;
    this.height = this.rootObject.canvas.height;
    canvas.width = this.width;
    canvas.height = this.height;
	
	// create the bitmap
    createjs.Bitmap.call(this, canvas);
	
    this.oldPt;
    this.oldMidPt;
  
    this.handleMouseMove = function(event) {
        if (!event.primary) { return; }
        var midPt = new createjs.Point(that.oldPt.x + event.stageX >> 1, that.oldPt.y + event.stageY >> 1);
        
        that.context.beginPath();
        that.context.moveTo(midPt.x, midPt.y);
        console.log("OLD [" + that.oldPt.x + "," + that.oldPt.y + "] - MID [" + that.oldMidPt.x + "," + that.oldMidPt.y + "]");
        that.context.quadraticCurveTo(that.oldPt.x, that.oldPt.y, that.oldMidPt.x, that.oldMidPt.y);
        that.context.lineWidth = that.strokeSize;
        that.context.strokeStyle = that.strokeColor;
        that.context.stroke();
        that.context.lineCap = 'round';
        
        /// Update all points
        that.oldPt.x = event.stageX;
		that.oldPt.y = event.stageY;
		that.oldMidPt.x = midPt.x;
		that.oldMidPt.y = midPt.y;
    };
    
	var handleMouseUp = function(event) {
		if (!event.primary) { return; }
		that.rootObject.removeEventListener("stagemousemove", that.handleMouseMove);
		
		var imageData = that.context.getImageData(0, 0, that.width, that.height);
		var data = ROSMAP.filterImage(imageData.data);
		
		if(that.info !== undefined) {
            var map = new ROSLIB.Message({
                
            });
            that.mapEditorTopic.publish(map);
		} else {
		    that.context.clearRect(0, 0, that.width, that.height);
		}
		// GET BITMAP
		// GET ONLY greyscale value
		// Send new map to server ROS

	};
	
	var handleMouseDown = function(event) {
		if (!event.primary) { return; }
		that.oldPt = new createjs.Point(event.stageX, event.stageY);
		that.oldMidPt = that.oldPt.clone();
		that.rootObject.addEventListener("stagemousemove", that.handleMouseMove);
	};
	
	this.rootObject.addEventListener("stagemousedown", handleMouseDown);
	this.rootObject.addEventListener("stagemouseup", handleMouseUp);

	console.log("Load ROSMAP");
	
	this.y -= this.rootObject.canvas.width;
	this.rootObject.addChild(this);
};
ROSMAP.Editor.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 * 
 */
ROSMAP.Editor.prototype.setStroke = function(stroke) {
    this.strokeSize = stroke;
}

/**
 * 
 */
ROSMAP.Editor.prototype.setType = function(type) {
    
}
