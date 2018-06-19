var spawn = require('child_process').spawn;
var EventEmitter = require('events');

var zipFiles = function(output, sourceFiles) {
  var args = ['-0j', output];
  var i = 0;
  const zipEmitter = new EventEmitter();
  var zipped = spawn('zip', args.concat(sourceFiles));

  zipped.stdout.on('data', function(d) {
    d = d.toString();

    const fetchingRegex = /adding:/;

    if (fetchingRegex.test(d)) {
      i++;
      zipEmitter.emit('progess', i);
    }
  });

  zipped.stderr.on('data', function(data) {
    data = data.toString();
    if (!data.startsWith('WARNING')) {
      zipEmitter.emit('error', );
      console.log('Error when zipping:', data);
    }
  });

  zipped.on('exit', function(code) {
    if (code.toString() == '0') {
      zipEmitter.emit('end');
    } else {
      zipEmitter.emit('error', parseInt(code.toString()));
    }
  });

  return zipEmitter;
}

exports.zipFiles = zipFiles;
