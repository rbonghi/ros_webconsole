/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TouchDrive(ros) {

    // Publishing a Topic
    // ------------------

    var cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: '/robot/command/velocity',
        messageType: 'geometry_msgs/Twist'
    });

    var mouseX, mouseY,
            // is this running in a touch capable environment?
            touchable = 'createTouch' in document,
            touches = []; // array of touch vectors

    var canvas,
            c,
            container,
            halfWidth,
            halfHeight,
            top_canvas,
            leftTouchID = -1,
            leftTouchPos = new Vector2(0, 0),
            leftTouchStartPos = new Vector2(0, 0),
            leftVector = new Vector2(0, 0);
    setupCanvas();

    if (touchable) {
        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
        canvas.addEventListener('touchend', onTouchEnd, false);
    }

    function onTouchStart(e) {
        //$('h1').text("Touch start");
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            //console.log(leftTouchID + " " 
            if ((leftTouchID < 0) && (touch.clientX < halfWidth * 2))
            {
                leftTouchID = touch.identifier;
                leftTouchStartPos.reset(touch.clientX, touch.clientY);
                leftTouchPos.copyFrom(leftTouchStartPos);
                leftVector.reset(0, 0);
                continue;
            } else {

                //makeBullet();

            }
        }
        touches = e.touches;
    }

    function onTouchMove(e) {
        // Prevent the browser from doing its default thing (scroll, zoom)
        //$('h1').text("Touch move");
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (leftTouchID == touch.identifier)
            {
                leftTouchPos.reset(touch.clientX, touch.clientY);
                leftVector.copyFrom(leftTouchPos);
                leftVector.minusEq(leftTouchStartPos);

                if (Math.abs(leftVector.x) >= 100) {
                    var sign = leftVector.x ? leftVector.x < 0 ? -1 : 1 : 0;
                    leftVector.x = sign * 100;
                    leftTouchPos.x = leftTouchStartPos.x + leftVector.x;
                }
                if (Math.abs(leftVector.y) >= 100) {
                    var sign = leftVector.y ? leftVector.y < 0 ? -1 : 1 : 0;
                    leftVector.y = sign * 100;
                    leftTouchPos.y = leftTouchStartPos.y + leftVector.y;
                }
                $('.velocity-touch').text(-leftVector.y / 100);
                $('.angular-touch').text(-leftVector.x / 100);
                var twist = new ROSLIB.Message({
                    linear: {
                        x: 0.1*(-leftVector.y / 100),
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: 0.5*(-leftVector.x / 100)
                    }
                });
                cmdVel.publish(twist);
                break;
            }
        }
        touches = e.touches;

    }

    function onTouchEnd(e) {
        //$('h1').text("Touch end");
        touches = e.touches;

        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (leftTouchID == touch.identifier)
            {
                leftTouchID = -1;
                leftVector.reset(0, 0);
                $('.velocity-touch').text(0);
                $('.angular-touch').text(0);
                var twist = new ROSLIB.Message({
                    linear: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                });
                cmdVel.publish(twist);
                break;
            }
        }

    }

    function draw() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        if (touchable) {

            for (var i = 0; i < touches.length; i++) {

                var touch = touches[i];

                if (touch.identifier == leftTouchID) {
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.lineWidth = 6;
                    c.arc(leftTouchStartPos.x, leftTouchStartPos.y - top_canvas, 40, 0, Math.PI * 2, true);
                    c.stroke();
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.lineWidth = 2;
                    c.arc(leftTouchStartPos.x, leftTouchStartPos.y - top_canvas, 60, 0, Math.PI * 2, true);
                    c.stroke();
                    c.beginPath();
                    c.strokeStyle = "blue";//"cyan";
                    c.arc(leftTouchPos.x, leftTouchPos.y - top_canvas, 40, 0, Math.PI * 2, true);
                    c.stroke();

                } else {

                    c.beginPath();
                    //c.fillStyle = "white";
                    c.fillStyle = "black";
                    c.fillText("touch id : " + touch.identifier + " x:" + touch.clientX + " y:" + touch.clientY, touch.clientX + 30, touch.clientY - 30 - top_canvas);

                    c.beginPath();
                    c.strokeStyle = "red";
                    c.lineWidth = "6";
                    c.arc(touch.clientX, touch.clientY - top_canvas, 40, 0, Math.PI * 2, true);
                    c.stroke();
                }
            }
        } else {
            c.fillStyle = "white";
            c.fillText("mouse : " + mouseX + ", " + mouseY, mouseX, mouseY);
        }
    }

    setInterval(draw, 1000 / 35);

    function resetCanvas(e) {
        // resize the canvas - but remember - this clears the canvas too. 

        var heightHeader = $("body").find('[data-role="header"]').height();
        var heightFooter = $("body").find('[data-role="footer"]').height();
        var widthPage = $(window).width() - 16 * 2;
        var halfPage = $(window).width() / 2 - 16 * 2;
        var heightPage = $(window).height() - heightHeader - heightFooter - 16 * 2 - 10;

        canvas.width = widthPage;
        canvas.height = heightPage;
        $('#TouchController').css({top: heightHeader});

        top_canvas = heightHeader;
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;

        halfWidth = canvas.width / 2;
        halfHeight = canvas.height / 2;

        //make sure we scroll to the top left. 
        window.scrollTo(0, 0);
    }


    function setupCanvas() {
        canvas = document.getElementById("TouchController");
        c = canvas.getContext("2d");

        //canvas = document.createElement('canvas');
        //c = canvas.getContext('2d');

        //container = document.createElement('div');
        //container.className = "container";

        //document.body.appendChild(container);
        //container.appendChild(canvas);

        resetCanvas();

        c.strokeStyle = "#ffffff";
        c.lineWidth = 2;
    }


}