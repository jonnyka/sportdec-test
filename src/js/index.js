const express   = require('express'),
    app         = express(),
    exphbs      = require('express-handlebars'),
    port        = process.env.PORT || 8080,
    github      = require('./github'),
    twitter     = require('./twitter');

// templating
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts/',
    helpers: {
        ifEquals: function(a, b, opts) {
            if (a === b) {
                return opts.fn(this);
            }
            else {
                return opts.inverse(this);
            }
        }
    }
}));
app.set('views', 'src/views/');
app.set('view engine', 'handlebars');
app.use(express.static('src'));

let getData = function (req, res) {
    console.log('\x1b[0m', 'Getting github projects...');

    github.getProjects().then(function(projects) {
        let status = projects.status,
            data   = projects.data;

        // if status is 'ok', we got back the github projects without a problem
        if (status === 'ok') {
            let promises = [],
                githubId,
                project;

            console.log('\x1b[32m', 'Successfully requested the github projects\n');

            // we need to pass the githubId to the twitter get function so we can properly pair them after the promises has been resolved
            for (githubId in data) {
                if (data.hasOwnProperty(githubId)) {
                    project = data[githubId];
                    console.log('\x1b[0m', 'Getting tweets for ' + project.name + '...');

                    promises.push(new Promise(function (resolve, reject) {
                        try {
                            twitter.getTweets(project.name, githubId).then(function (twitterData) {
                                resolve(twitterData);
                            });
                        }
                        catch (error) {
                            console.log('\x1b[31m', 'Error in getting tweets: ' + error);
                            reject(error);
                        }
                    }));
                }
            }

            // we got all the tweets for the github projects, let's pair them
            Promise.all(promises).then(function(twitterDataArray) {
                let i,
                    twitterData;

                console.log('\x1b[32m', 'Successfully requested all the tweets');

                for (i in twitterDataArray) {
                    twitterData = twitterDataArray[i];
                    data[twitterData.id].twitterData = twitterData;
                }

                console.log('\x1b[0m', '');
                console.log('\x1b[0m', 'Final data we got:');
                console.log('\x1b[36m', data);
                console.log('\x1b[0m', '');

                // and render them in src/views/index.handlebars
                if (res) {
                    res.render('index', {
                        projects: data
                    });
                }
            });
        }
        else if (status === 'error') {
            console.log('\x1b[0m', '');
            console.log('\x1b[31m', 'Error in getting github projects: ' + data);
            console.log('\x1b[0m', '');

            if (res) {
                res.render('error', {
                    error: data
                });
            }
        }
    });
};

// http://localhost:8080
app.get('/', getData);
app.listen(port);
console.log('\x1b[33m', 'Express server started on port: ' + port + '\n');

// get data so you can see the output right after server start on the console
getData();
