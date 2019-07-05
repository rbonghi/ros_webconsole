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
    var ros_url = options.ros_url || '#ros-url';
    // Load colors header
    var color = {'default': $(header + ' a.ui-collapsible-heading-toggle').css('background-color'),
                     'red': 'rgba(255,0,0,0.5)',
                     'green': 'rgba(0,255,10,0.5)'};
    // The Ros object is responsible for connecting to rosbridge.
    var ros_console = new ROSLIB.Ros(); 
    // Map connections page information
    ros_console.on('connection', function(e) {
        $(header + ' a.ui-collapsible-heading-toggle').text('Connected');
        $(header + ' a.ui-collapsible-heading-toggle').css('background-color', color.green);
    });
    
    ros_console.on('error', function(e) {
        console.log("error");
        $(header + ' a.ui-collapsible-heading-toggle').text('Error');
        $(header + ' a.ui-collapsible-heading-toggle').css('background-color', color.red);
    });
    
    // Json load and config
    $.getJSON( file ).done(function( json ) {
        // Load ROS configuration file
        that.load(json);
        // Set configuration
        $(ros_url).text(that.ros.server);
        $(ros_url).addClass('ui-state-disabled');
        // Connect to server
        ros_console.connect('ws://' + that.ros.server + ':' + that.ros.port);
        
    }).fail(function( jqxhr, textStatus, error ) {
        console.log('Fail load confing from json');
        // Initialize empty json
        that.load({});
        // Save in local the configuration
        localStorage.setItem('ros', JSON.stringify(this.ros));
    });

    // Connection server
    $( ros_url ).bind( "change paste", function(event, ui) {
        var value = $(this).val();
        // Update only if not empty
        if(value !== '') {
            // read the value only if not empty
            console.log("New value saved: " + value);
            // update server name
            that.ros.server = value;
        }
    });
    
    $( refresh ).click(function() {
        // If the server is connected close the connection
        if(ros_console.isConnected) {
            ros_console.close();
            console.log("ROS Close");
        }
        if(that.ros.server !== '') {
            // Connect to new server
            ros_console.connect('ws://' + that.ros.server + ':' + that.ros.port);
        }
    });
    // return the ros console websocket
    return ros_console;
}

ros_controller.connection.prototype.load = function(json) {
    if ('ros' in json) {
        this.ros = {};
        this.ros.server = ros.server || '';
        this.ros.port = ros.port || '9090';
    } else {
        this.ros = {};
        this.ros.server = '';
        this.ros.port = '9090';
    }
}
