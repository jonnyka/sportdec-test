const github = require('octonode'),
    config   = require('../config/config'),
    client   = github.client(config.githubToken);

function getProjects() {
    return new Promise(function(resolve, reject) {
        try {
            client.search().repos({
                q: 'Football',
                sort: 'updated',
                order: 'desc'
            }, function (err, response) {
                if (err) {
                    resolve({status: 'error', data: err});
                }
                // if we got back a minimum of 10 items, we're good to go
                else if (response && response.items && response.items.length >= 10) {
                    let footballRepo,
                        i,
                        projects = {};

                    for (i in response.items) {
                        if (i < 10 && response.items.hasOwnProperty(i)) {
                            footballRepo = response.items[i];
                            // we need the id so we can pair the projects with the tweets later
                            projects[footballRepo.id] = {
                                url: footballRepo.html_url,
                                name: footballRepo.full_name,
                                description: footballRepo.description
                            };
                        }
                    }

                    resolve({status: 'ok', data: projects});
                }
                else {
                    resolve({status: 'error', data: 'Something\'s wrong with the Github response.'});
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getProjects: getProjects
};
