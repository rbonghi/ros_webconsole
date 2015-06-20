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

ROSCONSOLE.ROS3Dmap = function(ros, options) {

	options = options || {};
	var divName = options.divID || 'threed-map';
	var width = options.width || 200;
	var height = options.height || 200;
	var path = options.path || 'localhost';
	var fixed_frame = options.fixed_frame || '/odom';

	console.log(fixed_frame);
	// Create the scene manager and view port for the 3D world.
	var viewer3D = new ROS3D.Viewer({
		divID: divName,
		width: width,
		height: height,
		antialias: true
			//background: '#EEEEEE'
	});

	window.onresize = function(event) {
		var heightHeader = $(this).find('[data-role="header"]').height();
		var widthPage = $(window).width() - 16 * 2;
		var heightPage = $(window).height() - heightHeader - 16 * 2 - 110;
		viewer3D.resize(widthPage, heightPage);
	};

	// Add a grid.
	viewer3D.addObject(new ROS3D.Grid({
		size: 20,
		cellSize: 1.0
	}));

	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: 20.0,
		//fixedFrame: '/base_link'
		//fixedFrame: fixed_frame
		fixedFrame: fixed_frame
	});

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
		//tfClient: tfClient,
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
