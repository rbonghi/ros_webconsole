/**
 * @author Raffaello Bonghi raffaello.bonghi@officinerobotiche.it
 */

var ROSMAP = ROSMAP || {
  REVISION: '0.0.1'
};

ROSMAP.VALUE_OBSTACLE = 100;
ROSMAP.VALUE_FREE_SPACE = 0;
ROSMAP.VALUE_UNKNOWN = -1;

/**
 *
 */
Array.prototype.repeat= function(what, L){
 while(L) this[--L]= what;
 return this;
};

/**
 *
 */
ROSMAP.square = function(options) {
	options = options || {};
	var map = options.EditorMap;
	var color = options.color || 'red';
	var lineWidth = options.lineWidth;

	var width = map.width/map.scaleX;
	var height = map.height/map.scaleY;
	map.context.beginPath();
	map.context.lineWidth = lineWidth;
	map.context.rect(map.context.lineWidth/2, map.context.lineWidth/2,
	width-map.context.lineWidth, height-map.context.lineWidth);
	map.context.strokeStyle = color;
	map.context.stroke();
};

/**
 *
 */
ROSMAP.EditorMap = function(options) {
	options = options || {};
	var rootObject = options.rootObject;
	var currentGrid = options.currentGrid;

	// internal drawing canvas
	var canvas = document.createElement('canvas');
	this.context = canvas.getContext('2d');

  if (typeof currentGrid.width !== 'undefined') {
		this.width = currentGrid.width/currentGrid.scaleX;
		this.height = currentGrid.height/currentGrid.scaleY;
	} else {
		this.width = rootObject.canvas.width;
		this.height = rootObject.canvas.height;
	}
	canvas.width = this.width;
	canvas.height = this.height;

	// create the bitmap
	createjs.Bitmap.call(this, canvas);
	// change Y direction
	this.y = -this.height * currentGrid.scaleX;

	this.scaleX = currentGrid.scaleX;
	this.scaleY = currentGrid.scaleY;

	this.width *= this.scaleX;
	this.height *= this.scaleY;
  if (typeof currentGrid.width !== 'undefined') {
		this.x += currentGrid.pose.position.x;
		this.y -= currentGrid.pose.position.y;
	}
};
ROSMAP.EditorMap.prototype.__proto__ = createjs.Bitmap.prototype;

/**
 *
 */
