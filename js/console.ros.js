/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function OpenRos() {
    $.mobile.loading("show", {
        text: "Waiting to connect to rosbridge",
        textVisible: true,
        theme: $.mobile.loader.prototype.options.theme,
        textonly: false,
        html: ""
    });
    //$.mobile.loading("hide");
    // ----------------------------------------------------------------------
    // Connecting to rosbridge
    // ----------------------------------------------------------------------

    // The Ros object is responsible for connecting to rosbridge.
    var ros = new ROSLIB.Ros();
    // When a connection is established with rosbridge, a 'connection' event
    // is emitted. In the event callback, we print a success message to the
    // screen.
    ros.on('connection', function() {
        // displaySuccess is a convenience function for outputting messages in HTML.
        $.mobile.loading("hide");
    });
    // Connects to rosbridge.
    ros.connect('ws://Labsis4-linux.local:9090');

    return ros;
}

function Open3DMap(ros, width, height) {
    // ----------------------------------------------------------------------
    // Rendering the robot in 3D
    // ----------------------------------------------------------------------

    // Create the scene manager and view port for the 3D world.
    var viewer3D = new ROS3D.Viewer({
        divID: 'threed-map',
        width: width,
        height: height,
        antialias: true
                //background: '#EEEEEE'
    });

    // Add a grid.
    viewer3D.addObject(new ROS3D.Grid({
        cellSize: 0.5
    }));

    // Create a TF client that subscribes to the fixed frame.
    var tfClient = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 20.0,
        //fixedFrame: '/base_link'
        fixedFrame: '/odom'
    });

    // Add the URDF model of the robot.
    var urdfClient = new ROS3D.UrdfClient({
        ros: ros,
        tfClient: tfClient,
        rootObject: viewer3D.scene
    });
}