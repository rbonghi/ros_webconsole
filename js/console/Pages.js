

var ROSCONSOLE = ROSCONSOLE || {
  REVISION : '0.0.1'
};

ROSCONSOLE.build_header = function(name_page) {
    
    //find pages
    var find_pages = $("div:jqmData(role='page')");
    var pages = [];
    for (var i = 0; i < find_pages.length; i++) {
        var information = {
            name: $(find_pages[i]).attr('id'),
            title: $(find_pages[i]).jqmData("title"),
            icon: $(find_pages[i]).jqmData("icon")
        };
        pages[i] = information;
    }
    // Create navbar
    if(ROSCONSOLE.isMobile().any()) {
        var html_navbar = "<div data-role='navbar' id='navbar' data-iconpos='left'>" + "<ul>";
    } else {
        var html_navbar = "<div data-role='navbar' id='navbar' >" + "<ul>";
    }
    for (var i = 0; i < pages.length; i++) {
        html_navbar += "<li>" +
                "<a href='#" + pages[i].name + "' data-icon='" + pages[i].icon + "' data-transition='fade'" + ">" +
                pages[i].title + "</a>" + "</li>";
    }
    html_navbar += "</ul>" + "</div>";
    
    // Create header
    var html_header = "<div data-role='header' data-theme='a' data-position='fixed'>";
    html_header += "<h1>" + name_page + "</h1>";
    //html_header += "<a href='#drivepanel' data-role='button' class='ui-btn-right' data-inline='true' data-icon='bars'>Drive</a>";
    html_header += html_navbar;
    html_header += "</div>";
    
    $(html_header).prependTo("body").enhanceWithin();
    
    //$( "[data-role='navbar']" ).navbar();
    $("[data-role='header'], [data-role='footer']").toolbar({position: "fixed", tapToggle: false});
    $("[data-role=panel]").panel().enhanceWithin();
    $.mobile.resetActivePageHeight();

    //-------------------------
    // Update the contents of the toolbars
    $("[data-role='navbar'] a:first").addClass("ui-btn-active");
    $(document).on("pageshow", "[data-role='page']", function() {
        // Each of the four pages in this demo has a data-title attribute
        // which value is equal to the text of the nav button
        // For example, on first page: <div data-role="page" data-title="Info">
        var current = $(this).jqmData("title");
        // Change the heading
        // Remove active class from nav buttons
        $("[data-role='navbar'] a.ui-btn-active").removeClass("ui-btn-active");
        // Add active class to current nav button
        $("[data-role='navbar'] a").each(function() {
            if ($(this).text() === current) {
                $(this).addClass("ui-btn-active");
                $("#navbar").trigger("page", current);
            }
        });
    });
    
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

ROSCONSOLE.ROS3Dmap = function(ros, options) {

    options = options || {};
    var divName = options.divID || 'threed-map';
    var width = options.width || 200;
    var height = options.height || 200;
    var path = options.path || 'localhost';
    var fixed_frame = options.fixed_frame || '/odom';

    // ----------------------------------------------------------------------
    // Rendering the robot in 3D
    // ----------------------------------------------------------------------

    // Create the scene manager and view port for the 3D world.
    var viewer3D = new ROS3D.Viewer({
        divID: divName,
        width: width,
        height: height,
        antialias: true
                //background: '#EEEEEE'
    });
    
    window.onresize = function(event) {
        var heightHeader = $(this).find('[data-role="header"]').height();
        var widthPage = $(window).width() - 16 * 2;
        var heightPage = $(window).height() - heightHeader - 16 * 2 - 10;
        viewer3D.resize(widthPage, heightPage);
    };

    // Add a grid.
    viewer3D.addObject(new ROS3D.Grid({
    	size: 20,
        cellSize: 1.0
    }));

    // Create a TF client that subscribes to the fixed frame.
    var tfClient = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 20.0,
        //fixedFrame: '/base_link'
        //fixedFrame: fixed_frame
        fixedFrame: '/map'
    });

    // Add the URDF model of the robot.
    var urdfClient = new ROS3D.UrdfClient({
        ros: ros,
        tfClient: tfClient,
        path: 'http://' + path + '/',
        rootObject: viewer3D.scene,
        loader: ROS3D.STL_LOADER
    });
    
    // Setup the marker client.
    var grid3Client = new ROS3D.OccupancyGridClient({
      ros : ros,
      rootObject : viewer3D.scene,
      continuous: true
    });
    
        // Setup the marker client.
    var imClient = new ROS3D.InteractiveMarkerClient({
      ros : ros,
      tfClient : tfClient,
      topic : '/twist_marker_server',
      camera : viewer3D.camera,
      rootObject : viewer3D.selectableObjects
    });
};