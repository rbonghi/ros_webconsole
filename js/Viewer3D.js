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
                                'config': {'num_cells': 10, 'cellSize': 1.0},
                                'type': {'num_cells': 'number', 'cellSize': 'number'},
                                'add': function(viewer, ros, tfClient, config) {
                                           var grid = new ROS3D.Grid(config);
	                                       // Add a grid.
	                                       viewer.addObject(grid);
	                                       return grid;
                                       },
                                 'update': function(viewer, obj, config) {
                                           // Remove old grid
                                           viewer.scene.remove(obj);
                                           // Make a new grid with new configuration
                                           var grid = new ROS3D.Grid(config);
                                           // Add in view
	                                       viewer.addObject(grid);
	                                       return grid;
                                       },
                                 'remove': function(viewer, obj) { viewer.scene.remove(obj) }
                                },
                       'urdf': {'name': 'Robot Description',
                                'config': {'param': 'robot_description'},
                                'type': {'param': 'string'},
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
                                 'update': function(viewer, obj, config) {
                                           if (obj.urdf) {
                                               // Unsubscribe
                                               obj.urdf.unsubscribeTf();
                                               // Remove object from view
                                               viewer.scene.remove(obj.urdf);
                                           }
                                            // Add the URDF model of the robot.
                                            var urdfClient = new ROS3D.UrdfClient({
	                                            ros: obj.ros,
	                                            tfClient: obj.tfClient,
	                                            path: obj.path,
	                                            rootObject: viewer.scene,
	                                            loader: ROS3D.STL_LOADER,
	                                            param: config.param
                                            });
                                            return urdfClient;
                                        },
                                 'remove': function(viewer, obj) {
                                               if (obj.urdf) {
                                                   // Unsubscribe
                                                   obj.urdf.unsubscribeTf();
                                                   // Remove object from view
                                                   viewer.scene.remove(obj.urdf);
                                               }
                                           }
                                },
                       'map': {'name': 'Map',
                               'config': {'topic': '/map', 'continuous': false},
                               'type': {'topic': 'string', 'continuous': 'boolean'},
                               'add': function (viewer, ros, tfClient, config) {
                                            var gridClient = new ROS3D.OccupancyGridClient({
                                              ros : ros.ros,
                                              rootObject : viewer.scene,
                                              tfClient: tfClient,
                                              continuous: config.continuous,
                                              topic: config.topic
                                            });
                                            return gridClient;
                                      },
                               'update': function(viewer, obj, config) {
                                            // Update continous
                                            obj.continuous = config.continuous;
                                            // Update status topic
                                            if(obj.topicName != config.topic) {
                                                obj.rosTopic.unsubscribe();
                                                obj.topicName = config.topic;
                                                obj.subscribe();
                                            }
                                            return obj;
                                        },
                               'remove': function(viewer, obj) {
                                            // Unsubscribe topic map
                                            if(obj.continous) {
                                                obj.rosTopic.unsubscribe();
                                            }
                                            if(obj.sceneNode) {
                                                // Unsubscribe from TF
                                                obj.sceneNode.unsubscribeTf();
                                                // Remove frome scene
                                                viewer.scene.remove(obj.sceneNode);
                                            }
                                       },
                               },    
                       'laser': {'name': 'Laser',
                                 'config': {'topic': '/scan'},
                                 'type': {'topic': 'string'},
                                 'add': function (viewer, ros, tfClient, config) {
                                            var laserScan = ROS3D.LaserScan({
                                                ros: ros.ros,
                                                rootObject: viewer.scene,
                                                topic: config.topic,
                                                tfClient: tfClient,
                                                material: { size: 0.01, color: '#FF0000' },
                                            });
                                            return laserScan;
                                         },
                                 'update': function(viewer, obj, config) {
                                                if(obj.topicName != config.topic) {
                                                    obj.rosTopic.unsubscribe();
                                                    obj.topicName = config.topic;
                                                    obj.subscribe();
                                                }
                                           },
                                 'remove': function(viewer, obj) {
                                               // Unsubscribe topic map
                                               obj.rosTopic.unsubscribe();
                                           },
                               },
                       'twist-maker': {'name': 'Twist Maker',
                                       'config': {'topic': '/twist_marker_server'},
                                       'type': {'topic': 'string'},
                                       'add': function (viewer, ros, tfClient, config) {
                                                // Setup the marker client.
                                                var imClient = new ROS3D.InteractiveMarkerClient({
                                                    ros: ros.ros,
                                                    tfClient: tfClient,
                                                    topic: config.topic,
                                                    camera: viewer.camera,
                                                    rootObject: viewer.selectableObjects
                                                });
                                                return imClient;
                                              },
                                       'update': function(viewer, obj, config) {
                                                    return obj;
                                                 },
                                       'remove': function(viewer, obj) {
                                                 },
                                       },
                       'odom': {'name': 'Odomery',
                                       'config': {'topic': '/odom', 'length': 1.0, 'keep': 1},
                                       'type': {'topic': 'string', 'length': 'number', 'keep': 'number'},
                                       'add': function (viewer, ros, tfClient, config) {
                                                // Setup the marker client.
                                                var odometry = new ROS3D.Odometry({
                                                    ros: ros.ros,
                                                    tfClient: tfClient,
                                                    topic: config.topic,
                                                    rootObject: viewer.scene,
                                                    length: config.length,
                                                    keep: config.keep
                                                });
                                                return odometry;
                                              },
                                       'update': function(viewer, obj, config) {
                                                    obj.length = config.length;
                                                    obj.keep = config.keep;
                                                    if(obj.topicName != config.topic) {
                                                        obj.rosTopic.unsubscribe();
                                                        obj.topicName = config.topic;
                                                        obj.subscribe();
                                                    }
                                                    return obj;
                                                 },
                                       'remove': function(viewer, obj) {
                                                    // Unsubscribe topic
                                                    obj.rosTopic.unsubscribe();
                                                    // Remove all components
                                                    for(var i= 0; i < obj.sns.length; i++) {
                                                        // Remove frome scene
                                                        viewer.scene.remove(obj.sns[i]);
                                                    }
                                                 },
                                       },
                       'path': {'name': 'Path',
                                       'config': {'topic': '/path'},
                                       'type': {'topic': 'string'},
                                       'add': function (viewer, ros, tfClient, config) {
                                                // Setup the marker client.
                                                var path = new ROS3D.Path({
                                                    ros: ros.ros,
                                                    tfClient: tfClient,
                                                    topic: config.topic,
                                                    rootObject: viewer.scene,
                                                });
                                                return path;
                                              },
                                       'update': function(viewer, obj, config) {
                                                    if(obj.topicName != config.topic) {
                                                        obj.rosTopic.unsubscribe();
                                                        obj.topicName = config.topic;
                                                        obj.subscribe();
                                                    }
                                                    return obj;
                                                 },
                                       'remove': function(viewer, obj) {
                                                    // Unsubscribe topic
                                                    obj.rosTopic.unsubscribe();
                                                    // Remove all components
                                                    if(obj.sn!==null){
                                                        obj.sn.unsubscribeTf();
                                                        obj.rootObject.remove(obj.sn);
                                                    }
                                                 },
                                       }, 
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
    obj = {'name': text,
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
    var collid = this.view3D + '-' + id;
    // Make Collapsible
    var content = '<div data-role="collapsible" id="' + collid + '">' + 
                    '<h3>' + name + "</h3>" +
                  '</div>';
    // Add content collapsible
    $( '#' + this.view3D ).append( content );
    // Add options group
    for(var key in obj.config) {
        var value = obj.config[key];
        // Make text input for label
        $('#' + collid).append(function() {
            var thisObj = obj;
            var th = that;
            var labname = key;
            var labid = collid + '-' + key;
            var label = ''
            // Add text label for type
            switch(typeof value) {
                case 'number':
                        label = '<label for="' + labid + '">' + key + '</label>' +
                            '<input type="number" data-mini="true" name="' + labid + '" pattern="[0-9]*" id="' + labid + '" value="' + value + '">';
                    break;
                case 'boolean':
                        label = '<label for="' + labid + '">' + key + '</label>' +
                                '<select name="' + labid + '" id="' + labid + '" data-role="flipswitch" data-mini="true">' +
                                    '<option value="false" ' + (!value ? 'selected=""' : '') + '>Off</option>' +
                                    '<option value="true" ' + (value ? 'selected=""' : '') + '>On</option>' + 
                                '</select>';
                    break;
                case 'string':
                default:
                    label = '<label for="' + labid + '">' + key + '</label>' +
                             '<input type="text" data-mini="true" name="' + labid + '" id="' + labid + '" value="' + value + '">';
                    break;
            }
            // Bind change event and append
            return $( label ).bind("change paste", function(event, ui) {
                        var idx = that.config.objects.indexOf(thisObj);
                        var type = that.components[thisObj.type].type[labname]
                        // Extract new value number
                        var val = $(this).val();
                        switch(type) {
                            case 'number':
                                val = Number(val);
                                break;
                            case 'boolean':
                                val = (val == 'true');
                                break;
                        }
                        console.log("New value for " + labname + ":" + val + " " + typeof val);
                        // Save value
                        that.config.objects[idx].config[labname] = val;
                        // Update object in view
                        var update = that.components[thisObj.type].update;
                        that.objects[idx] = update(that.viewer, that.objects[idx], that.config.objects[idx].config)
                        // Save the local storage for this configuration
                        window.localStorage.setItem('view3D', JSON.stringify(that.config));
                    });
        }).trigger("create");
    }
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
