var express = require('express');
var bodyParser = require('body-parser');

//-------------------->   For Session Related :

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;


var data;

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const FabricCAServices = require('fabric-ca-client');
const { url } = require('inspector');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { Router } = require('express');
const { isNullOrUndefined } = require('util');
const { Console, info } = require('console');


//-------------------->   For Session Related :

//session middleware
app.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));


app.use(cookieParser());


var session;


app.set('views', path.join(__dirname, 'views'));


//app.set("view engine","pug");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set("view engine","ejs");   

const port = process.env.PORT || 8081;


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.get('/enrolluser', function (req, res) {

    // //         //res.render('createcar ');  req.app.set('msg',show);
    //console.log('msg IS : ', req.app.get('msg'));
    res.sendFile(path.join(__dirname, 'views/Enroll.html'));


});

app.get('/logout', function (req, res) {
    if (req.session) {
            req.session.auth = null;
            res.clearCookie('auth');
            req.session.destroy(function () { });
    }
    res.redirect('/');
});


//----------------->   Enroll New User

app.post('/api/enrolluser:uid', async function main(req, res) {
    try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            var input = req.params.uid;
            console.log(input);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(input);

            //-----------------TO BE Commented...............
            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                    // console.log('An identity for the admin user "admin" does not exist in the wallet');
                    // console.log('Run the enrollAdmin.js application before retrying');
                    // return;

                    res.send('An identity for the admin user "admin" does not exist in the wallet');
                    res.send('Run the enrollAdmin.js application before retrying');

            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                    affiliation: 'org1.department1',
                    enrollmentID: input,
                    role: 'client'
            }, adminUser);
            const enrollment = await ca.enroll({
                    enrollmentID: input,
                    enrollmentSecret: secret
            });
            const x509Identity = {
                    credentials: {
                            certificate: enrollment.certificate,
                            privateKey: enrollment.key.toBytes(),
                    },
                    mspId: 'Org1MSP',
                    type: 'X.509',
            };
            await wallet.put(input, x509Identity);

            //res.status(200);
            //res.sendFile(path.join(__dirname, 'views/Home.html'));
            //res.send("Welcome");
            console.log('Done');
            //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

            //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

    } catch (error) {
            console.error(`Failed to register user : ${input} error as : ${error}`);
            process.exit(1);
    }

})


//---------------------Old API

app.post('/api/enrolluser:uid', async function main(req, res) {
    try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            var input = req.params.uid;
            console.log(input);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(input);
            if (userIdentity) {
                    console.log('Welcome ' + input + ' please proceed with your activity !!');
                    //return res.redirect('/home');
                    res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                    //res.redirect("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                    //return('An identity for the user' + input + 'already exists in the wallet');
            } else {
                    console.log("After.......");
                    //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                    res.redirect('/home');
                    console.log("After1.......");
            }

            //-----------------TO BE Commented...............
            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                    // console.log('An identity for the admin user "admin" does not exist in the wallet');
                    // console.log('Run the enrollAdmin.js application before retrying');
                    // return;

                    res.send('An identity for the admin user "admin" does not exist in the wallet');
                    res.send('Run the enrollAdmin.js application before retrying');

            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                    affiliation: 'org1.department1',
                    enrollmentID: input,
                    role: 'client'
            }, adminUser);
            const enrollment = await ca.enroll({
                    enrollmentID: input,
                    enrollmentSecret: secret
            });
            const x509Identity = {
                    credentials: {
                            certificate: enrollment.certificate,
                            privateKey: enrollment.key.toBytes(),
                    },
                    mspId: 'Org1MSP',
                    type: 'X.509',
            };
            await wallet.put(input, x509Identity);

            //res.status(200);
            //res.sendFile(path.join(__dirname, 'views/Home.html'));
            //res.send("Welcome");
            console.log();
            res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

            //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

    } catch (error) {
            console.error(`Failed to register user : ${input} error as : ${error}`);
            process.exit(1);
    }

})

//// To Check............

app.post('/api/enrolluser', async function main(req, res) {
        try {


                var input = req.params.uid;
                console.log(input);

                        //res.status(200);
                        //res.sendFile(path.join(__dirname, 'views/Home.html'));
                        //res.send("Welcome
                       // console.log('Done');
                        //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                        res.send('/queryallcars');
                        //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

                



        } catch (error) {
                console.error(`Failed to register user : ${input} error as : ${error}`);
                process.exit(1);
        }

})