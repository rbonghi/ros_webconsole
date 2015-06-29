
/**
 * @author Raffaello Bonghi - raffaello.bonghi@officinerobotiche.it
 */

var ROSNAV2D = ROSNAV2D || {
	REVISION: '0.0.1'
};

/**
 * Window option
 *
 * @param size - size screen
 */
ROSNAV2D.view_property = function(viewer, withScreen, heightScreen) {
	this.viewer = viewer;
	this.size = 1;
	this.withScreen = withScreen;
	this.heightScreen = heightScreen;
	this.x = 0;
	this.y = 0;
	console.log("view PROP");
};

ROSNAV2D.view_property.prototype.center = function() {
	return {
		x: this.size / 2,
		y: this.size / 2
	};
};

/**
 * Initalize 2D navigator
 *
 * @param with - width screen
 * @param height - height screen
 */
ROSNAV2D.init = function(options) {
	var that = this;
	options = options || {};
	var ros = options.ros;
	var tfClient = options.tfClient;
	var widthScreen = options.width || 100;
	var heightScreen = options.height || 100;
	var tf_map = options.tf_map || '/map';
	var tf_base = options.tf_base || '/base_link';

    // The ROS2D.Viewer is a 2D scene manager with additional ROS
    // functionality.
    this.viewer = new ROS2D.Viewer({
        divID: 'nav',
        width: widthScreen,
        height: heightScreen,
        background: '#ddd'
    });

    // Subscribes to the robot's OccupancyGrid, which is ROS representation of
    // the map, and renders the map in the scene.
    this.client = new ROS2D.OccupancyGridClient({
        ros: ros,
        continuous: true,
        rootObject: this.viewer.scene
    });

    var gridMap = new ROS2D.Grid({
        size: 10,
        cellSize: 0.5
    });
    this.client.rootObject.addChild(gridMap);

    tfClient.subscribe(tf_base, function(tf) {
    	//console.log("I'M HERE! - TF");
    });

    this.client.on('change', function() {
    	console.log("I'M HERE!");
    	//console.log("client.currentGrid.width: "+ client.currentGrid.width +
    	//" - client.currentGrid.height: " + client.currentGrid.height);
    	//that.viewer.scaleToDimensions(that.client.currentGrid.width, that.client.currentGrid.height);
		//console.log("client.currentGrid.pose.position.x: " + client.currentGrid.pose.position.x +
		//" - client.currentGrid.pose.position.y: " + client.currentGrid.pose.position.y)
		//that.viewer.shift(client.currentGrid.pose.position.x, client.currentGrid.pose.position.y);
    });

    var size = 20;
    var old_pose = {x: 0.0, y: 0.0};
    var center = {x: size / 2, y: size / 2};
    var shift = {x: 0.0, y: 0.0};
    var limit = {x: 0.1, y: 0.1};

    this.viewer.scaleToDimensions(size, size);
    this.viewer.shift(-center.x, -center.y);



    /*

    */
    //
    /*
    var robotMarker = new ROS2D.NavigationArrow({
        size: 12,
        strokeSize: 1,
        fillColor: createjs.Graphics.getRGB(255, 255, 0, 0.66),
        pulse: false
    });
    this.gridClient.rootObject.addChild(robotMarker);

    viewer2D.scaleToDimensions(1, 1);
    viewer2D.shift(-center.x, -center.y);
    robotMarker.x = 0;
    robotMarker.y = 0;
    robotMarker.scaleX = 0.01;
    robotMarker.scaleY = 0.01;
    robotMarker.rotation = 90;
    robotMarker.visible = true;
    */
};



/*
this.update = function(pose, orientation) {
    robotMarker.x = pose.x;
    robotMarker.y = -pose.y;
    robotMarker.rotation = viewer2D.scene.rosQuaternionToGlobalTheta(orientation);
    if (old_pose.x !== pose.x || old_pose.y !== pose.y) {
        viewer2D.shift( - old_pose.x + pose.x, - old_pose.y + pose.y);
        old_pose = pose;
    }
};
*/
