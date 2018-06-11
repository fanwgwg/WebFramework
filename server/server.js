const fs = require('fs');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8')).users;

server.use(jsonServer.bodyParser);
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789';
const expiresIn = '3h';

const createToken = payload => jwt.sign(payload, SECRET_KEY, {expiresIn});
const verifyToken = token => jwt.verify(token, SECRET_KEY, (err, decode) => (
    decode !== undefined ? decode : err
));
const findAuthenticatedUser = (email, password) => (
    users.find(user => user.email === email && user.password === password)
);

server.post('/auth', (req, res) => {
    console.log('auth in server');
    console.log(req.body);
    const {email, password} = req.body;
    const user = findAuthenticatedUser(email, password);
    if (!user) {
        const status = 401;
        const message = 'Incorrect email or password';
        res.status(status).json({status, message});
        return;
    }
    const status = 200;
    const accessToken = createToken({email, password});
    res.status(200).json({status, accessToken, user});
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401;
        const message = 'Error in authorization format';
        res.status(status).json({status, message});
        return;
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1]);
        next();
    } catch (err) {
        const status = 401;
        const message = 'Error access_token is revoked';
        res.status(status).json({status, message});
    }
});

server.use(router);
server.listen(3000, () => {
    console.log('JSON server running');
});
