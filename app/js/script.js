document.addEventListener('DOMContentLoaded', function() {
	if (!('webkitSpeechRecognition' in window)){
		showInfo('er_upgrade');
	} else {
		var recognition = new webkitSpeechRecognition();
		var listening = false;
<<<<<<< HEAD
		var appList = ['file','image','music','office','terminal','text'];
		var trigger = ['open','run','execute','launch'];
		var article = ['a','an','the'];
		var adjunct = [undefined,'please','for'];
		var result = document.getElementById('result');

=======
>>>>>>> 4484bc67a65bdc61b847b6d9bc10c04b83c33cc5
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
<<<<<<< HEAD
			var word = recognizedText.split(' ');

			listening = false;
			showInfo('info_start');
			button.className = '';
			
			clearResult();
			console.log('RECOGNIZED TEXT: ', recognizedText)
			displayResult('RECOGNIZED TEXT: ', recognizedText);
			parse(word);
=======
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
>>>>>>> 4484bc67a65bdc61b847b6d9bc10c04b83c33cc5
		}

		recognition.onerror = function(event) {
			button.className = '';
			listening = false;
<<<<<<< HEAD
			switch (event.error) {
				case 'no-speech':
					showInfo('er_nospeech');
					break;
				case 'aborted':
					showInfo('er_aborted');
					break;
				case 'audio-capture':
					showInfo('er_nomic');
					break;
				case 'network':
					showInfo('er_network');
					break;
				case 'not-allowed':
					showInfo('er_notallowed');
					break;
				case 'service-not-allowed':
					showInfo('er_noservice');
=======
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
>>>>>>> 4484bc67a65bdc61b847b6d9bc10c04b83c33cc5
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

<<<<<<< HEAD
	function parse(text) {
		var word = new Object();
		var a, b, x;
		
		for (var i = 0; i < text.length; i++) {
			for (var j = 0; j < trigger.length; j++) {
				if (text[i] == trigger[j]) {
					x = i;
					for (var k = 0; k < article.length; k++) {
						if (text[x+1] == article[k]) {
							a = x+2;
							break;
						} else {
							a = x+1;
						}
					}
					for (var l = 0; l < adjunct.length; l++) {
						if (text[a+1] == adjunct[l]) {
							b = a;
							break;
						} else {
							b = a+1;
						}
					}
				}
			}
		}
		word.trigger = text[x];
		console.log('x:',x,'\ttrigger:',word.trigger);
		if (a != undefined){
			word.alias = text[a];
			if (a != b) {
				word.parsed = word.alias + ' ' + text[b];
			}
			else {
				word.parsed = word.alias;
			}
			console.log('a:',a,'\talias:',word.alias);
			console.log('b:',b,'\tparsed:',word.parsed);
			execute(word.alias);
			displayResult('PARSED TEXT: ', word.parsed);
			displayResult('STATUS: Launching ', word.parsed);
		}
	} 

	function clearResult() {
		var p = result.children;
		while (p.length > 1) {
			p[1].parentNode.removeChild(p[1]);
		}
	}

	function displayResult(name, text) {
		var p = document.createElement('p');
		var i = document.createTextNode(name + text);
		result.children[0].style.display = 'none';
		p.appendChild(i);
		result.appendChild(p);
	}

	function execute(app) {
		for (var i = 0; i < appList.length; i++) {
			if (app.toLowerCase() == appList[i]) {
				chrome.runtime.connectNative(app.toLowerCase());
				console.log('Launching', app);
			}
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
=======
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
>>>>>>> 4484bc67a65bdc61b847b6d9bc10c04b83c33cc5
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
