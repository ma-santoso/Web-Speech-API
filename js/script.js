document.addEventListener('DOMContentLoaded', function() {
	if (!('webkitSpeechRecognition' in window)){
		showInfo('er_upgrade');
	} else {
		var recognition = new webkitSpeechRecognition();
		var listening = false;
		var trigger = ['open','run','execute','launch','runn','execut'];
		var article = ['a','an','the'];
		var adjunct = [undefined,'please','for'];
		var result = document.getElementById('result');
		var name = [];
		var alias = [];
		var program = [];

		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		showInfo('info_start');

		readJSON('json/appList.json', function(text) {					// read settings from appList.json
			var json = JSON.parse(text);
			var total = json.appList.length;
			for (var i = 0; i < total; i++) {
				name[i] = json.appList[i].name;
				alias[i] = json.appList[i].alias;
				program[i] = json.appList[i].program;
				addEntry(name[i], alias[i], program[i]);
			}
		})

		micButton.onclick = function() {								// mic button clicked
			if (listening === false) {									// if no recognition happening
				recognition.start();										// start recognition
			} else {													// otherwise
				recognition.abort();										// abort it
			}
		}

		recognition.onstart = function() {								// recognition onstart event
			showInfo('info_active');									// change info to show 'listening'
			micButton.className = 'listening';
			listening = true;											// change state to listening
			console.log('STATUS: listening...');
		}

		recognition.onresult = function(event) {						// recognition onresult event
			var recognizedText = event.results[0][0].transcript;		// save the first result in a variable
			var word = recognizedText.split(' ');						// split the result into words

			listening = false;											// change the listening state to false
			showInfo('info_start');										// change the info to display the initial info
			micButton.className = '';
			
			clearResult();												// call (clearResult function)
			console.log('RECOGNIZED TEXT: ', recognizedText)			
			displayResult('RECOGNIZED TEXT: ', recognizedText);			// display the recognized text into the result box
			parse(word);												// parsing the split word by calling the (parse function)
		}

		recognition.onerror = function(event) {							// recognition onerror event
			micButton.className = '';
			listening = false;											// change the state of listening to false
			switch (event.error) {										// display the error description in the info box
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
			}
			console.log('ERROR: ' + event.error);
		}

		recognition.onend = function() {								// recognition onend event
			recognition.stop();											// stop the recognition
			listening = false;											// change the listening state to false
			console.log('STATUS: stopped');
		}
	}

	function showInfo(state) {											// function to display the state in the info box
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

	function parse(text) {												// function to parse the recognized text
		var word = new Object();
		var a, b, x;
		
		for (var i = 0; i < text.length; i++) {
			for (var j = 0; j < trigger.length; j++) {
				if (text[i] == trigger[j] || text[i] == trigger[j]+'ing') {			// compare the text to find the trigger word
					x = i;															// save the word into a variable
					for (var k = 0; k < article.length; k++) {						// scroll through the words after it
						if (text[x+1] == article[k]) {								// compare those words to find if it contains an 'article'
							a = x+2;												// if there is, the the 'alias' is located two words after the trigger word
							break;
						} else {
							a = x+1;												// otherwise, the 'alias' word is located right after the trigger word
						}
					}
					for (var l = 0; l < adjunct.length; l++) {
						if (text[a+1] == adjunct[l]) {								// also compare those words to find out if there is an 'adjunct'
							b = a;													// if there is, the 'app' only consists of one word and is equal to 'alias'
							break;
						} else {
							b = a+1;												// otherwise, the 'app' consists of two words -- the 'alias' and the word after it
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
				word.app = word.alias + ' ' + text[b];
			}
			else {
				word.app = word.alias;
			}
			console.log('a:',a,'\talias:',word.alias);
			console.log('b:',b,'\tparsed:',word.app);
			displayResult('PARSED TEXT: ', word.app.toLowerCase());

			execute(word.alias.toLowerCase());
		}
	}

	helpMenu.onclick = function() {
		openModal('help');
	}

	prefMenu.onclick = function() {
		openModal('pref');
	}

	addApp.onclick = function() {
		openModal('prompt');
	}

	helpClose.onclick = function() {
		closeContainer();
	}

	prefClose.onclick = function() {
		closeContainer();
	}

	promptCancel.onclick = function() {
		closePrompt();
		closeSmallContainer();
	}

	promptSave.onclick = function() {
		var appName = inputAppName.value;
		var appAlias = inputAppName.value.split(' ')[0].toLowerCase();
		var pos = entryContainer.childElementCount;
		addEntry(appName,appAlias,'');
		closePrompt();
		closeSmallContainer();
	}

	prefSave.onclick = function() {
		readEntry();
		saveEntry();
		closeContainer();
		console.log(name, alias, program);
	}

	function clearResult() {												// function to clear the result box
		var p = result.children;
		while (p.length > 1) {
			p[1].parentNode.removeChild(p[1]);
		}
	}

	function displayResult(name, text) {									// function to display result in the result box
		var p = document.createElement('p');
		var i = document.createTextNode(name + text);
		result.children[0].style.display = 'none';
		p.appendChild(i);
		result.appendChild(p);
	}

	function execute(app) {													// function to execute app
		for (var i = 0; i < name.length; i++) {
			if (app == alias[i]) {
				chrome.runtime.sendNativeMessage("message",{"text":"launch " + program[i]});
				console.log('Launching', name[i]);
				showInfo('info_launched');
				break;
			} else {
				console.log('No app registered with that name', '');
			}
		}
	}

	function addEntry(name, alias, program) {
		var it = document.createElement('input');
		var ib = document.createElement('input');
		var ic = document.createElement('div');
		var h6 = document.createElement('h6');
		var ae = document.createElement('div');
		it.type = 'text';
		it.name = alias;
		it.value = program
		ib.type = 'button';
		ib.value = 'Remove';
		ib.classList += 'btnRemove';
		ic.classList += 'input-container';
		h6.innerHTML = name + ':';
		ae.classList += 'app entry';

		ic.appendChild(it);
		ic.appendChild(ib);
		ae.appendChild(h6);
		ae.appendChild(ic);
		entryContainer.appendChild(ae);

		removeEntry();
	}

	function removeEntry() {
		var entry = entryContainer.childElementCount
		for (var n = 0; n < entry; n++) {
			var rem = entryContainer.children[n].children[1].children[1];
			rem.onclick = function() {
			  	this.parentElement.parentElement.remove();
		  	}
		}
	}

	function readEntry() {
		var entry = entryContainer.children;
		var entryCount = entryContainer.childElementCount;
		name = [];
		alias = [];
		program = [];
		for (var i = 0; i < entryCount; i++) {
			name[i] = entry[i].children[0].innerHTML.split(':')[0];;
			alias[i] = entry[i].children[0].innerHTML.split(' ')[0].toLowerCase();
			program[i] = entry[i].children[1].children[0].value;
		}
	}

	function saveEntry() {
		var port = chrome.runtime.connectNative('message');
		var entryCount = entryContainer.childElementCount;

		port.onMessage.addListener(function(msg) {
		  console.log(msg.text);
		});

		port.onDisconnect.addListener(function() {
		  console.log('Disconnected');
		});

		port.postMessage({"text":"entry: " + entryCount});
		for (var i = 0; i < entryCount; i++) {
			port.postMessage({"text":"name " + name[i] + " program " + program[i]});
		}
		port.postMessage({"text":"#STOP#"});
	}

	function openModal(modal) {
		openContainer();
		closeModal();
		if (modal == 'help') {
			helpModal.style.display = 'block';
		} else if (modal == 'pref') {
			prefModal.style.display = 'block';
		} else if (modal == 'prompt') {
			openSmallContainer();
			prefModal.style.display = 'block';
			promptModal.style.display = 'block';
		}
	}

	function closeModal() {
		helpModal.style.display = 'none';
		prefModal.style.display = 'none';
		promptModal.style.display = 'none';
	}

	function openContainer() {
		modalContainer.style.display = 'block';
	}

	function closeContainer() {
		modalContainer.style.display = 'none';
	}

	function openSmallContainer() {
		smallModalContainer.style.display = 'block';
	}

	function closeSmallContainer() {
		smallModalContainer.style.display = 'none';
	}

	function closePrompt() {
		inputAppName.value = '';
		promptModal.style.display = 'none';
	}

	function readJSON(file, callback) {
		var raw = new XMLHttpRequest();
		raw.overrideMimeType('application/json');
		raw.open('GET',file,true);
		raw.onreadystatechange = function () {
			if (raw.readyState === 4 && raw.status == '200') {
				callback(raw.responseText);
			}
		}
		raw.send(null);
	}
});
