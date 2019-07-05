/* 
 * This file is part of the ros_webconsole package (https://github.com/rbonghi/ros_webconsole or http://rnext.it).
 * Copyright (c) 2019 Raffaello Bonghi.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var Viewer3D = Viewer3D || {
    REVISION: '0.0.1'
};

Viewer3D.Map3D = function(robot, options) {
    var that = this;
    robot = robot || {};
    // URDF path
    var rate = robot.rate || 20.0;
    var frame = robot.frame || 'map';
    var path = robot.path || 'http://localhost/';
    
    options = options || {};
    // ROS controller
    var ros = options.ros;
    // Page configuration
    var divID = options.divID || 'map-3D';
    // Load page size
    var size = options.size;
		
	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: rate,
		fixedFrame: frame
	});
    // Create the main viewer.
    var viewer = new ROS3D.Viewer({
      divID : divID,
      width : size.width,
      height : size.height,
      antialias : true,
      background: '#EEEEEE'
    });
    // Setup the map client.
    var gridClient = new ROS3D.OccupancyGridClient({
      ros : ros,
      rootObject : viewer.scene,
      tfClient: tfClient,
      continuous: true
    });
	// Add a grid.
	viewer.addObject(new ROS3D.Grid({
		size: 20,
		cellSize: 1.0
	}));
	// Add the URDF model of the robot.
	var urdfClient = new ROS3D.UrdfClient({
		ros: ros,
		tfClient: tfClient,
		path: path,
		rootObject: viewer.scene,
		loader: ROS3D.STL_LOADER
	});	
	
	$(window).bind('resize', function (event) {
	    var size = pages.size();
	    viewer.resize(size.width, size.height);
	});
};

