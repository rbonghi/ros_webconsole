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
    wget -nc "https://jquerymobile.com/resources/download/jquery.mobile-1.4.5.zip"
    # Unzip jquery folder
    unzip -q -o jquery.mobile-1.4.5.zip -d jquery
    # Download jquery
    wget -P jquery -nc "http://code.jquery.com/jquery-2.1.1.min.js"
    # Remove jquery mobile zip file
    rm jquery.mobile-1.4.5.zip
fi

# Download ROS javascripts files
mkdir -p js/ros
wget -P js/ros -nc "https://static.robotwebtools.org/EventEmitter2/current/eventemitter2.min.js"
wget -P js/ros -nc "https://static.robotwebtools.org/roslibjs/current/roslib.min.js"
wget -P js/ros -nc "https://static.robotwebtools.org/EaselJS/current/easeljs.min.js"
wget -P js/ros -nc "https://static.robotwebtools.org/ros2djs/current/ros2d.min.js"
wget -P js/ros -nc "https://static.robotwebtools.org/threejs/current/three.min.js"
wget -P js/ros -nc "https://static.robotwebtools.org/threejs/current/STLLoader.js"
wget -P js/ros -nc "https://static.robotwebtools.org/threejs/current/ColladaLoader.js"
wget -P js/ros -nc "https://static.robotwebtools.org/ros3djs/current/ros3d.js"

