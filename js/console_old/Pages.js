/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Pages(name_page, pages) {
    //------------------------
    // Create navbar
    var html_navbar = "<div data-role='navbar' id='navbar'>" + "<ul>";
    for (var i = 0; i < pages.length; i++) {
        html_navbar += "<li>" +
                "<a href='#" + pages[i].name + "' data-icon='" + pages[i].icon + "' data-transition='fade'" + ">" +
                pages[i].title + "</a>" + "</li>";
    }
    html_navbar += "</ul>" + "</div>";

    // Create header
    var html_header = "<div data-role='header' data-theme='a' data-position='fixed'>";
    html_header += "<h1>" + name_page + "</h1>";
    html_header += "<a href='#drivepanel' data-role='button' class='ui-btn-right' data-inline='true' data-icon='bars'>Drive</a>";
    html_header += html_navbar;
    html_header += "</div>";

    $(html_header).prependTo("body").enhanceWithin();

    // Create footer
    var html_footer = "<div data-role='footer'id='footer' data-theme='a'>";
    html_footer += "<h4 id='footer_page'>" + "footer" + "</h4>";
    html_footer += "</div>";

    $(html_footer).appendTo("body").enhanceWithin();

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
}
