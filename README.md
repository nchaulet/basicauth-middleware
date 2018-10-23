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

// Using an array of username and password
app.use(basicauth([['username', 'password'], ['username2', 'password2']]);

// Using sync callback
app.use(basicauth((username, password) => {
    // Your check function
    const auth = checkAuth();

    return auth;
}, 'custom optional realm'));

// Using node style async callback
app.use(basicauth((username, password, cb) => {
    // Your check function
    const auth = checkAuth();

    cb(null, auth);
}, 'custom optional realm'));

// Using Promise
app.use(basicauth((username, password) => {
    // Your check function
    return checkAuth(username, password).then(() => {
      return true;
    });
}, 'custom optionnal realm'));

// Or async/await function
app.use(basicauth(async (username, password) => {
    // Your check function
    await checkAuth(username, password);

    return true;
}, 'custom optionnal realm'));
```

## Test

```shell
npm run test
```
