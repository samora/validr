# Validr

Validations without ties to any framework. Inspired by validator, express-validator and validictorian.

## Installation

```
npm install validr
```

## Usage

If you have ever used [express-validator](https://github.com/ctavan/express-validator) you should feel right at home.

Here is an example using [Express](expressjs.com). Can be used similarly in any other framework.
```javascript
var express = require('express'),
  Validr = require('validr'),
  trimBody = require('trim-body');

app = express();

app.use(express.bodyParser());
app.use(app.router);

app.post('/user', function (req, res){
  trimBody(req.body);

  // Expected 'req.body' object format
  // {
  //   name: {
  //     first: <first name>,
  //     last: <last name>
  //   },
  // 
  //   email: <email>,
  // 
  //   age: <age>,
  //
  //   sex: <sex>,
  //
  //   occupation: <occupation>
  // }

  // 1. Create an instance of Validr.
  var validr = new Validr(req.body);

  // 2. Validations
  validr.validate('name.first', 'First Name is required.').isLength(1); // use string with dot-notation to validate nested fields
  validr.validate(['name', 'last'], 'Last Name is required.').isLength(1); // you can also use an array to validate nested fields
  validr.validate('email', {
    isLength: 'Email is required.',
    isEmail: 'Email must be valid.'
  }).isLength(1).isEmail(); // an object can be used to set separate validation messages for validators.
  validr.validate('age', 'Age must be a number.').isNumeric();
  validr.validate('sex', 'Sex must be M (male) or F (female).')
    .isIn(['M', 'F']).isLength(1); // validators are chainable

  // 3. Check for errors.
  var errors = validr.validationErrors();

  if (errors) return res.json(errors);

  // ...
  // Process req.body however you want. Example save to db.
});


app.listen(3000);
```

### Validation errors

You can get errors in two ways. Similar to [express-validator](https://github.com/ctavan/express-validator#validation-errors).

```javascript
var errors = validr.validationErrors();
var mappedErrors = validr.validationErrors(true);
```

errors:
```json
[
  {param: "email", msg: "Email is required.", value: "<received input>"},
  {param: "email", msg: "Email must be valid.", value: "<received input>"},
  {param: "age", msg: "Age must be a number.", value: "<received input>"}
]
```

mappedErrors:
```json
{
  email: {
    param: "email",
    msg: "Email must be valid.",
    value: "<received input>"
  },
  age: {
    param: "age",
    msg: "Age is required.",
    value: "<received input>"
  }
}
```


## Tests

```
npm install -g mocha
```

Then,
```
npm test
```

## License
MIT