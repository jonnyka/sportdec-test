const twitter = require('twitter'),
    config    = require('../config/config'),
    client    = new twitter({
        consumer_key: config.twitterConsumerKey,
        consumer_secret: config.twitterConsumerSecret,
        access_token_key: config.twitterAccessTokenKey,
        access_token_secret: config.twitterAccessTokenSecret
    });

function getTweets(query, id) {
    return new Promise(function(resolve, reject) {
        try {
            client.get('search/tweets', {q: query}, function (error, tweets) {
                if (error) {
                    resolve({id: id, status: 'error', data: error});
                }
                else if (tweets && tweets.statuses) {
                    // if the statuses array has any content, we have tweets about the project
                    if (tweets.statuses.length) {
                        resolve({id: id, status: 'ok', data: tweets.statuses});
                    }
                    // otherwise the request was successfull but there aren't any tweets about the project
                    else {
                        resolve({id: id, status: 'error', data: 'There are no tweets mentioning this repository'});
                    }
                }
                else {
                    resolve({id: id, status: 'error', data: 'Unknown error while getting tweets'});
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getTweets: getTweets
};
