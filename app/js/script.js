document.addEventListener('DOMContentLoaded', function() {
	if (!('webkitSpeechRecognition' in window)){
		showInfo('er_upgrade');
	} else {
		var recognition = new webkitSpeechRecognition();
		var listening = false;
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		showInfo('info_start');

		button.onclick = function() {
			if (listening === false) {
				recognition.start();
			} else {
				recognition.abort();
			}
		}

		recognition.onstart = function() {
			showInfo('info_active');
			button.className = 'listening';
			listening = true;
			console.log('STATUS: listening...');
		}

		recognition.onresult = function(event) {
			var recognizedText = event.results[0][0].transcript;
			var result = document.getElementById('result');
			listening = false;
			showInfo('info_start');
			button.className = '';
			chrome.storage.local.set({output: recognizedText}, function() {
				console.log('STATUS: result saved');
			});
			chrome.storage.local.get('output', function(data) {
				console.log('RESULT: ' + data.output);
			});
			execute(recognizedText);
		}

		recognition.onerror = function(event) {
			button.className = '';
			listening = false;
			if (event.error == 'no-speech') {
				showInfo('er_nospeech');
			}
			if (event.error == 'aborted') {
				showInfo('er_aborted');
			}
			if (event.error == 'audio-capture') {
				showInfo('er_nomic');
			}
			if (event.error == 'network') {
				showInfo('er_network');
			}
			if (event.error == 'not-allowed') {
				showInfo('er_notallowed');
			}
			if (event.error == 'service-not-allowed') {
				showInfo('er_noservice');
			}
			console.log('ERROR: ' + event.error);
		}

		recognition.onend = function() {
			recognition.stop();
			listening = false;
			console.log('STATUS: stopped');
		}
	}

	function showInfo(state) {
		if (state) {
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

	function execute(text) {
		var result = document.getElementById('result');
		var p = document.createElement('p');
		result.innerHTML = '<p>RECOGNIZED TEXT: ' + text + '</p>';
		if (text === 'open Terminal') {
			chrome.runtime.connectNative('terminal');
			var i = document.createTextNode('STATUS: Opening terminal');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'open music') {
			chrome.runtime.connectNative('music');
			var i = document.createTextNode('STATUS: Opening Spotify');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'open Libre office') {
			chrome.runtime.connectNative('office');
			var i = document.createTextNode('STATUS: Opening LibreOffice');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'open file explorer') {
			chrome.runtime.connectNative('file');
			var i = document.createTextNode('STATUS: Opening File Explorer');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'open image editor') {
			chrome.runtime.connectNative('gimp');
			var i = document.createTextNode('STATUS: Opening GIMP');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'open text editor') {
			chrome.runtime.connectNative('text');
			var i = document.createTextNode('STATUS: Opening Text Editor');
			p.appendChild(i);
			result.appendChild(p);
		}
		if (text === 'what time is it') {
			var date = new Date();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var period;
			if (hour > 12) {
				hour -= 12;
				period = 'PM';
			} else {
				period = 'AM';
			}
			var i = document.createTextNode("STATUS: It's now " + hour + ":" + minute + " " + period);
			p.appendChild(i);
			result.appendChild(p);
		}
	}

	helpMenu.onclick = function() {
		openModal('help');
	}

	prefMenu.onclick = function() {
		openModal('pref');
	}

	helpClose.onclick = function() {
		closeContainer();
	}

	prefClose.onclick = function() {
		closeContainer();
	}

	function openModal(modal) {
		openContainer();
		closeModal();
		if(modal == 'help') {
			helpModal.style.display = 'block';
		} else {
			prefModal.style.display = 'block';
		}
	}

	function closeModal() {
		helpModal.style.display = 'none';
		prefModal.style.display = 'none';
	}

	function openContainer() {
		modalContainer.style.display = 'block';
	}

	function closeContainer() {
		modalContainer.style.display = 'none';
	}

	helpMail.onclick = function() {
		window.open('mailto:marsa.agung.s@mail.ugm.ac.id');
	}

	helpGithub.onclick = function() {
		window.open('https://github.com/ma-santoso/Web-Speech-API/');
	}

	var ref = document.getElementsByClassName('w3cRef');
	for (var i = 0; i < 2; i++) {
		ref[i].onclick = function() {
			window.open('https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html');
		}
	}
});