ROSMAP.EditorMap.prototype.getMatrix = function() {

  var widthPX = this.width/this.scaleX;
  var heightPX = this.height/this.scaleY;
  // Get image matrix
	var imageData = this.context.getImageData(0, 0, widthPX, heightPX);
	var data = [];
  // Flip map matrix on y axis
  for (var y = heightPX; y > 0; y--) {
    for (var x = 0; x < widthPX; x++) {
      var i = (widthPX*y + x) * 4;
    // Check if alpha value is zero
      if(imageData.data[i + 3] === 0) {
        data.push(ROSMAP.VALUE_UNKNOWN);
      } else {
    		switch(imageData.data[i]) {
    			// Obstacle
    			case 0:
    				data.push(ROSMAP.VALUE_OBSTACLE);
    				break;
    			// Free space
    			case 255:
    				data.push(ROSMAP.VALUE_FREE_SPACE);
    				break;
    			// Unknown
    			default:
    				data.push(ROSMAP.VALUE_UNKNOWN);
    				break;
    		}
      }
    }
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
 * Build a map editor
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * client - The occupancy Grid client
 *   * topic (optional) - the map meta data topic to listen to
 *   * rootObject (optional) - the root object to add this marker to
 *   * strokeSize (optional) - stroke for the pen editor
 *   * strokeColor (optional) - Color for the pen
 */
ROSMAP.Editor = function(options) {
  var that = this;
  options = options || {};
  var client = options.client || null;
  var ros = options.ros;
  var mapeditortopic = options.topic || '/map_editor';
  var start_index = options.index || 0;
  this.rootObject = options.rootObject || new createjs.Container();
  // Draw information
  this.strokeSize = options.strokeSize || 1;
  this.strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);

  // subscribe to the topic
  var mapEditorTopic = new ROSLIB.Topic({
    ros : ros,
    name : mapeditortopic,
    messageType : 'nav_msgs/OccupancyGrid',
    //compression : 'png'
  });
  var map_message = new ROSLIB.Message({
	  header : {
	    seq: 0,
	    stamp : {secs : 0, nsecs : 100},
	    frame_id: ''
	  },
	  info : {
      map_load_time: {secs : 0, nsecs : 100},
      resolution: 0,
      width: 0,
      height: 0,
      origin: 0,
	  },
	  data : 0
  });


  // Map information
  this.map = new createjs.Shape();
  this.oldMap = new createjs.Shape();
  // Add in client
  this.rootObject.addChildAt(this.map, start_index);
  this.index = that.rootObject.getChildIndex(this.map);
  // Border
  this.frameBorder = new ROSMAP.EditorMap({
		rootObject: this.rootObject,
		currentGrid: client.currentGrid
	});

  // Points
  var oldPt;
  var oldMidPt;

  client.on('change', function() {
		//Prepare ROS message
		map_message.info.resolution = client.currentGrid.scaleX;
		map_message.info.width = client.currentGrid.width/client.currentGrid.scaleX;
		map_message.info.height = client.currentGrid.height/client.currentGrid.scaleY;
		map_message.info.origin = client.currentGrid.pose;
		// Add frame border
		that.frameBorder = new ROSMAP.EditorMap({
		    currentGrid: client.currentGrid
		});
		that.rootObject.addChildAt(that.frameBorder, that.index);
		// Add editor map
		that.rootObject.removeChild(that.map);
		that.map = new ROSMAP.EditorMap({
		    currentGrid: client.currentGrid
		});
		that.oldMap = that.map;
		that.rootObject.addChildAt(that.map, that.index);
  });

  var handleMouseMove = function(event) {
		if (!event.primary) { return; }
		var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
		position.x = (position.x - that.map.x)/that.map.scaleX;
		position.y = (position.y + that.map.y)/that.map.scaleY;
		var midPt = new createjs.Point(oldPt.x + position.x >> 1, oldPt.y + position.y >> 1);

		//console.log("OLD [" + oldPt.x + "," + oldPt.y + "] - MID [" + oldMidPt.x + "," + oldMidPt.y + "]");

		that.map.context.beginPath();
		that.map.context.moveTo(midPt.x, midPt.y);
		that.map.context.quadraticCurveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
		that.map.context.lineWidth = that.strokeSize;
		that.map.context.strokeStyle = that.strokeColor;
		that.map.context.stroke();
		that.map.context.lineCap = 'round';
		/// Update all points
		oldPt.x = position.x;
		oldPt.y = position.y;
		oldMidPt.x = midPt.x;
		oldMidPt.y = midPt.y;
  };

  this.handleMouseUp = function(event) {
    if (!event.primary) { return; }
    that.rootObject.removeEventListener("stagemousemove", handleMouseMove);
    // Save old map
    //var ctx = that.map.context.getImageData(0, 0, that.map.width/that.map.scaleX, that.map.height/that.map.scaleY);
    that.oldMap.context = that.map.context;

    map_message.data = that.map.getMatrix();
    //Send Map message
    console.log("Data size: " + map_message.data.length);
    mapEditorTopic.publish(map_message);
  };

  this.handleMouseDown = function(event) {
    if (!event.primary) { return; }
    var position = that.rootObject.globalToRos(event.stageX, -event.stageY);
    position.x = (position.x - that.map.x)/that.map.scaleX;
    position.y = (position.y + that.map.y)/that.map.scaleY;
    oldPt = new createjs.Point(position.x, position.y);
    oldMidPt = oldPt.clone();
    that.rootObject.addEventListener("stagemousemove", handleMouseMove);
  };

    // Add listener
  this.rootObject.addEventListener("stagemousedown", this.handleMouseDown);
  this.rootObject.addEventListener("stagemouseup", this.handleMouseUp);
};

/**
 * load last draw
 */
ROSMAP.Editor.prototype.undo = function() {
    //this.rootObject.removeChild(this.map);
    this.map.context = this.oldMap.context;
    //this.rootObject.addChildAt(this.map, this.index);
};

/**
 * Enable or disable draw controller
 */
ROSMAP.Editor.prototype.enable = function(enable) {
    if(enable) {
        // Draw square
        ROSMAP.square({
            EditorMap: this.frameBorder,
            color: 'blue',
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
