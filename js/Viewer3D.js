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
Viewer3D.Map3D = function(ros, size, options) {
    var that = this;
    // ROS controller
    this.ros = ros;
    // Load page size
    this.size = size;
    // Page configuration
    options = options || {};
    this.divID = options.divID || 'map-3D';
    this.view3D = options.view3D || 'view3D-list';
    this.view3Delement = options.view3D || '#view3D-element';
    this.view3Dframe = options.view3Dframe || '#view3D-frame';
    // The list of object in scene
    this.objects = [];
    // List of all compoments availables
    this.components = {'grid': {'name': 'Grid', 
                                'config': {'size': 20, 'cellSize': 1.0},
                                'add': function(viewer, ros, tfClient, config) {
                                           var grid = new ROS3D.Grid(config);
	                                       // Add a grid.
	                                       viewer.addObject(grid);
	                                       return grid;
                                       },
                                 'remove': function(viewer, obj) { viewer.scene.remove(obj) }
                                },
                       'urdf': {'name': 'URDF',
                                'config': {'param': 'robot_description'},
                                'add': function(viewer, ros, tfClient, config) {
	                                        // Add the URDF model of the robot.
	                                        var urdfClient = new ROS3D.UrdfClient({
		                                        ros: ros.ros,
		                                        tfClient: tfClient,
		                                        path: ros.config.protocol + '//' + ros.config.server + ':' + ros.config.meshport + '/',
		                                        rootObject: viewer.scene,
		                                        loader: ROS3D.STL_LOADER,
		                                        param: config.param
	                                        });
	                                        return urdfClient;
                                       },
                                 'remove': function(viewer, obj) { 
                                               // Unsubscribe
                                               obj.urdf.unsubscribeTf();
                                               // Remove object from view
                                               viewer.scene.remove(obj.urdf)
                                           }
                                },
                       'map': {'name': 'Map'},
                       'laser': {'name': 'Laser'},
                       'point-cloud': {'name': 'Point Cloud'},
                       };
    // Build components list
    for(var key in this.components) {
        // Extract component information
        var component = this.components[key];
        var content = '<li><a href="#' + key + '">' + component['name'] + '</a></li>';
        $(this.view3Delement).append(content);
    }
    $(this.view3Delement).listview( "refresh" );
    
    $( this.view3Dframe ).bind("change paste", function(event, ui) {
        var value = $(this).val();
        if(that.tfClient) {
            console.log("New frame " + value);
            // Update configuration
            that.config.frame = value
            // Change frame
            that.tfClient.fixedFrame = value;
            // Save the local storage for this configuration
            window.localStorage.setItem('view3D', JSON.stringify(that.config));
        }
        // Prevent default => No write form in browser url
        event.preventDefault();
        return false;
    });
    
    // Control element
    $(this.view3Delement).children('li').bind('touchstart mousedown', function(e) {
        var name = $(this).children('a').attr('href').split('#')[1];
        var nextId = that.config.objects.length;
        var text = $(this).text();
        // Add object in list
        obj = that.addObject(name, nextId, text);
        // Add in list
        that.addCollapsible(obj, nextId);
    });

    // Initialize empty json
    this.robot = ros_controller.robot();
    this.config = Viewer3D.loadConfig();
    // Set text ros URL
    $( this.view3Dframe ).val(this.config.frame);
    // Make the 3D viewer
    this.make();
    
	$(window).bind('resize', function (event) {
	    // Check if viewer is already loaded
	    if(that.viewer) {
	        var size = pages.size();
	        that.viewer.resize(size.width, size.height);
	    }
	});
}

Viewer3D.Map3D.prototype.addObject = function(name, nextId, text) {
    // Extract default config
    var config = this.components[name].config;
    // Define new object
    obj = {'name': nextId + ' ' + text,
           'type': name,
           'id': name + nextId,
           'config': config,
           };
    // Extract function and default configuration
    add_func = this.components[name].add;
    objview = add_func(this.viewer, this.ros, this.tfClient, config); // Add component and save object status
    this.objects.push(objview);
    // Update configuration
    this.config.objects.push(obj);
    // Save the local storage for this configuration
    window.localStorage.setItem('view3D', JSON.stringify(this.config));
    return obj;
}

