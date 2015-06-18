/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function KeyDrive(panel, topic, options) {

    var linear = 0;
    var angular = 0;
    var twist = new ROSLIB.Message({
        linear: {
            x: linear,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: angular
        }
    });
    var step = {lin: 0.1, ang: 0.1};

    var slider = "<div id='sliders'>" +
            "<form>" +
            "<label for='slider-velocity'>Velocity:</label>" +
            "<input type='range' name='Velocity' class='slider-velocity' min='0.05' max='0.3' step='0.05' value='" + step.lin + "' data-highlight='true'>" +
            "</form>" +
            "<form>" +
            "<label for='slider-angular'>Angular:</label>" +
            "<input type='range' name='Angular' class='slider-angular' min='0.1' max='0.5' step='0.1' value='" + step.ang + "' data-highlight='true'>" +
            "</form>" +
            "</div>";

    var keyboard = "<div id='keycontrol'>" +
            "<h4> keyboard </h4>" +
            "<div data-role='controlgroup' data-type='horizontal' style='text-align:center'>" +
            "<a href = '#quit' class='q-key ui-btn ui-mini ui-corner-all'>Q</a>" +
            "<a href = '#up' class='up-key ui-btn ui-mini ui-corner-all'>W</a>" +
            "<a href = '#' class='e-key ui-btn ui-mini ui-corner-all'>E</a>" +
            "</div>" +
            "<div data-role='controlgroup' data-type='horizontal' style='text-align:center'>" +
            "<a href='#left' class='left-key ui-btn ui-mini ui-corner-all'>A</a>" +
            "<a href='#down' class='down-key ui-btn ui-mini ui-corner-all'>S </a>" +
            "<a href='#right' class='right-key ui-btn ui-mini ui-corner-all'>D </a>" +
            "</div>" +
            "<a href='#stop' class='space-key ui-btn ui-mini ui-corner-all' style='text-align:center'>SPACE</a>" +
            "</div>";

    $("#" + panel + " #controller").html(slider).trigger('create');
    $("#" + panel + " #controller").append(keyboard).trigger('create');

    function actions(action) {
        switch (action) {
            case "up":
                linear += step.lin;
                break;
            case "down":
                linear -= step.lin;
                break;
            case "left":
                angular += step.ang;
                break;
            case "right":
                angular -= step.ang;
                break;
            case "stop":
                linear = 0;
                angular = 0;
        }

        var limit_linear = $("#limit-controller .slider-max-velocity").val();
        var limit_angular = $("#limit-controller .slider-max-angular").val();

        if (Math.abs(linear) >= limit_linear) {
            var s = sign(linear);
            linear = s * limit_linear;
        }

        if (Math.abs(angular) >= limit_angular) {
            var s = sign(angular);
            angular = s * limit_angular;
        }

        $("#" + panel + " .velocity").text(linear);
        $("#" + panel + " .angular").text(angular);
        
	    twist = new ROSLIB.Message({
	        linear: {
	            x: linear,
	            y: 0,
	            z: 0
	        },
	        angular: {
	            x: 0,
	            y: 0,
	            z: angular
	        }
	    });
    
        if (action !== "quit") {
            topic.publish(twist);
        } else {
            topic.unsubscribe();
            topic.unadvertise();
        }
        

    }
    
    /**
     * Repeat twist value after 200ms
     */
    setInterval(function(){
        	topic.publish(twist);
        }, 200);

    $("#sliders .slider-velocity").on("slidestop", function(event, ui) {
        var value = event.target.value;
        step.lin = parseFloat(value);
    });

    $("#sliders .slider-angular").on("slidestop", function(event, ui) {
        var value = event.target.value;
        step.ang = parseFloat(value);
    });

    $("#keycontrol a").mousedown(function(e) {
        $(this).addClass('ui-btn-active');
        actions($(e.target).attr('href').replace(/^#/, ""));
    }).mouseup(function(e) {
        $(this).removeClass('ui-btn-active');
    });

    $(document).keydown(function(e) {
        var key = arrows(e.keyCode);
        if (key !== null) {
            key.addClass('ui-btn-active');
            key.mousedown();
        }
    });
    $(document).keyup(function(e) {
        var key = arrows(e.keyCode);
        if (key !== null) {
            key.removeClass('ui-btn-active');
        }
    });

    function sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    function arrows(keyCode) {
        var key;
        switch (keyCode) {
            case 65://37:    //Left
                key = $(".left-key");
                break;
            case 87://38:    //Up
                key = $(".up-key");
                break;
            case 68://39:    //Right
                key = $(".right-key");
                break;
            case 83://40:    //Down
                key = $(".down-key");
                break;
            case 32:
                key = $(".space-key");
                break;
            case 81:
                key = $(".q-key");
                break;
            case 69:
                key = $(".e-key");
                break;
            default:
                key = null;

        }
        return key;
    }
}