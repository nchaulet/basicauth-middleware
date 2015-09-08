# basicauth-middleware

Express js basicauth middleware

## Installation

```shell
npm install basicauth-middleware --save
```

## Usage

```javascript
var app = express();

// Using plain username and password
app.use(basicauth('username', 'password'));

// Using sync callback
app.use(basicauth(function(username, password) {
    // Your check function
    var auth = checkAuth();

    return auth;
}));

// Using async callback
app.use(basicauth(function(username, password, cb) {
    // Your check function
    var auth = checkAuth();

    cb(auth);
}));
```

## Test

```shell
npm run test
```
