// jshint devel:true

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

if (document.getElementById('main') !== null) {
	document.getElementById('main').setAttribute('tabindex',0);
}