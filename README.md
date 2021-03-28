# google-jwt-validation

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f53ae4a2d36740f582f7b9a6a8dcec46)](https://app.codacy.com/gh/alessandro-caldonazzi/google-jwt-validation?utm_source=github.com&utm_medium=referral&utm_content=alessandro-caldonazzi/google-jwt-validation&utm_campaign=Badge_Grade_Settings)
[![npm](https://img.shields.io/npm/dt/google-jwt-validation)](https://www.npmjs.com/package/google-jwt-validation)
[![npm](https://img.shields.io/npm/v/google-jwt-validation)](https://www.npmjs.com/package/google-jwt-validation)

## Install

```shell
npm i google-jwt-validation
```

## Import in project

```js
const googleJwtValidation = require("google-jwt-validation");
```

## Validate a JWT

```js
googleJwtValidation
    .validate({ token })
    .then((decoded) => {
        //do stuff with your valid token
    })
    .catch((err) => console.log(err));
```

If you want, you can use await.

## Manually refresh google public keys

This will take care to update the keys when become invalid, but if you want, you can refresh the keys by yourself.

```js
googleJwtValidation
    .refreshKeys()
    .then(({ PEM, JWK }) => {
        //do stuff with the copy of the keys
    })
    .catch((err) => console.log(err));
```

## Change default endpoints

To change the default endpoints for the keys, call the changeEndpoints() method

```js
googleJwtValidation.changeEndpoints({
    PEM: "https://www.googleapis.com/oauth2/v1/certs",
    JWK: "https://www.googleapis.com/oauth2/v3/certs",
});
```
