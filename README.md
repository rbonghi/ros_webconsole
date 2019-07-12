# ROS webconsole 

A ROS WEB console to control remotely your robot. Based with robotwebtools.

:loudspeaker: **See demo console in: http://rbonghi.github.io/ros_webconsole/** :loudspeaker:


## Install

It depends on the following ROS packages:
* roswww
* rosbridge
* tf2_web_publisher

This web console depends on:
* [jQuery](https://jquery.com/). Release 2.1.1
* [jQuery Mobile](https://jquerymobile.com/). Release 1.4.5
* [EventEmitter2](https://github.com/hij1nx/EventEmitter2)
* [three.js](https://github.com/mrdoob/three.js/)
* [ColladaLoader2](https://github.com/crobi/ColladaAnimationCompress)
* [THREE.STLLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/STLLoader.js)
* [EaselJS](https://github.com/CreateJS/EaselJS/)
* [roslibjs](https://github.com/RobotWebTools/roslibjs)
* [ros2djs](https://github.com/RobotWebTools/ros2djs)
* [ros3djs](https://github.com/RobotWebTools/ros3djs)

Open a terminal and build the package:
```
cd ~/catkin_ws/src
git clone https://github.com/rbonghi/ros_webconsole.git
cd ../
rosdep install --from-paths src --ignore-src -r -y
catkin_make
source ./devel/setup.bash
```

## Run the program

1. Launch your robotics project with URDF and controllers
2. Run from your terminal
```
roslaunch ros_webconsole ros_webconsole.launch
```
3. Open your browser in:
[http://localhost:8001/ros_webconsole](http://localhost:8001/ros_webconsole)

## Configuration

From the web interface you can export the configuration file and save on the `config\config.json` every load the page will be loaded with your selected configuration
