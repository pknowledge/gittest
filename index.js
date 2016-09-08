var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var qt = require('quickthumb');
var cmd = require('node-cmd');
//configure app
//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// use middleware
app.use(express.static(path.join(__dirname, 'bower_components/')));
app.use(express.static(path.join(__dirname, 'views'))); //  "public" off of current is root

app.use(bodyParser());

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

app.listen(1337, function () {
    console.log("Hello node");
});
