const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const Rasha = require("rasha"); // RSA support
let endpoints = {
    PEM: "https://www.googleapis.com/oauth2/v1/certs",
    JWK: "https://www.googleapis.com/oauth2/v3/certs",
};
let PEM = {};
let JWK = { keys: [] };

/**
 * @typedef Keys
 * @property {String} PEM
 * @property {Object} JWK
 */
/** @function refreshKeys
 * refresh google public keys (PEM, JWK)
 * @returns {Promise<Keys>} Promise object represents the {PEM,JWK}
 */
async function refreshKeys() {
    return new Promise((resolve, reject) => {
        fetch(endpoints.PEM)
            .then((res) => res.json())
            .then((pemJson) => {
                PEM = pemJson;
                fetch(endpoints.JWK)
                    .then((res) => res.json())
                    .then((jwkJson) => {
                        JWK = jwkJson;
                        resolve({ PEM, JWK });
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

/** @function validate
 * validate google jwt
 * @param {String} token Google JWT
 * @param {String=} format Choose between PEM and JWK, PEM is the default
 * @returns {Promise<Keys>} Promise object represents the decoded jwt
 */
function validate({ token, format = "PEM" }) {
    return new Promise(async function (resolve, reject) {
        try {
            const { header } = jwt.decode(token, { complete: true });
            let key = await selectKey(header.kid, format);

            if (!key) reject("Error during key selection");
            if (format === "JWK") {
                console.log("JWK");
                key = await Rasha.export({ jwk: key });
            }

            const payload = await jwt.verify(token, key, {
                algorithms: ["RS256"],
            });

            resolve(payload);
        } catch (e) {
            reject(e);
        }
    });
}

async function selectKey(kid, format, retry = 1) {
    let key;

    if (format === "PEM" && PEM?.[kid]) {
        key = PEM[kid];
    } else if (format === "JWK") {
        JWK.keys.forEach(function (jwk) {
            if (jwk.kid === kid) {
                key = jwk;
            }
        });
    }
    //key not found, update keys
    if (!key && retry > 0) {
        console.log("riprovo");
        await refreshKeys();
        return await selectKey(kid, format, retry - 1);
    }
    return key;
}

/** @function changeEndpoints
 * modify default endpoints for fetch keys
 * @param {Object} values change endpoints
 * @param values.PEM PEM endpoint for public key
 * @param values.JWK JWK endpoint for public key
 */
function changeEndpoints(values) {
    endpoints = values;
}

module.exports = {
    validate,
    refreshKeys,
    changeEndpoints,
};
