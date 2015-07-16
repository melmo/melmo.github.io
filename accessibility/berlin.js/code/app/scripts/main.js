/*
*
*	Logical tab index 
*
*/

var tabbable = ['a', 'input', 'select', 'button', 'textarea'];

for (var i = 0; i < tabbable.length; i++) {
	var elem = document.getElementsByTagName(tabbable[i]);
	for (var j = 0; j < elem.length; j++) {
		elem[j].setAttribute('tabindex', 0);
	}
}


/*
*
*	Skip navigation polyfill 
*
*/

window.addEventListener("hashchange", function(event) {

    var element = document.getElementById(location.hash.substring(1));

    if (element) {

        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
        }

        element.focus();
    }

}, false); 

/*
*
*
* Accessible Leaflet Maps
*
*/

jQuery(document).ready(function($) {

	var mapData = [
		{
			title : "Mustache",
			content : "Cold-pressed messenger bag vegan, farm-to-table pop-up irure keffiyeh disrupt heirloom kitsch.",
			lat : 52.505900,
			lng : 13.418049
		},
		{
			title : "McSweeney",
			content : "Sustainable irony incididunt, lo-fi butcher pour-over ethical.",
			lat : 52.503980, 
			lng : 13.425409
		}
	];

	function doBadMap() {
		// create a map in the "map" div, set the view to a given place and zoom
		var map = L.map('badmap').setView([52.503602, 13.420131], 12);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		
		// add popups to the map from our data set	
		for(i=0; i< mapData.length; i++) {

			var datum = mapData[i];

			var popup = '<div class="my-popup-content"><h4>' + datum.title + '</h4><p>' + datum.content + '</p></div>';
			
			if( datum.lat !== '' &&  datum.lng !== ''){
					var marker = L.marker([datum.lat,datum.lng]);
					marker.options.title = datum.title;
					marker.options.alt = datum.title;
					marker.addTo(map)
				    .bindPopup(popup);	
			}

		}

	}

	function doGoodMap() {
		// create a map in the "map" div, set the view to a given place and zoom
		var map = L.map('goodmap').setView([52.503602, 13.420131], 12);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		
		// add popups to the map from our data set	
		for(i=0; i< mapData.length; i++) {

			var datum = mapData[i];

			var popup = '<div class="my-popup-content"><h4>' + datum.title + '</h4><p>' + datum.content + '</p></div>';
			
			if( datum.lat !== '' &&  datum.lng !== ''){
					var marker = L.marker([datum.lat,datum.lng]);
					
					// allow keyboard interaction
					marker.options.keyboard = true;

					marker.options.title = datum.title;
					marker.options.alt = datum.title;
					marker.addTo(map)
				    .bindPopup(popup);
			}

			// Accessibility improvements

			map.on('popupopen',function(popup) {	

				// shift focus to the popup when it opens			
				$(popup.popup._container).find('.my-popup-content').attr('tabindex','-1').focus();

				// move the close button to the end of the popup content so screen readers reach it
				// after the main popup content, not before
				var close = $(popup.popup._container).find('.leaflet-popup-close-button');
				$(popup.popup._container).find('.leaflet-popup-close-button').remove();
				close.attr('title','Close item');
				$(popup.popup._container).append(close);

			});

			// return focus to the icon we started from before opening the pop up
			map.on('popupclose',function(popup) {
				$(popup.popup._source._icon).focus();
			});

		}

		// remove the shadow pane (otherwise each image receives focus)
		$('#goodmap .leaflet-shadow-pane').remove();
		
		// prevent screen readers from reading out each map tile
		$('#goodmap .leaflet-tile-container img, #goodmap .leaflet-shadow-pane img').attr('role','presentation').attr('alt','');

	}

	if ($('#goodmap').length>0 && $('#badmap').length>0) {
		doBadMap();
		doGoodMap();
	}

	

});	

/*
*
* Owl Carousel
*
*
*/

