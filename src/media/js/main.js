define('main', [], function () {
if (!window.location.origin) {
  // For IE lol
  window.location.origin = window.location.protocol + '//' + window.location.host;
}

var $ = require('dom');
var app = new routes();
var GET = require('utils').parseQueryString();

if (GET.debug) {
  window.location.href = 'debug.html';
}

if (GET.lang) {
  document.webL10n.setLanguage(GET.lang);
}

document.webL10n.ready(function() {
  document.documentElement.dir = document.webL10n.getDirection();
  document.documentElement.lang = document.webL10n.getLanguage();

  var $ = require('dom');
  var pages = require('pages');
  var templating = require('templating');
  var user = require('user');

  var views = {
    '/': 'search'
  };

  Object.keys(views).forEach(function(path) {
    var view = require('views/' + views[path]);
    app.get(path, function(req) {
      document.title = pages.getTitle(req.url);
      view.init();
    });
  });

  app.load = function(url) {
    window.history.pushState(undefined, pages.getTitle(url), url);

    // We must have the exact pathname (no querystring parameters, etc.).
    app.test(pages.getPath(url));
  };

  $.delegate('click', 'a[href^="/"]', function(e) {
    e.preventDefault();
    app.load(e.target.getAttribute('href'));
  });

  $.delegate('keypress', 'body:not(.results) input[name=q]', function(e) {
    app.load('/');
  });

  templating.render('header', function(res) {
    $('.header').innerHTML = res;

    // Because `routes.js` listens for `window.load` event, explicitly load view.
    app.load(document.location.href);
  });
});

return {app: app};

});

require('main');
