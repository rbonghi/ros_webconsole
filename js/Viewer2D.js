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

var Viewer2D = Viewer2D || {
    REVISION: '0.0.1'
};

/**
    2D Navigation controller
*/
Viewer2D.Map2D = function(robot, options) {
    var that = this;
    robot = robot || {};
    // URDF path
    var rate = robot.rate || 20.0;
    var frame = robot.frame || 'map';
    var base_link = robot.base_link || 'base_link';
    var serverName = robot.serverName || '/move_base';
    // Options viewer
    options = options || {};
    // ROS controller
    var ros = options.ros;
    // Page configuration
    var divID = options.divID || 'map-2D';
    // Check size page
    var size = options.size;
	
	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: rate,
		fixedFrame: frame
	});
	// 2D Viewer
    var viewer = new ROS2D.Viewer({
        divID: divID,
        width: size.width,
        height: size.height,
        background: '#EEEEEE'
    });
    // Setup the nav client.
    var nav = new NAV2D.OccupancyGridClientNav({
        ros: ros,
        tfClient: tfClient,
        continuous: true,
        robot_pose: base_link,
        rootObject: viewer.scene,
        withOrientation: true,
        viewer: viewer,
        serverName: serverName
    });
    
	$(window).bind('resize', function (event) {
	    var size = pages.size();
	    // Resize canvas
	    viewer.scene.canvas.width = size.width;
	    viewer.scene.canvas.height = size.height;
	    viewer.scaleToDimensions(size.width, size.height);
	});
	
	
};
