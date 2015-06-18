/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TouchDrive(panel, topic, options) {
    var mouseX, mouseY,
            debug = false,
            // is this running in a touch capable environment?
            touchable = 'createTouch' in document,
            touches = []; // array of touch vectors

    var canvas,
            c,
            container,
            halfWidth,
            halfHeight;

    var driveTouchID = -1,
            driveTouchPos = new Vector2(0, 0),
            driveTouchStartPos = new Vector2(0, 0),
            driveVector = new Vector2(0, 0);
    var linear = 0,
            angular = 0,
            old_linear = 0,
            old_angular = 0,
            limit_linear = $("#limit-controller .slider-max-velocity").val(),
            limit_angular = $("#limit-controller .slider-max-angular").val();

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

    var html_activate = "<form>" +
            "<label for='touch-activate'>Flip toggle switch:</label>" +
            "<select id='touch-activate' name='activate' data-role='slider'>" +
            "<option value='off'>Off</option>" +
            "<option value='on'>On</option>" +
            "</select>" +
            "</form>";

    $("#" + panel + " #controller").html(html_activate).trigger('create');
    $("#" + panel + " #touch-activate").val('on').slider("refresh");

    $("#" + panel + " #touch-activate").bind("change", function(event, ui) {
        var value = event.target.value;
        switch (value) {
            case "on":
                $(".container").css({"z-index": 0});
                break;
            case "off":
                $(".container").css({"z-index": -1});
                break;
        }
    });

    setupCanvas();

    if (touchable) {
        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
        canvas.addEventListener('touchend', onTouchEnd, false);
    }

    function draw() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        if (touchable) {
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                if (touch.identifier == driveTouchID) {
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.lineWidth = 6;
                    c.arc(driveTouchStartPos.x, driveTouchStartPos.y, 40, 0, Math.PI * 2, true);
                    c.stroke();
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.lineWidth = 2;
                    c.arc(driveTouchStartPos.x, driveTouchStartPos.y, 60, 0, Math.PI * 2, true);
                    c.stroke();
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.arc(driveTouchPos.x, driveTouchPos.y, 40, 0, Math.PI * 2, true);
                    c.stroke();
                } else {
                    if (debug) {
                        c.beginPath();
                        //c.fillStyle = "white";
                        c.fillStyle = "black";
                        c.fillText("touch id : " + touch.identifier + " x:" + touch.clientX + " y:" + touch.clientY, touch.clientX + 30, touch.clientY - 30);

                        c.beginPath();
                        c.strokeStyle = "red";
                        c.lineWidth = "6";
                        c.arc(touch.clientX, touch.clientY, 40, 0, Math.PI * 2, true);
                        c.stroke();
                    }
                }
            }

        }
    }

    setInterval(draw, 1000 / 35);
    /**
     * Repeat twist value after 200ms
     */
    setInterval(function(){
        	topic.publish(twist);
        }, 200);

    $("#limit-controller .slider-max-velocity").on("slidestop", function(event, ui) {
        var value = event.target.value;
        limit_linear = parseFloat(value);
    });

    $("#limit-controller .slider-max-angular").on("slidestop", function(event, ui) {
        var value = event.target.value;
        limit_angular = parseFloat(value);
    });

    function onTouchStart(e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (driveTouchID < 0)
            {
                driveTouchID = touch.identifier;
                driveTouchStartPos.reset(touch.clientX, touch.clientY);
                driveTouchPos.copyFrom(driveTouchStartPos);
                driveVector.reset(0, 0);
                continue;
            }
        }
        touches = e.touches;
    }
    function onTouchMove(e) {
        // Prevent the browser from doing its default thing (scroll, zoom)
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (driveTouchID == touch.identifier)
            {
                driveTouchPos.reset(touch.clientX, touch.clientY);
                driveVector.copyFrom(driveTouchPos);
                driveVector.minusEq(driveTouchStartPos);

                if (Math.abs(driveVector.x) >= 100) {
                    var s = sign(driveVector.x);
                    driveVector.x = s * 100;
                    driveTouchPos.x = driveTouchStartPos.x + driveVector.x;
                }
                if (Math.abs(driveVector.y) >= 100) {
                    var s = sign(driveVector.y);
                    driveVector.y = s * 100;
                    driveTouchPos.y = driveTouchStartPos.y + driveVector.y;
                }
                angular = -driveVector.x / 100;
                linear = -driveVector.y / 100;
                $("#" + panel + " .velocity").text(linear);
                $("#" + panel + " .angular").text(angular);

                if ((linear !== old_linear) || (angular !== old_angular)) {
                    twist = new ROSLIB.Message({
                        linear: {
                            x: limit_linear * linear,
                            y: 0,
                            z: 0
                        },
                        angular: {
                            x: 0,
                            y: 0,
                            z: limit_angular * angular
                        }
                    });
                    //topic.publish(twist);
                    old_linear = linear;
                    old_angular = angular;
                }
                break;
            }
        }
        touches = e.touches;
    }
    function onTouchEnd(e) {

        touches = e.touches;

        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (driveTouchID == touch.identifier)
            {
                driveTouchID = -1;
                driveVector.reset(0, 0);
                linear = 0;
                angular = 0;
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
                //topic.publish(twist);
            }
        }
    }

    function resetCanvas(e) {
        // resize the canvas - but remember - this clears the canvas too. 
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 4;

        halfWidth = canvas.width / 2;
        halfHeight = canvas.height / 2;

        //make sure we scroll to the top left. 
        window.scrollTo(0, 0);
    }

    function setupCanvas() {
        canvas = document.createElement('canvas');
        c = canvas.getContext('2d');

        container = document.createElement('div');
        container.className = "container";

        document.body.appendChild(container);
        container.appendChild(canvas);

        resetCanvas();

        c.strokeStyle = "#ffffff";
        c.lineWidth = 2;

        $(".container").css({
            "position": "absolute",
            "z-index": 0
        });
    }

    function sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }
}

