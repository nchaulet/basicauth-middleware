# basicauth-middleware

Express js basicauth middleware

## Installation

```shell
npm install basicauth-middleware --save
```

## Usage

```
var app = express();

// Using plain username and password
app.use(basicauth('username', 'password'));

// Using callback
app.use(basicauth(function(username, password, cb) {
    var auth = checkAuth();

    cb(auth);
}));
