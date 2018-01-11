# Sportdec test

Sportdec nodejs test exercise solution by Gergo Nagy

### Prerequisites

You need `NodeJS (6.10.3+)` and `npm (3.10.10+)` to run the server. Also  the default port it runs on is `8080` so make sure that's available.

### Installing

To install packages:

```
npm install
```

To run the server:

```
npm start
```

### Accessing APIs

To be able to access Github and Twitter APIs, please copy `src/config/config.js.sample` into `src/config/config.js` and put in your own credentials.

## Checking the output

After `npm start` you can see the output right away on the console. 
If you want to see a nicer output, open your browser here:

```
http://localhost:8080/

```

### Packages used

- server: http://expressjs.com
- templating: http://handlebarsjs.com
- github integration: https://github.com/pksunkara/octonode
- twitter integration: https://github.com/desmondmorris/node-twitter

## License

This project is licensed under the MIT License.