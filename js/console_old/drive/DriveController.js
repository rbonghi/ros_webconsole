/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function DriveController(namepanel, topics, options) {
    options = options || {};
    var topic_velocity = topics.velocity;
    var topic_pose = topics.position;
    var panel = $("#" + namepanel);
    var name_controller = "";
    var hasTouch = 'ontouchstart' in window;

    $("#" + namepanel + " #reset").on('click', function() {
        var pose = new ROSLIB.Message({
            x: 0,
            y: 0,
            theta: 0,
            space: 0
        });
        topic_pose.publish(pose);
    });

    if (hasTouch) {
        name_controller = "Touch";
        $("#" + namepanel + " #visualcontroller h3")
                .html("<h3 align='center'>" + name_controller + " Controller</h3>")
                .trigger('create');
        TouchDrive(namepanel, topic_velocity, options);
    } else {
        name_controller = "Key";
        $("#" + namepanel + " #visualcontroller h3")
                .html("<h3 align='center'>" + name_controller + " Controller</h3>")
                .trigger('create');
        KeyDrive(namepanel, topic_velocity, options);
    }
}