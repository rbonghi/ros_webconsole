/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ROScontroller(console_page, options) {
    options = options || {};
    var addr = options.addr || "localhost";
    var port = options.port || "9090";

    var button_connect = "<a href='#' id='ros-connect' data-role='button' data-icon='recycle' class='ui-btn-left'>Connect</a>";
    $("div:jqmData(role='footer')").append(button_connect).trigger('create');

    var html_console = "<div class='ui-grid-a' style='height:400px'>" +
            "<div class='ui-block-a'>" +
            "<div id='topics'></div>" +
            "</div>" +
            "<div class='ui-block-b'>" +
            "<div id='messages'></div>" +
            "</div></div>";
    $("#" + console_page + " #logger").append(html_console).trigger('create');

    // ----------------------------------------------------------------------
    // Connecting to rosbridge
    // ----------------------------------------------------------------------

    // The Ros object is responsible for connecting to rosbridge.
    var ros = new ROSLIB.Ros();

    ros.on('connection', function(e) {
        // displaySuccess is a convenience function for outputting messages in HTML.
        $("#" + console_page + " #messages").text("Connected: ws://" + addr + ":" + port);
        $("#ros-connect").addClass("ui-state-disabled");
    });

    ros.on('error', function(e) {
        $("#" + console_page + " #messages").text("Unable to connect: ws://" + addr + ":" + port);
    });

    ros.connect('ws://' + addr + ':' + port);

    ros.on('close', function(e) {
        $("#ros-connect").removeClass("ui-state-disabled");
    });

    $("#ros-connect").on("click", function(e) {
        console.log("connect");
        ros.connect('ws://' + addr + ':' + port);
    });
    
    
    var filter_form = "<form class='ui-filterable'>" +
            "<input id='filterBasic-input' data-type='search'>" +
            "</form>";
    $("#" + console_page + " #topics").append(filter_form).trigger('create');

    ros.getTopics(function(topics) {
        var html_list = "<ul data-role='listview' data-filter='true' data-input='#filterBasic-input'>";
        for (var i = 0; i < topics.length; i++) {
            html_list += "<li>" + topics[i] + "</li>";
            //console.log('Current topics in ROS: ' + topics[i]);
        }
        html_list += "</ul>";
        $("#" + console_page + " #topics").append(html_list).trigger('create');
    });
    
    ros.callOnConnection(function(message){
        console.log(message);
    });
    
    /*
    // Fetches list of all active services in ROS.
    ros.getServices(function(services) {
        //console.log('Current services in ROS: ' + services);
    });
    */
    /*
     // Gets list of all param names.
     ros.getParams(function(params) {
     //console.log('Current params in ROS: ' + params);
     });*/
    
    return ros;
}