document.addEventListener('DOMContentLoaded', function() {
	var result = '';
	if (!('webkitSpeechRecognition' in window)){
		upgrade();
	} else {
		console.log('Browser up to date');
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		showInfo('info_start');

		button.onclick = function() {
			recognition.start();
			recognition.onstart = function() {
				showInfo('info_active');
			}
			recognition.onend = function() {
				showInfo('info_start');
				recognition.onresult = function(event) {
					var text = event.results[0][0].transcript;
					console.log(text);
					result.innerHTML = text;
				}
			}
		}

		function showInfo(state) {
			if(state) {
				for (var child = info.firstChild; child; child = child.nextSibling) {
					if (child.style) {
						child.style.display = child.id == state ? 'inline' : 'none';
					}
				}
				info.style.visibility = 'visible';
			} else {
				info.style.visibility = 'hidden';
			}
		}
	}
});