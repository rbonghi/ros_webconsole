/**
 * @author Raffaello Bonghi raffaello.bonghi@officinerobotiche.it
 */

var ROSMAP = ROSMAP || {
	REVISION: '0.0.1'
};

/**
 * 
 */
ROSMAP.square = function(options) {
    options = options || {};
    var map = options.EditorMap;
    var context = options.context;
    var canvas = options.canvas;
    var lineWidth = options.lineWidth;
    
    var width = map.width/map.scaleX;
    var height = map.height/map.scaleY;
    map.context.beginPath();
    map.context.lineWidth = lineWidth;
    map.context.rect(map.context.lineWidth/2, map.context.lineWidth/2, 
                    width-map.context.lineWidth, height-map.context.lineWidth);
    map.context.strokeStyle = createjs.Graphics.getRGB(0, 0, 255);
    map.context.stroke();
};

/**
 * 
 */
ROSMAP.EditorMap = function(options) {
    var that = this;
	options = options || {};
	var currentGrid = options.currentGrid;
	
    // internal drawing canvas
    var canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');

	this.width = currentGrid.width/currentGrid.scaleX;
	this.height = currentGrid.height/currentGrid.scaleY;
    canvas.width = this.width;
    canvas.height = this.height;
    //console.log("W:" + canvas.width + " H:" + canvas.height);

    // create the bitmap
    createjs.Bitmap.call(this, canvas);
    // change Y direction
	this.y = -this.height * currentGrid.scaleX;
	
	this.scaleX = currentGrid.scaleX;
	this.scaleY = currentGrid.scaleY;
	
	this.width *= this.scaleX;
	this.height *= this.scaleY;
    
    this.x += currentGrid.pose.position.x;
    this.y -= currentGrid.pose.position.y;
};
ROSMAP.EditorMap.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 * 
 */
ROSMAP.EditorMap.prototype.getMatrix = function() {
    var imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
    var data = [];
	for (var i = 0; i < imageData.data.length; i += 4) {
		data.push(imageData.data[i]);
	}
	return data;
};

/**
 * 
 */
ROSMAP.EditorMap.prototype.clearMap = function() {
    this.context.clearRect(0, 0, this.width/this.scaleX, this.height/this.scaleY);
};

/**
 * 
 */
ROSMAP.Editor = function(options) {
	var that = this;
	options = options || {};
	var client = options.client || null;
    this.rootObject = options.rootObject || new createjs.Container();
    // Draw information
    this.strokeSize = options.strokeSize || 1;
    this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    /*
    var ros = options.ros;
	var maptopic = options.topic || '/map';
	var mapeditortopic = options.topic || '/map_editor';
    // subscribe to the topic
    this.mapEditorTopic = new ROSLIB.Topic({
        ros : ros,
        name : mapeditortopic,
        messageType : 'nav_msgs/OccupancyGrid',
        //compression : 'png'
    });
    */
    
    // Map information
    var map;
    this.frameBorder = null;
    // Points
    var oldPt;
    var oldMidPt;

    client.on('change', function() {
        console.log("build map");
        // Add frame border
        that.frameBorder = new ROSMAP.EditorMap({
            currentGrid: client.currentGrid
        });
        that.rootObject.addChild(that.frameBorder);
        // Add editor map
        map = new ROSMAP.EditorMap({
            currentGrid: client.currentGrid
        });
        that.rootObject.addChild(map);
    });
    
    var handleMouseMove = function(event) {
        if (!event.primary) { return; }
        var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
		position.x = (position.x - map.x)/map.scaleX;
		position.y = (position.y + map.y)/map.scaleY;
        var midPt = new createjs.Point(oldPt.x + position.x >> 1, oldPt.y + position.y >> 1);
        
        //console.log("OLD [" + oldPt.x + "," + oldPt.y + "] - MID [" + oldMidPt.x + "," + oldMidPt.y + "]");

        map.context.beginPath();
        map.context.moveTo(midPt.x, midPt.y);
        map.context.quadraticCurveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
        map.context.lineWidth = that.strokeSize;
        map.context.strokeStyle = that.strokeColor;
        map.context.stroke();
        map.context.lineCap = 'round';
        /// Update all points
        oldPt.x = position.x;
		oldPt.y = position.y;
		oldMidPt.x = midPt.x;
		oldMidPt.y = midPt.y;
    };
    
	this.handleMouseUp = function(event) {
		if (!event.primary) { return; }
		that.rootObject.removeEventListener("stagemousemove", handleMouseMove);
	};
    
	this.handleMouseDown = function(event) {
		if (!event.primary) { return; }
		var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
		position.x = (position.x - map.x)/map.scaleX;
		position.y = (position.y + map.y)/map.scaleY;
		oldPt = new createjs.Point(position.x, position.y);
		oldMidPt = oldPt.clone();
		that.rootObject.addEventListener("stagemousemove", handleMouseMove);
	};
    
    // Add listener
	this.rootObject.addEventListener("stagemousedown", this.handleMouseDown);
	this.rootObject.addEventListener("stagemouseup", this.handleMouseUp);
};

/**
 * 
 */
ROSMAP.Editor.prototype.enable = function(enable) {
    if(enable) {
        // Draw square
        ROSMAP.square({
            EditorMap: this.frameBorder,
            lineWidth: 5
        });
    	this.rootObject.addEventListener("stagemousedown", this.handleMouseDown);
    	this.rootObject.addEventListener("stagemouseup", this.handleMouseUp);
    } else {
        if(this.frameBorder !== null)
            this.frameBorder.clearMap();
        this.rootObject.removeEventListener("stagemousedown", this.handleMouseDown);
        this.rootObject.removeEventListener("stagemouseup", this.handleMouseDown);
    }
};