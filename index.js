var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var qt = require('quickthumb');
var cmd = require('node-cmd');
var CronJob = require('cron').CronJob;
//configure app
var job = new CronJob('00 00 00 * * 1-7', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */

   cmd.run('rm -r /app/uploads/*mp4 /app/uploads/*flv  /app/uploads/*avi  /app/uploads/*wmv');
   cmd.run('rm -r /app/output/*mp4 /app/output/*flv  /app/output/*avi  /app/output/*wmv');
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);
var config= {
  port: process.env.PORT || 1337,
  description: "Your App's REST Backend",
  title: "Westcost Example API"
};


//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// use middleware
app.use(express.static(path.join(__dirname, 'bower_components/')));
app.use(express.static(path.join(__dirname, 'views'))); //  "public" off of current is root

app.use(bodyParser());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/upload', function (req, res) {
   // console.dir(req);
    // Get the temporary location of the file


    var form = new formidable.IncomingForm();

    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!");

                cmd.get(
                    'pwd',
                    function (data) {
                        console.log('the current working dir is : ', data)
                    }
                );

                console.log('./' + new_location + 'gifenc.sh ' + new_location + file_name + ' output/' + file_name + '.gif 720 10');
                cmd.run('./' + new_location + 'gifenc.sh ' + new_location + file_name + ' output/' + file_name + '.gif 720 10');
            }
        });
    });


    form.parse(req, function (err, fields, files) {
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write(files.datafile.name);
        res.end();
    });
});


app.get('/output/:id', function (req, res) {
    console.log("--------------------------------");
    console.log(req.params.id);
    console.log("--------------------------------");
    var file = __dirname + '/output/' +req.params.id;
    res.download(file); // Set disposition and send it.
});

// Launch Your Application
console.log("Launch Application");
var server = app.listen(config.port, function () {
  console.log('App running: http://%s:%s', server.address().address, server.address().port);
});
