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
    this.strokeSize = options.strokeSize || 1;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);

    // internal drawing canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    /*
    // subscribe to the topic
    this.mapEditorTopic = new ROSLIB.Topic({
        ros : ros,
        name : mapeditortopic,
        messageType : 'nav_msgs/OccupancyGrid',
        //compression : 'png'
    });
    */
    
    var redraw = function(lineWidth) {
        context.beginPath();
        context.lineWidth = lineWidth;
        context.rect(context.lineWidth/2,context.lineWidth/2,canvas.width-context.lineWidth,canvas.height-context.lineWidth);
        context.strokeStyle = createjs.Graphics.getRGB(0, 0, 255);
        context.stroke();
    };
    
    this.client.on('change', function() {

        
        // create the bitmap
        createjs.Bitmap.call(that, canvas);
        
		that.y = -that.height * that.client.currentGrid.scaleX;
		that.scaleX = that.client.currentGrid.scaleX;
		that.scaleY = that.client.currentGrid.scaleX;
		
		that.width = that.client.currentGrid.width;
		that.height = that.client.currentGrid.height;
        canvas.width = that.width/that.scaleX;
        canvas.height = that.height/that.scaleY;
        console.log("W:" + canvas.width + " H:" + canvas.height);
        that.x += that.client.currentGrid.pose.position.x;
        that.y -= that.client.currentGrid.pose.position.y;
        
		//redraw(5);
	    that.rootObject.addChild(that);
    });
    
    // set the size
    this.scaleX = 1;
    this.scaleY = 1;
    this.width = 384;
    this.height = 384;
    //this.width = this.rootObject.canvas.width;
    //this.height = this.rootObject.canvas.height;
    //canvas.width = this.width;
    //canvas.height = this.height;
 
    this.y = -this.rootObject.canvas.height;

    //redraw(5);
	
    var oldPt;
    var oldMidPt;

    
    this.handleMouseMove = function(event) {
        if (!event.primary) { return; }
        var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
		position.x = (position.x - that.x)/that.scaleX;
		position.y = (position.y + that.y)/that.scaleY;
        var midPt = new createjs.Point(oldPt.x + position.x >> 1, oldPt.y + position.y >> 1);
        
        context.beginPath();
        context.moveTo(midPt.x, midPt.y);
        console.log("OLD [" + oldPt.x + "," + oldPt.y + "] - MID [" + oldMidPt.x + "," + oldMidPt.y + "]");
        context.quadraticCurveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
        context.lineWidth = that.strokeSize;
        context.strokeStyle = that.strokeColor;
        context.stroke();
        context.lineCap = 'round';
        
        /// Update all points
        oldPt.x = position.x;
		oldPt.y = position.y;
		oldMidPt.x = midPt.x;
		oldMidPt.y = midPt.y;
    };
    
	var handleMouseUp = function(event) {
		if (!event.primary) { return; }
		that.rootObject.removeEventListener("stagemousemove", that.handleMouseMove);
		
		// GET BITMAP
		// GET ONLY greyscale value
		// Send new map to server ROS
		
		var imageData = context.getImageData(0, 0, that.width*that.scaleX, that.height);
		var data = ROSMAP.filterImage(imageData.data);
		
		if(that.info !== undefined) {
            var map = new ROSLIB.Message({
                
            });
            that.mapEditorTopic.publish(map);
		} else {
		    context.clearRect(0, 0, that.width/that.scaleX, that.height/that.scaleY);
		}
		
	};
	
	var handleMouseDown = function(event) {
		if (!event.primary) { return; }
		var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
		position.x = (position.x - that.x)/that.scaleX;
		position.y = (position.y + that.y)/that.scaleY;
		oldPt = new createjs.Point(position.x, position.y);
		oldMidPt = oldPt.clone();
		that.rootObject.addEventListener("stagemousemove", that.handleMouseMove);
	};
	
	this.rootObject.addEventListener("stagemousedown", handleMouseDown);
	this.rootObject.addEventListener("stagemouseup", handleMouseUp);
	
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
ROSMAP.Editor.prototype.resize = function(width, height) {
    this.scaleX = 1;
	this.scaleY = 1;
    this.width = width;
    this.height = height;
    this.width *= this.scaleX;
    this.height *= this.scaleY;
    
}
