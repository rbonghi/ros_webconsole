var ROSCONSOLE = ROSCONSOLE || {
	REVISION: '0.0.1'
};

ROSCONSOLE.isMobile = function() {
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	return isMobile;
};

ROSCONSOLE.controller = function(options) {
	options = options || {};
	var addr = options.addr || 'localhost';
	var port = options.port || '9090';
	var fixed_frame = options.fixed_frame || '/odom';

	//Default color
	var def_color = $('[data-role="header"]').css('background-color');
	// The Ros object is responsible for connecting to rosbridge.
	var ros_console = new ROSLIB.Ros();

	ros_console.on('connection', function(e) {
		// displaySuccess is a convenience function for outputting messages in HTML.
		$('[data-role="header"]').css('background-color', def_color);
	});

	ros_console.on('error', function(e) {
		$('[data-role="header"]').css('background-color', 'rgba(255,0,0,0.5)');
	});

	ros_console.connect('ws://' + addr + ':' + port);

	ros_console.on('close', function(e) {
		//$("#ros-connect").removeClass("ui-state-disabled");
	});

	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros_console,
		angularThres: 0.01,
		transThres: 0.01,
		rate: 20.0,
		fixedFrame: fixed_frame
	});

	return {
		ros: ros_console,
		tfClient: tfClient
	};
};

ROSCONSOLE.ROS3Dmap = function(options) {
	options = options || {};
	var ros = options.ros;
	var tfClient = options.tfClient;
	var viewer3D = options.viewer;
	var width = options.width || 200;
	var height = options.height || 200;
	var path = options.path || 'localhost';

	// Add a grid.
	viewer3D.addObject(new ROS3D.Grid({
		size: 20,
		cellSize: 1.0
	}));
	
		/*
		$("#ros-test").on("click", function(e) {
			console.log("test");
			tfClient = new ROSLIB.TFClient({
				ros: ros,
				angularThres: 0.01,
				transThres: 0.01,
				rate: 20.0,
				fixedFrame: '/base_link'
					//fixedFrame: fixed_frame
					//fixedFrame: fixed_frame
			});
		});
	*/
	//tfClient.subscribe('base_link', function(tf) {
	//	console.log(tf);
	//});

	// Add the URDF model of the robot.
	var urdfClient = new ROS3D.UrdfClient({
		ros: ros,
		tfClient: tfClient,
		path: 'http://' + path + '/',
		rootObject: viewer3D.scene,
		loader: ROS3D.STL_LOADER
	});

	// Setup the marker client.
	var grid3Client = new ROS3D.OccupancyGridClient({
		ros: ros,
		rootObject: viewer3D.scene,
		tfClient: tfClient,
		continuous: true
	});

	// Setup the marker client.
	var imClient = new ROS3D.InteractiveMarkerClient({
		ros: ros,
		tfClient: tfClient,
		topic: '/twist_marker_server',
		camera: viewer3D.camera,
		rootObject: viewer3D.selectableObjects
	});
};
