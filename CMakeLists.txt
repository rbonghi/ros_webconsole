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

cmake_minimum_required(VERSION 2.8.3)
project(ros_webconsole)

find_package(catkin REQUIRED COMPONENTS roslaunch)

catkin_package()

roslaunch_add_file_check(launch)

add_custom_command(TARGET doc
    POST_BUILD COMMAND scripts/install.sh
)
