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

/** 3D Navigation controller
*/
Viewer3D.Map3D = function(file, options) {
    var that = this;
    options = options || {};
    // ROS controller
    this.ros = options.ros;
    // Page configuration
    this.divID = options.divID || 'map-3D';
    // Load page size
    this.size = options.size;
		
    // Json load and config
    $.getJSON( file ).done(function( json ) {
        // Load ROS configuration file
        that.robot = ros_controller.robot(json);
        that.loadConfig(json);
        // Make the 3D viewer
        that.make();
    }).fail(function( jqxhr, textStatus, error ) {
        // Initialize empty json
        that.robot = ros_controller.robot({});
        that.loadConfig({});
        // Make the 3D viewer
        that.make();
    });
    
	$(window).bind('resize', function (event) {
	    // Check if viewer is already loaded
	    if(that.viewer) {
	        var size = pages.size();
	        that.viewer.resize(size.width, size.height);
	    }
	});
}

Viewer3D.Map3D.prototype.make = function() {
    var that = this;
    // Initialize sessionv view3D informations
    this.sview3D = {}
    // Check if exists a session storage
    if(sessionStorage.getItem('view3D')) {
        this.sview3D = JSON.parse(sessionStorage.getItem('view3D'));
    }
	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: this.ros.ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: this.robot.rate,
		fixedFrame: this.robot.frame
	});
    // Create the main viewer.
    this.viewer = new ROS3D.Viewer({
      divID : this.divID,
      width : this.size.width,
      height : this.size.height,
      antialias : true,
      background: this.config.background,
      cameraPose: this.sview3D.cameraPose || {x:3.0, y:3.0, z:3.0}
    });
    // Save camera position information in session storage
    this.viewer.cameraControls.addEventListener('change', function(o){
        that.sview3D.cameraPose = that.viewer.camera.position;
        window.sessionStorage.setItem('view3D', JSON.stringify(that.sview3D));
    });
    // Setup the map client.
    var gridClient = new ROS3D.OccupancyGridClient({
      ros : this.ros.ros,
      rootObject : this.viewer.scene,
      tfClient: tfClient,
      continuous: true
    });
    var grid = new ROS3D.Grid({
		size: 20,
		cellSize: 1.0
	})
	// Add a grid.
	this.viewer.addObject(grid);
	// Add the URDF model of the robot.
	var urdfClient = new ROS3D.UrdfClient({
		ros: this.ros.ros,
		tfClient: tfClient,
		path: this.ros.config.protocol + '//' + this.ros.config.server + ':' + this.ros.config.meshport + '/',
		rootObject: this.viewer.scene,
		loader: ROS3D.STL_LOADER
	});
};

Viewer3D.Map3D.prototype.show = function(status) {
    // Show or hide some parts
    if(status) {
        $('#' + this.divID).show();
    } else {
        $('#' + this.divID).hide();
    }
}

Viewer3D.Map3D.prototype.loadConfig = function(json) {
    if ('view3D' in json) {
        config = json.view3D;
    } else if(localStorage.getItem('view3D')) { // Check if exist in local storage
        config = JSON.parse(localStorage.getItem('view3D'));
    } else {
        config = {};
    }
    this.config = {};
    this.config.background = config.background || '#EEEEEE';
    // Save the local storage for this configuration
    window.localStorage.setItem('view3D', JSON.stringify(this.config));
}
