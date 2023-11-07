const jwt = require('jsonwebtoken');

const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

const verifyToken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            console.log(authorization[1]);
            if (authorization[0] !== 'Bearer') {
                console.log("1");
                return res.status(401).send();
            } else {
                console.log("2");
                req.jwt = jwt.verify(authorization[1], secret);
                console.log("3")
                return next();
            }
        } catch (err) {
            console.log("4");
            return res.status(403).send("Authentication failed");
        }
    } else {
        return res.status(401).send("No authorization header found.");
    }
}

module.exports = verifyToken;
