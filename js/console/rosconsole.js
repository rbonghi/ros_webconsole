var ROSCONSOLE = ROSCONSOLE || {
	REVISION: '0.0.1'
};

ROSCONSOLE.isMobile = function() {
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	return isMobile;
};

ROSCONSOLE.controller = function(options) {
	options = options || {};
	var addr = options.addr || 'localhost';
	var port = options.port || '9090';
	var fixed_frame = options.fixed_frame || '/odom';

	//Default color
	var def_color = $('[data-role="header"]').css('background-color');
	// The Ros object is responsible for connecting to rosbridge.
	var ros_console = new ROSLIB.Ros();

	ros_console.on('connection', function(e) {
		// displaySuccess is a convenience function for outputting messages in HTML.
		$('[data-role="header"]').css('background-color', def_color);
	});

	ros_console.on('error', function(e) {
		$('[data-role="header"]').css('background-color', 'rgba(255,0,0,0.5)');
	});

	ros_console.connect('ws://' + addr + ':' + port);

	ros_console.on('close', function(e) {
		//$("#ros-connect").removeClass("ui-state-disabled");
	});

	// Create a TF client that subscribes to the fixed frame.
	var tfClient = new ROSLIB.TFClient({
		ros: ros_console,
		angularThres: 0.01,
		transThres: 0.01,
		rate: 20.0,
		fixedFrame: fixed_frame
	});

	return {
		ros: ros_console,
		tfClient: tfClient
	};
};



