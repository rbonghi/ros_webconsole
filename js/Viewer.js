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

var Viewer = Viewer || {
    REVISION: '0.0.1'
};

Viewer.pagesize = function() {
    // Evaluate content size
    // Reference:
    // https://stackoverflow.com/questions/21552308/set-content-height-100-jquery-mobile
	var screen = $.mobile.getScreenHeight();
    var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
    var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
    /* content div has padding of 1em = 16px (32px top+bottom). This step
       can be skipped by subtracting 32px from content var directly. */
    var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
    return screen - header - footer - contentCurrent - 2;
}

Viewer.Map3D = function(options) {
    var that = this;
    options = options || {};
    // ROS controller
    var ros = options.ros;
    // URDF path
    var path = options.path || 'http://localhost/';
    var frame = options.frame || '/map';
    // Page configuration
    var page = options.page || '3Dmap';
    var divID = options.divID || 'threed-map';
	var width = options.width || $(window).width() - 16;
	var height = options.height || Viewer.pagesize();
		
	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: 20.0,
		fixedFrame: frame
	});
    // Create the main viewer.
    var viewer = new ROS3D.Viewer({
      divID : divID,
      width : width,
      height : height,
      antialias : true
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
	
	
    // register function
    options.pages.register(page, function() { 
        that.show();
    });
};

Viewer.Map3D.prototype.show = function() {
    console.log("Map3D show function");
};
