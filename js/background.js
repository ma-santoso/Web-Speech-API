chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../window.html', {
  	id: 'main',
    'outerBounds': {
      'width': 600,
      'height': 600
    }
  });
});