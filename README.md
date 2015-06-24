ROS web console [![Build Status](https://travis-ci.org/rbonghi/roswebconsole.svg)](https://travis-ci.org/rbonghi/roswebconsole)
=======
System interface to control a robot under ROS with web page.

[![Video](https://i.ytimg.com/vi/fhCHS7ibFrw/mqdefault.jpg)](https://www.youtube.com/watch?v=fhCHS7ibFrw)

:loudspeaker: **See demo console in: http://rbonghi.github.io/roswebconsole/** :loudspeaker:

#Dependencies
This web console depends on:
- [EventEmitter2](https://github.com/hij1nx/EventEmitter2). The current supported version is 0.4.14.
- [three.js](https://github.com/mrdoob/three.js/). The current supported version is r61.
- ~~[ColladaLoader2](https://github.com/crobi/ColladaAnimationCompress). The current supported version is 0.0.1.~~
- ~~[THREE.ColladaLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/ColladaLoader.js). The current supported version is r61.~~
- [THREE.STLLoader](https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/STLLoader.js). The current supported version is r61.
- [EaselJS](https://github.com/CreateJS/EaselJS/). The current supported version is 0.7.1.
- [roslibjs](https://github.com/RobotWebTools/roslibjs). The current supported version is 0.14.0.
- [ros2djs](https://github.com/RobotWebTools/ros2djs). The current supported version is 0.6.0.
- [ros3djs](https://github.com/RobotWebTools/ros3djs). The current supported version is 0.15.0.

###All files are stored in folder [js/ros](https://github.com/rbonghi/roswebconsole/tree/master/js/ros)

##ROS Dependencies
```
$ sudo apt-get install ros-indigo-rosbridge-suite
$ sudo apt-get install ros-indigo-tf2-web-republisher
$ sudo apt-get install ros-indigo-interactive-marker-proxy 
```

#Installation
* Follow the guide on [Install lighttpd and Codiad](http://raffaello.officinerobotiche.it/4ude/how-to-install-lighttpd-and-codiad/)
* Clone this project and change owner:
```
cd /var/www/
git clone https://github.com/rbonghi/roswebconsole.git/
sudo chown -R www-data:www-data roswebconsole/ 
```
* Now you can update your lighttpd server configuration in `/etc/lighttpd/lighttpd.conf` with this commands:
	* Change root:
	```
	server.document-root        = "/var/www/roswebconsole"
	```
	* Add alias
	```
	alias.url = ( "/Codiad" => "/var/www/Codiad" )
	alias.url += ( "/ROBOT_description" => "/home/USER/catkin_ws/src/ROBOT_description" )
	```
	An example for my robot [4UDE](http://raffaello.officinerobotiche.it/4ude/):
	```
	alias.url += ( "/dude_description" => "/home/USER/catkin_ws/src/ros_dude/dude_description" )
	```