$(document).ready(function() {

	$("#owl-single-example").owlCarousel({
		singleItem : true,
	 	pagination : false,
	 	navigation : true, // show next and previous buttons
	 	addClassActive : true, // visible items have class active
	 	afterInit : function() { 

	 		$('#owl-single-example .owl-item').attr('aria-selected','false');
	 		$('#owl-single-example .owl-item.active').attr('aria-selected','true'); // let screen readers know an item is active

	 		// apply meta info to next and previous buttons and make them focusable
			$('#owl-single-example .owl-prev').attr('role','button').attr('title','Previous');
	 		$('#owl-single-example .owl-next').attr('role','button').attr('title','Next');
	 		$('#owl-single-example, .owl-prev, .owl-next').attr('tabindex','0');

	 		// add instructions to keyboard users that are only visible when the carousel is focused
	 		$('#owl-single-example .owl-wrapper-outer').append('<p class="alert alert-success show-on-focus">Use left and right arrow keys to navigate.</p>');

	 		// listen for keyboard input
	 		$(document).on('keydown', function(e){

			    var $focusedElement = $(document.activeElement),
					singleOwl = $("#owl-single-example").data('owlCarousel'),
			        type = e.which == 39? 'next': null,
			        type = e.which == 37? 'prev': type,
			        type = e.which == 13? 'enter':type;

			    // if the carousel is focused, use left and right arrow keys to navigate
			    if($focusedElement.attr('id') === 'owl-single-example'){

			    	if (type == 'next') {
			    		singleOwl.next();
			    	} else if (type == 'prev') {
			    		singleOwl.prev();
			    	}

			    // if the prev and next buttons are focused, catch "Enter" and navigate in the right direction
			    } else if (type == 'enter') {
	 				if ($focusedElement.hasClass('owl-next')) {
	 					singleOwl.next();
	 				} else if ($focusedElement.hasClass('owl-prev')) {
	 					singleOwl.prev();
	 				}
			    }

			});
	 	},
	 	// let screen readers know which slide is active after navigation or reinit
	 	afterAction : function() {
	 		$('#owl-single-example .owl-item').attr('aria-selected','false');
	 		$('#owl-single-example .owl-item.active').attr('aria-selected','true');
	 	}
	 });

	$("#owl-multi-example").owlCarousel({

		pagination : false, // must be set to false or the carousel won't move to bring out of sight elements into view on focus
	 	navigation : true, 

		afterInit : function() { 
			// make individual items focusable
	 		$('#owl-multi-example .owl-item').attr('aria-selected','false').attr('tabindex','0');
	 		$('#owl-multi-example').attr('tabindex','0');

	 		// on when an item has focus, let screen readers know it is active
	 		$('#owl-multi-example .owl-item').on('focus',function() {
	 			$('#owl-multi-example .owl-item').attr('aria-selected','false');
	 			$(this).attr('aria-selected','true');
	 		});

	 		// show instructions to keyboard users when the carousel is focused
	 		$('#owl-multi-example .owl-wrapper-outer').append('<p class="alert alert-success show-on-focus">Use tab and shift+tab to navigate.</p>');

	 	}

	});
 
});


/*
*
* Isotope Demo
*
*
*/

$( document ).ready( function() {
	/*
	* Filter demo from http://isotope.metafizzy.co/
	*
	*/
  // init Isotope
  var $container = $('.isotope').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows',
    getSortData: {
      name: '.name',
      symbol: '.symbol',
      number: '.number parseInt',
      category: '[data-category]',
      weight: function( itemElem ) {
        var weight = $( itemElem ).find('.weight').text();
        return parseFloat( weight.replace( /[\(\)]/g, '') );
      }
    }
  });

  // filter functions
  var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function() {
      var number = $(this).find('.number').text();
      return parseInt( number, 10 ) > 50;
    },
    // show if name ends with -ium
    ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
    }
  };

  // bind filter button click
  $('#filters').on( 'click', 'button', function() {
    var filterValue = $( this ).attr('data-filter');
    // use filterFn if matches value
    filterValue = filterFns[ filterValue ] || filterValue;
    $container.isotope({ filter: filterValue });

	
  });


  // change is-checked class on buttons
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
    });
  });

  /*
  *
  *	Accessibility
  * Once the filter is complete, announce the num of found results
  * and make visible results tabbable
  *
  */
  $container.on( 'arrangeComplete', function( event, filteredItems ) {
  	$('#results').html(filteredItems.length + ' items found.');
    $('#results').attr('tabindex','-1').focus();
    $('.element-item').removeAttr('tabindex');
    for (var i=0;i<filteredItems.length;i++) {
    	$(filteredItems[i].element).attr('tabindex',0);
    }
    
  });
  
});
