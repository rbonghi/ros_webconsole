#!/bin/bash
# This file is part of the ros_webconsole package (https://github.com/rbonghi/ros_webconsole or http://rnext.it).
# Copyright (c) 2019 Raffaello Bonghi.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>

if ! [ -d jquery ] ; then
    # Download jquery mobile
    curl "https://jquerymobile.com/resources/download/jquery.mobile-1.4.5.zip" -o jquery.mobile-1.4.5.zip
    # Unzip jquery folder
    unzip -q -o jquery.mobile-1.4.5.zip -d jquery
    # Download jQuery
    curl "http://code.jquery.com/jquery-2.1.1.min.js" -o jquery/jquery-2.1.1.min.js
    # Remove jquery mobile zip file
    rm jquery.mobile-1.4.5.zip
fi

# Download ROS javascripts files
mkdir -p js/ros
# Download yaml reader
curl "https://raw.githubusercontent.com/nodeca/js-yaml/master/dist/js-yaml.min.js" -o js/js-yaml.min.js
# Download all ROSJS scripts
curl "https://static.robotwebtools.org/EventEmitter2/current/eventemitter2.min.js" -o js/ros/eventemitter2.min.js
curl "https://static.robotwebtools.org/roslibjs/current/roslib.min.js" -o js/ros/roslib.min.js
curl "https://static.robotwebtools.org/EaselJS/current/easeljs.min.js" -o js/ros/easeljs.min.js
curl "https://static.robotwebtools.org/ros2djs/current/ros2d.min.js" -o js/ros/ros2d.min.js
curl "https://static.robotwebtools.org/threejs/current/three.min.js" -o js/ros/three.min.js
curl "https://static.robotwebtools.org/threejs/current/STLLoader.js" -o js/ros/STLLoader.js
curl "https://static.robotwebtools.org/threejs/current/ColladaLoader.js" -o js/ros/ColladaLoader.js
curl "https://static.robotwebtools.org/ros3djs/current/ros3d.js" -o js/ros/ros3d.js
