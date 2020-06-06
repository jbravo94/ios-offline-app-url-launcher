var express = require('express');
var path = require('path');
const fs = require('fs');
var hb = require('express-handlebars').create();
var vars = require('./vars.json');

var img = fs.readFileSync('icon80.jpg', { encoding: 'base64' });
var instructionImage = fs.readFileSync('instructionImageiPhone.jpg', { encoding: 'base64' });

vars.encodedTouchIcon = img;
vars.encodedIcon = img;
vars.instructionImage = instructionImage;
vars.launchImageLandscape = img;
vars.launchImagePortrait = img; 

const app = express();

let base64 = "";

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index', { vars: vars });
});

app.get('/rendered', (req, res) => {
    res.render('template', { vars: vars });
});

app.get('/dataurl', (req, res) => {

    const template = hb.handlebars.compile(fs.readFileSync('./views/template.hbs', 'utf8'));
    const result = template({ vars: vars });

    base64 = Buffer.from(result).toString('base64');

    var launcherVars = {};
    launcherVars.base64String = base64;

    const launcherTemplate = hb.handlebars.compile(fs.readFileSync('./views/dataUrlGenerator.hbs', 'utf8'));
    const launcherResult = launcherTemplate({ vars: launcherVars });

    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(launcherResult));
});

app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});