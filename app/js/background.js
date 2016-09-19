chrome.app.runtime.onLaunched.addListener(function() {
  chrome.runtime.connectNative('terminal');
  chrome.app.window.create('../window.html', {
  	id: 'main',
    'outerBounds': {
      'width': 800,
      'height': 620
    }
  });
});