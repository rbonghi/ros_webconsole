


ROSCONSOLE.ROS3Dmap = function(options) {
	options = options || {};
	var ros = options.ros;
	var tfClient = options.tfClient;
	var viewer3D = options.viewer;
	var width = options.width || 200;
	var height = options.height || 200;
	var path = options.path || 'localhost';
    var param = options.param || 'robot_description';
    var laser = options.laser || '/minicar/zed/scan';
    var urdf_loader = options.urdf_loader || ROS3D.STL_LOADER; // Or ROS3D.COLLADA_LOADER
    var twistmaker = options.twistmaker || false;

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
		loader: urdf_loader,
        param: param
	});

	// Setup the marker client.
	var grid3Client = new ROS3D.OccupancyGridClient({
		ros: ros,
		rootObject: viewer3D.scene,
		tfClient: tfClient,
		continuous: true
	});
	
    var laserScan = new ROS3D.LaserScan({
        ros: ros,
        rootObject: viewer3D.scene,
        topic: laser,
        tfClient: tfClient,
        material: { size: 0.01, color: "#FF0000" },
    });
	
	if(twistmaker) {
	    // Setup the marker client.
	    var imClient = new ROS3D.InteractiveMarkerClient({
		    ros: ros,
		    tfClient: tfClient,
		    topic: '/twist_marker_server',
		    camera: viewer3D.camera,
		    rootObject: viewer3D.selectableObjects
	    });
	}
};
