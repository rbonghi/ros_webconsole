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

var ros_controller = ros_controller || {
    REVISION: '0.0.1'
};

ros_controller.connection = function(file, options) {
    var that = this;
    // Load graphic options
    options = options || {};
    var collapsible = options.collapsible || '#ros-server';
    var header = options.header || '#ros-server-status';
    var refresh = options.refresh || '#ros-server-refresh';
    this.ros_url = options.ros_url || '#ros-url';
    // Load colors header
    var color = {'default': $(header + ' a.ui-collapsible-heading-toggle').css('background-color'),
                     'red': 'rgba(255,0,0,0.5)',
                     'green': 'rgba(0,255,10,0.5)'};
    // The Ros object is responsible for connecting to rosbridge.
    this.ros = new ROSLIB.Ros(); 
    // Map connections page information
    this.ros.on('connection', function(e) {
        $(header + ' a.ui-collapsible-heading-toggle').text('Connected');
        $(header + ' a.ui-collapsible-heading-toggle').css('background-color', color.green);
    });
    
    this.ros.on('error', function(e) {
        console.log("error");
        $(header + ' a.ui-collapsible-heading-toggle').text('Error');
        $(header + ' a.ui-collapsible-heading-toggle').css('background-color', color.red);
    });
    
    // Json load and config
    $.getJSON( file ).done(function( json ) {
        // Load ROS configuration file
        that.load(json);
        // Set configuration
        $(ros_url).text(that.config.server);
        $(ros_url).addClass('ui-state-disabled');
        // Connect to server
        that.ros.connect('ws://' + that.config.server + ':' + that.config.wsport);
        
    }).fail(function( jqxhr, textStatus, error ) {
        // Initialize empty json
        that.load({});
        if(that.config.server !== '') {
            // Connect to new server
            that.ros.connect('ws://' + that.config.server + ':' + that.config.wsport);
        }
    });
    // Connection server
    $( this.ros_url ).bind("change paste", function(event, ui) {
        var value = $(this).val();
        // read the value only if not empty
        console.log("New value saved: " + value);
        // update server name
        that.config.server = value;
        // Save the local storage for this configuration
        window.localStorage.setItem('ros', JSON.stringify(that.config));
        // Prevent default => No write form in browser url
        event.preventDefault();
        return false;
    });
    
    $( refresh ).click(function() {
        if(that.config.server !== '') {
            // Connect to new server
            that.ros.connect('ws://' + that.config.server + ':' + that.config.wsport);
        }
    });
}

ros_controller.connection.prototype.load = function(json) {
    this.config = {};
    if ('ros' in json) {
        ros = json.ros;
    } else if(localStorage.getItem('ros')) { // Check if exist in local storage
        ros = JSON.parse(localStorage.getItem('ros'));
    } else {
        ros = {}
    }
    // Build location hostname
    this.config.protocol = ros.protocol || location.protocol;
    this.config.server = ros.server || window.location.hostname;
    this.config.wsport = ros.wsport || '9090';
    this.config.meshport = ros.meshport || '8001';
    // Set text ros URL
    $( this.ros_url ).val(this.config.server);
    // Save the local storage for this configuration
    window.localStorage.setItem('ros', JSON.stringify(this.config));
}

ros_controller.robot = function(json) {
    // Load robot configuration
    if ('robot' in json) {
        drobot = json.robot;
    } else if(localStorage.getItem('robot')) { // Check if exist in local storage
        drobot = JSON.parse(localStorage.getItem('robot'));
    } else {
        drobot = {};
    }
    // Initialize robot configuration string
    robot = {};
    robot.base_link = robot.base_link || 'base_link';
    robot.serverName = robot.serverName || '/move_base';
    // Save the local storage for this configuration
    window.localStorage.setItem('robot', JSON.stringify(robot));
    // Return robot status
    return robot
}
