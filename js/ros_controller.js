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

ros_controller.connection = function(ros, options) {
    // Load ROS configuration
    ros = ros || {};
    var server = ros.server || 'ws://localhost:9090';
    var show = ros.show || true;
    // Load graphic options
    options = options || {};
    var field = options.field || '#ros-server';
    var button = options.button || '#ros-config';
    var connect = options.connect || "#ros-connect-button";
    var on_connect = options.on_connect;
    var on_error = options.on_error;

    // Load default background color
    var def_color = $('[data-role="header"]').css('background-color');
    // The Ros object is responsible for connecting to rosbridge.
    var ros_console = new ROSLIB.Ros();

    if(!show) {
        $( button ).hide();
        console.log('Hide configuration button');
    }
    /*
    // Find the name of the server if is already written
    if(server == '') {
        server = $( field ).val();
        console.log('Load address from browser search bar: ' + server)
    } else {
        $(field).val(server);
        //$(field).prop("disabled", true);
        $(connect).addClass('ui-state-disabled');
    }
    */
    //console.log("ROS WS connection:" + server);
    //ros_console.connect(server);
    /**
    // Map connections page information
    ros_console.on('connection', function(e) {
        console.log("Connect: " + e);
        on_connect(def_color);
    });
    ros_console.on('error', function(e) {
        console.log("Error: " + e);
        on_error('rgba(255,0,0,0.5)');
    });
    // Connection server
    $( field ).bind( "change paste", function(event, ui) {
        var value = $(this).val();
        // read the value only if not empty
        console.log("New value saved: " + value);
        server = value
    });
    $( connect ).bind( "click", function(event, ui) {
        console.log("Clicked");
        // If the server is connected close the connection
        if(ros_console.isConnected) {
            ros_console.close();
            console.log("ROS WS disconnection");
        }
        // Connect to new server
        console.log("ROS WS connection: " + server );
        ros_console.connect(server);
    });
    */
    // return the ros console websocket
    return ros_console;
}