ROSCONSOLE.initEditor = function(map_editor, button_pos) {
  var editor_buttons = '<div id="editor">' +
      '<div id="editor-map-control" data-role="controlgroup" data-type="horizontal">' +
        '<a href="#undo" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-top">Undo</a>' +
        '<a href="#forward" class="ui-btn ui-corner-all ui-icon-forward ui-btn-icon-top">Redo</a>' +
      '</div>' +
      '<div id="sliders">' +
        '<form>' +
          '<label for="map-editor-thickness">Thickness:</label>' +
          '<input type="range" name="Thickness" class="map-editor-thickness" min="1" max="10" step="0.5" value="' + map_editor.strokeSize + '" data-highlight="true">' +
        '</form>' +
      '</div>' +
      '<form id="TypeControl">' +
        '<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">' +
          '<legend>Type:</legend>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-obstacle" value="on" checked="checked">' +
          '<label for="radio-obstacle">Obstacle</label>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-checked" value="off">' +
          '<label for="radio-checked">Checked</label>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-unknown" value="other">' +
          '<label for="radio-unknown">Unknown</label>' +
        '</fieldset>' +
      '</form>' +
    '</div>';
  /*
  var buttons = '<div data-role="controlgroup" data-type="horizontal" data-mini="true">' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-forbidden ui-btn-icon-top">Obstacle</a>' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-top">Checked</a>' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-action ui-btn-icon-top">Unknown</a>' +
      '</div>';
  */

  $(button_pos).append(editor_buttons).trigger('create');
  $('#editor').hide();

  $('#editor-map-control a').mousedown(function(e) {
      $(this).addClass('ui-btn-active');
      console.log($(e.target).attr('href').replace(/^#/, ''));
      switch($(e.target).attr('href').replace(/^#/, '')){
          case 'undo':
            map_editor.undo();
            break;
          case 'forward':
            map_editor.redo();
            break;
      }
      //actions($(e.target).attr('href').replace(/^#/, ""));
  }).mouseup(function(e) {
      $(this).removeClass('ui-btn-active');
  });

  $( '#TypeControl' ).bind( 'change', function( e ) {
      //console.log("Check:" + e.target.id);
      switch(e.target.id) {
          case 'radio-obstacle':
              map_editor.strokeColor = createjs.Graphics.getRGB(0, 0, 0);
              break;
          case 'radio-checked':
              map_editor.strokeColor = createjs.Graphics.getRGB(255, 255, 255);
              break;
          case 'radio-unknown':
              map_editor.strokeColor = createjs.Graphics.getRGB(127, 127, 127);
              break;
      }
  });

  $('#sliders .map-editor-thickness').on('slidestop', function(event, ui) {
      map_editor.strokeSize = $('#sliders .map-editor-thickness').val();
      //console.log(map_editor.strokeSize);
  });
};



ROSCONSOLE.RadioController = function(divID, nav) {

	var that = this;
  this.divID = divID;
	this.controllers = [];
/*
  var radio_controller = '<form id="nav-controller">' +
    '<fieldset id="map2d-controller" data-role="controlgroup">' +
    '<legend>Vertical:</legend>' +
    '<input type="radio" name="radio-choice-v-2" id="radio-position" value="on" checked="checked">' +
    '<label for="radio-position">Set robot position</label>' +
    '<input type="radio" name="radio-choice-v-2" id="radio-map-editor" value="off">' +
    '<label for="radio-map-editor">Map editor</label>' +
    '</fieldset>' +
    '</form>';
    */
		this.controllers.push({
      radio_name: 'zoom',
			name: 'Zoom',
			func_run: function (e) {
				nav.setControlType('scroll');
			},
			func_stop: function (e) {
				nav.setControlType('disable');
			}
		});
		this.controllers.push({
      radio_name: 'goal',
			name: 'Set goal',
			func_run: function (e) {
				nav.setControlType('goal');
			},
			func_stop: function (e) {
				nav.setControlType('disable');
			}
		});
		// Launch all function
    $( divID  ).bind( 'change', function( e ) {
			var name = e.target.id.replace(/^radio-map-/, '');
			var i = 0;
			for(i = 0; i < that.controllers.length; i++) {
				if (typeof that.controllers[i].func_stop !== null) {
					that.controllers[i].func_stop.call(this, e);
				}
			}
			for(i = 0; i < that.controllers.length; i++) {
				if(that.controllers[i].radio_name === name) {
					that.controllers[i].func_run.call(this, e);
					return;
				}
			}
    });
};


ROSCONSOLE.RadioController.prototype.addController = function(options) {
	options = options || {};
	var radio_name = options.radio_name;
	var name = options.name;
	this.controllers.push({
		radio_name: radio_name,
		name: name,
		func_run: options.func_run || null,
		func_stop: options.func_stop || null
		});
  var controller =  '<input type="radio" name="radio-choice-v-2" id="radio-map-' + radio_name + '" value="off">' +
    '<label for="radio-map-' + radio_name + '">' + name + '</label>';

   $( this.divID + ' fieldset' ).append(controller).trigger('create');
};




ROSCONSOLE.ROS3Dmap = function(options) {
	options = options || {};
	var ros = options.ros;
	var tfClient = options.tfClient;
	var viewer3D = options.viewer;
	var width = options.width || 200;
	var height = options.height || 200;
	var path = options.path || 'localhost';

	// Add a grid.
	viewer3D.addObject(new ROS3D.Grid({
		size: 20,
		cellSize: 1.0
	}));

		/*
		$("#ros-test").on("click", function(e) {
			console.log("test");
			tfClient = new ROSLIB.TFClient({
				ros: ros,
				angularThres: 0.01,
				transThres: 0.01,
				rate: 20.0,
				fixedFrame: '/base_link'
					//fixedFrame: fixed_frame
					//fixedFrame: fixed_frame
			});
		});
	*/
	//tfClient.subscribe('base_link', function(tf) {
	//	console.log(tf);
	//});

	// Add the URDF model of the robot.
	var urdfClient = new ROS3D.UrdfClient({
		ros: ros,
		tfClient: tfClient,
		path: 'http://' + path + '/',
		rootObject: viewer3D.scene,
		loader: ROS3D.COLLADA_LOADER
		//loader: ROS3D.STL_LOADER
	});

	// Setup the marker client.
	var grid3Client = new ROS3D.OccupancyGridClient({
		ros: ros,
		rootObject: viewer3D.scene,
		tfClient: tfClient,
		continuous: true
	});

	// Setup the marker client.
	var imClient = new ROS3D.InteractiveMarkerClient({
		ros: ros,
		tfClient: tfClient,
		topic: '/twist_marker_server',
		camera: viewer3D.camera,
		rootObject: viewer3D.selectableObjects
	});
};



ROSCONSOLE.pages = function() {

	// Find pages
	var find_pages = $('div:jqmData(role="page")');
	// Create navbar
	var html_navbar = '';
	if (ROSCONSOLE.isMobile().any()) {
		html_navbar = '<ul data-role="listview">';
	} else {
		html_navbar = '<ul>';
	}

	for (var i = 0; i < find_pages.length; i++) {
		html_navbar += '<li>' +
			'<a href="#' + $(find_pages[i]).attr('id') + '" data-icon="' + $(find_pages[i]).jqmData('icon') +
			'" data-transition="fade"' + '>' +
			$(find_pages[i]).jqmData('title') + '</a>' + '</li>';
	}
	html_navbar += '</ul>';
	return html_navbar;
};


ROSCONSOLE.WindowController = function(name_page) {
	// Create header
	var html_header = '<div data-role="header" data-theme="a" data-position="fixed">';
	html_header += '<h1>' + name_page + '</h1>';

	if (ROSCONSOLE.isMobile().any()) {
		html_header += '<a href="#menu" class="ui-btn ui-icon-bars ui-btn-icon-notext ui-corner-all">No text</a>';
	}
	/// Added a Codiad button
	html_header += '<a href="/Codiad" class="ui-btn ui-icon-edit ui-btn-right ui-btn-icon-notext ui-corner-all" target="_blank">No text</a>';
	html_header += '</div>';

	$(html_header).prependTo('body').enhanceWithin();

	// Add menu
	ROSCONSOLE.build_menu();

	//$( "[data-role='navbar']" ).navbar();
	$('[data-role="header"], [data-role="footer"]').toolbar({
		position: 'fixed',
		tapToggle: false
	});
	$('[data-role=panel]').panel().enhanceWithin();
	$.mobile.resetActivePageHeight();

	//-------------------------
	// Update the contents of the toolbars
	$('[data-role="navbar"] a:first').addClass('ui-btn-active');
	$(document).on('pageshow', '[data-role="page"]', function() {
		// Each of the four pages in this demo has a data-title attribute
		// which value is equal to the text of the nav button
		// For example, on first page: <div data-role="page" data-title="Info">
		var current = $(this).jqmData('title');
		// Change the heading
		// Remove active class from nav buttons
		$('[data-role="navbar"] a.ui-btn-active').removeClass('ui-btn-active');
		// Add active class to current nav button
		$('[data-role="navbar"] a').each(function() {
			if ($(this).text() === current) {
				$(this).addClass('ui-btn-active');
				$('#navbar').trigger('page', current);
			}
		});
	});
};

ROSCONSOLE.build_menu = function() {

	if (ROSCONSOLE.isMobile().any()) {
		$('body').append('<div data-role="panel" id="menu" data-theme="b" data-display="push"></div>');
	} else {
		$('[data-role="header"]').append('<div data-role="navbar" id="menu"></div>');
	}

	$('#menu').append(ROSCONSOLE.pages());
};
