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
			content : "Cold-pressed messenger bag vegan, farm-to-table pop-up irure keffiyeh disrupt heirloom kitsch. Nostrud four dollar toast exercitation Austin, do drinking vinegar biodiesel cred.",
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
					marker.options.keyboard = true;
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

			var popup = '<div class="my-popup-content"><h4>' + datum.title + '</h4><p>' + datum.content + '</div></p>';
			
			if( datum.lat !== '' &&  datum.lng !== ''){
					var marker = L.marker([datum.lat,datum.lng]);
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

		// remove the shadow pane (otherwise each tile receives focus)
		$('.leaflet-shadow-pane').remove();
		
		// prevent screen readers from reading out each map tile
		$('.leaflet-tile-container img, .leaflet-shadow-pane img').attr('role','presentation').attr('alt','');

	}

	doBadMap();
	doGoodMap();

});	