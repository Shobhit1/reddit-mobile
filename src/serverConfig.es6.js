
function parseObject (list) {
  if (!list) { return; }
  var obj = {};
  var key;
  var value;
  var split;

  list.split(';').forEach(function (l) {
    if (l && l.indexOf('=')) {
      var split = l.split('=');
      obj[split[0].trim()] = split[1].trim();
    }
  });

  return obj;
}

function parseList (list) {
  if (!list) { return; }
  return list.split(';');
}


function serverConfig(numCPUs) {
  let env = process.env;
  let config = require('./config')();
  config.processes = numCPUs;


  if (config.minifyAssets) {
    // Import built-asset manifests for passing to layouts
    var jsManifest = require('./build/js/client-manifest.json');
    var cssManifest = require('./build/css/css-manifest.json');
    // Then merge them into a single object for ease of use later
    config.manifest = {};
    Object.assign(config.manifest, jsManifest, cssManifest);
  }

  config.apiHeaders = parseObject(env.API_HEADERS);
  config.apiPassThroughHeaders = parseList(env.API_PASS_THROUGH_HEADERS);
  config.actionNameSecret = env.ACTION_NAME_SECRET;

  config.experiments = parseObject(env.EXPERIMENTS);

  // Private, server-only config that we don't put in config.js, which is shared
  config.liveReload = env.LIVERELOAD === 'true';
  config.oauth = {
    clientId: env.OAUTH_CLIENT_ID || '',
    secret: env.OAUTH_SECRET || '',

    secretClientId: env.SECRET_OAUTH_CLIENT_ID || '',
    secretSecret: env.SECRET_OAUTH_SECRET || '',
  };

  config.keys = [ env.SERVER_SIGNED_COOKIE_KEY || 'lambeosaurus' ];

  return config;
}

export default serverConfig;