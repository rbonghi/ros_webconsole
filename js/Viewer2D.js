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

/** 2D Navigation controller
*/
Viewer2D.Map2D = function(ros, size, options) {
    var that = this;
    // ROS controller
    this.ros = ros;
    // Check size page
    this.size = size;
    // Page configuration
    options = options || {};
    this.divID = options.divID || 'view2D';
    this.divMenu = options.divMenu || 'view2D-menu';
    this.view2Dframe = options.view3Dframe || '#view2D-frame';

    // Initialize sessionv view3D informations
    this.config = {'viewer': {background: '#EEEEEE'},
                   'tf': {rate: 10.0, frame: 'map', angularThres: 0.01, transThres: 0.01},
                   'server': {robot_pose:'base_link', serverName: '/move_base'}};
    // Set text ros URL
    $( this.view2Dframe ).val(this.config.tf.frame);
    // Initilization ROS parameters
    this.RPconfig = new ROSLIB.Param({ros: this.ros.ros, name: this.ros.config.ws + '/view2D'});
    this.RPconfig.get(function(value) {
       if(value) {
           console.log('Update view configuration');
           // refresh configuration list
           that.config = value;
           // Update url field
           $( that.view2Dframe ).val(that.config.tf.frame);
       }
    });
    // Create a TF client that subscribes to the fixed frame.
  	var tfClient = new ROSLIB.TFClient({
  		ros: this.ros.ros,
  		angularThres: this.config.tf.angularThres,
  		transThres: this.config.tf.transThres,
  		rate: this.config.tf.rate,
  		fixedFrame: this.config.tf.frame
  	});
  	// 2D Viewer
      this.viewer = new ROS2D.Viewer({
          divID: this.divID,
          width: this.size.width,
          height: this.size.height,
          background: this.config.viewer.background
      });
      // Setup the nav client.
      var nav = new NAV2D.OccupancyGridClientNav({
          ros: this.ros.ros,
          tfClient: tfClient,
          continuous: true,
          robot_pose: this.config.server.robot_pose,
          rootObject: this.viewer.scene,
          withOrientation: true,
          viewer: this.viewer,
          serverName: this.config.server.serverName
      });

	$(window).bind('resize', function (event) {
	    if(that.viewer) {
	        // Resize canvas
	        var size = pages.size();
	        that.viewer.scene.canvas.width = size.width;
	        that.viewer.scene.canvas.height = size.height;
	        that.viewer.scaleToDimensions(size.width, size.height);
	    }
	});
};

Viewer2D.Map2D.prototype.show = function(status) {
    // Show or hide some parts
    if(status) {
        $('#' + this.divID).show();
        $('#' + this.divMenu).show();
    } else {
        $('#' + this.divID).hide();
        $('#' + this.divMenu).hide();
    }
}