Viewer3D.Map3D.prototype.removeObject = function(obj) {
    var comp = this.components[obj.type];
    // Extract index from object
    var idx = this.config.objects.indexOf(obj);
    comp.remove(this.viewer, this.objects[idx]);
    // remove selected element in list
    this.config.objects.splice(idx, 1);
    // remove selected element in list
    this.objects.splice(idx, 1);
    // Save the local storage for this configuration
    window.localStorage.setItem('view3D', JSON.stringify(this.config));
}

Viewer3D.Map3D.prototype.addCollapsible = function(obj, idx) {
    var that = this;
    // Extract name
    var name = obj.name;
    var id = obj.id;
    // Make Collapsible
    var content = '<div data-role="collapsible" id="' + this.view3D + '-' + id + '">' + 
                    '<h3>' + name + "</h3>" +
                    '<p>I am the collapsible content in a set so this feels like an accordion.</p>' +
                  '</div>';
    for(var key in obj.config) {
        var value = obj.config[key];
        var type = typeof value;
        console.log(key + " " + value + " " + type);
    }
    // Add content collapsible
    $( '#' + this.view3D ).append( content );
    // Add remove button
    $('#' + this.view3D + '-' + id).append(function() {
        // Add remove function
        return $('<a href="#remove" class="ui-btn ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-left">Remove</a>').click(function() {
            // Remove object from list
            that.removeObject(obj);
            // Remove collapsible
            $('#' + that.view3D + '-' + id).remove();
            // Refresh collapsible
            $( '#' + that.view3D ).collapsibleset( "refresh" );
        });
    });
    // Update collapsible
    $( '#' + this.view3D ).collapsibleset( "refresh" );
    
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
	this.tfClient = new ROSLIB.TFClient({
		ros: this.ros.ros,
		angularThres: 0.01,
		transThres: 0.01,
		rate: this.config.rate,
		fixedFrame: this.config.frame
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
    // Populate object list
    for(var i = 0; i < this.config.objects.length; i++) {
        var obj = this.config.objects[i];
        // Extract function and default configuration
        add_func = this.components[obj.type].add;
        objview = add_func(this.viewer, this.ros, this.tfClient, obj.config); // Add component and save object status
        this.objects.push(objview);
        //Add in list
        this.addCollapsible(obj, i);
    }
    /*
    // Setup the map client.
    var gridClient = new ROS3D.OccupancyGridClient({
      ros : this.ros.ros,
      rootObject : this.viewer.scene,
      tfClient: this.tfClient,
      continuous: true
    });
	// Add the URDF model of the robot.
	var urdfClient = new ROS3D.UrdfClient({
		ros: this.ros.ros,
		tfClient: this.tfClient,
		path: this.ros.config.protocol + '//' + this.ros.config.server + ':' + this.ros.config.meshport + '/',
		rootObject: this.viewer.scene,
		loader: ROS3D.STL_LOADER,
		param: 'minicar/robot_description'
	});
	*/
};

Viewer3D.Map3D.prototype.show = function(status) {
    // Show or hide some parts
    if(status) {
        $('#' + this.divID).show();
    } else {
        $('#' + this.divID).hide();
    }
}

Viewer3D.loadConfig = function(json) {
    lconf = {};
    if(localStorage.getItem('view3D')) { // Check if exist in local storage
        lconf = JSON.parse(localStorage.getItem('view3D'));
    }
    config = {};
    config.background = lconf.background || '#EEEEEE';
    config.rate = lconf.rate || 10.0;
    config.frame = lconf.frame || 'base_link';
    config.objects = lconf.objects || [];
    // Save the local storage for this configuration
    window.localStorage.setItem('view3D', JSON.stringify(config));
    return config
}
