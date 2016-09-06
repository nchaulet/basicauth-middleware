# basicauth-middleware

Express js basicauth middleware

## Installation

```shell
npm install basicauth-middleware --save
```

## Usage

```javascript
const app = express();
const basicauth = require('basicauth-middleware');

// Using plain username and password
app.use(basicauth('username', 'password'));

// Using plain username and password with custom realm
app.use(basicauth('username', 'password', 'Secrets Within!'));

// Using sync callback
app.use(basicauth(function(username, password) {
    // Your check function
    const auth = checkAuth();

    return auth;
}));

// Using node style async callback
app.use(basicauth(function(username, password, cb) {
    // Your check function
    const auth = checkAuth();

    cb(null, auth);
}));
```

// Using Promise
app.use(basicauth(function(username, password, cb) {
    // Your check function
    return checkAuth(username, password).then(() => {
      return true;
    });
}));
```

## Test

```shell
npm run test
```
