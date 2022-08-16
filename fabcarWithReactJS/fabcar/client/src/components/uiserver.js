//import session from 'express-session';
//import sessionStorage from 'express-session';

var flag;       

var express = require('express');
var bodyParser = require('body-parser');

var session = require('express-session');


//-------------------->   For Session Related :

const cookieParser = require("cookie-parser");
//const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;


var data;

var app = express();
window = {};
sessionStorage = {};



//var app = express();
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
const { get } = require('http');


//-------------------->   For Session Related :

//session middleware
app.use(session({
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


//-------------------->   For Session Related 


app.set('views', path.join(__dirname, 'views'));


//app.set("view engine","pug");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set("view engine","ejs");   

const port = process.env.PORT || 8081;

/*app.get('/api/', function (req, res) {

    res.render('index');

});*/

app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.get('/createcar', function (req, res) {
        res.render('createcar.html', {username : req.session.val})
        //res.sendFile(path.join(__dirname, 'views/createcar.html'));

});

app.get('/allcars', function (req, res) {
        res.render('allcars.html', {username : req.session.val})
//        res.sendFile(path.join(__dirname, 'views/allcars.html'));

});

app.get('/enrolluser', function (req, res) {
        res.render('Enroll.html', {username : req.session.val})
        //res.sendFile(path.join(__dirname, 'views/Enroll.html'));


});

app.get('/home', function (req, res) {
        res.render('Home.html', {username : req.session.val})
        //res.sendFile(path.join(__dirname, 'views/Home.html'));
});

app.get('/query', function (req, res) {
        //res.send("Inside the API");
        res.render('QueryCar.html', {username : req.session.val})
        //res.sendFile(path.join(__dirname, 'views/QueryCar.html'));
});

app.get('/changeowner', function (req, res) {
        //res.send("Inside the API");
        res.render('Changeowner.html', {username : req.session.val})
        //res.sendFile(path.join(__dirname, 'views/QueryCar.html'));
});

app.get('/logout', function (req, res) {
        if (req.session) {
                req.session.auth = null;
                req.session.cookie = null;
                res.clearCookie('auth');
                req.session.val = null;
                req.session.destroy();

        }
        res.redirect('/');
});


//------------------------>   Query All Cars

app.get('/api/queryallcars', async function (req, res) {



        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get('appUser');
                if (!identity) {
                        console.log('An identity for the user "appUser" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');

                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryAllCars');
                console.log(JSON.parse(result));
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                //res.render("allcars",{ list:JSON.parse(result)});
                res.send(result);
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                process.exit(1);
        }
});


//------------------------>   Query a Car

app.get('/api/query:carid', async function (req, res) {
        
        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                var sess_id = req.session.val;

                console.log("Session Value "+ sess_id);
                //console.log(username);

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(sess_id);
                if (!identity) {
                        console.log('An identity for the user '+ sess_id +' does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: sess_id, discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryCar', req.params.carid);

            
                        res.send(JSON.parse(result));
                        console.log(JSON.parse(result));
                        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                        console.log('After '+result);

                console.log()
              

                
                
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                //alert(`Transaction Failure (  ${error}` + ') try with a different ID');
                res.send(`Transaction Failure (  ${error}` + ') try with a different ID');
                //res.status(500).json({ error: error });
                //process.exit(1);
        }
});


//------------------------>   Add a Car

app.post('/api/addcar/', urlencodedParser, async function (req, res) {

       // req.session.val = input;

       // console.log("Session Value : " + req.session.val);

       // console.log("Betweem alerts");
       var sess_id = req.session.val;

       console.log("Session Value Adding : "+ sess_id);


        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);


                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(sess_id);
                if (!identity) {
                        console.log('An identity for the user '+sess_id+' does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')

                await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);

                console.log('Transaction has been submitted');
                //res.send('Transaction has been submitted CAR ADDED');
                res.send("Transactiom has been submitted and CAR has been Added !!  Click on <a href=\'/home'>To Home</a>");
                //res.send();
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
})

//------------------------>   Change the Car Owner

app.post('/api/changeowner/:carid&:owner', async function (req, res) {

        console.log(req.params);

        console.log("Car id : "+req.params.carid+ " Owner "  + req.params.owner);

        var sess_id = req.session.val;

        console.log("Session Value Adding : "+ sess_id);

        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                

                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(sess_id);
                if (!identity) {
                        console.log('An identity for the user '+ sess_id +' does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: sess_id, discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('changeCarOwner', req.params.carid, req.params.owner);

                console.log('Changed Owner');

                const result = await contract.evaluateTransaction('queryCar', req.params.carid);

                console.log('Query Result');

                res.send(JSON.parse(result));
                console.log(JSON.parse(result));
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                console.log('After '+result);

                //res.send('Transaction has been submitted');
                //res.send("Transaction has been submitted , <a href=\'/home'>Go to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
})



//----------------->   Enroll New User

app.get('/api/enrolluser:uid', async function main(req, res) {
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

                req.session.val = input;

                // Check to see if we've already enrolled the user.
                const userIdentity = await wallet.get(input);
                if (userIdentity) {
                        //window.sessionStorage.setItem("id",input);
                        //console.log("Session : " + winddow.sessionStorage.getItem('id'));

                        console.log('Welcome ' + input + ' please proceed with your activity !!');
                        //return res.redirect('/home');
                       // res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                        res.render('Home.html', {username : req.session.val})
                        //res.redirect("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
                        //return('An identity for the user' + input + 'already exists in the wallet');
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
                console.log("Done");
                
                //res.send('views/Home.html');
                //res.render('/views/Home.html', {username : req.session.val});
                //res.render('/api/home', {  user: req.session.val});
                res.send("/home");
                //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
    
                //res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a> Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");
    
        } catch (error) {
                console.error(`Failed to register user : ${input} error as : ${error}`);
                process.exit(1);
        }
    
    })


//----------------->   Check for existing User

app.post('/api/checkuser:uid', async function main(req, res) {
        try {
               // session = req.session;
                
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

                req.session.val = input;

                //console.log("Session Value : " + req.session.val);
 
 

                if (userIdentity) {
                        console.log('Welcome ' + input + ' please proceed with your activity !!');

                        res.send("Welcome " + input + " Please proceed by  <a href=\'/home'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

                        //res.render('Enroll.html', {username : req.params.uid})

                }
                else {
                        //console.log('Seems your ID is not registered , we request you to create one !!');
                        //res.redirect('/enrolluser');
                        //alert("Seems your ID is not registered");
                        //res.render('Enroll.html', {username : req.params.uid})
                       res.send("Seems your ID is not registered , we request you to  <a href=\'/enrolluser'>Create One </a> ");
                }
                //alert(outString);

                console.log("Code Agge nikal gaya.....");

                // Check to see if we've already enrolled the admin user.
                const adminIdentity = await wallet.get('admin');

                if (!adminIdentity) {
                        res.send('An identity for the admin user "admin" does not exist in the wallet');
                        res.send('Run the enrollAdmin.js application before retrying');

                }

        } catch (error) {
                console.error(`User doesn't exist : ${input} error as : ${error}`);
                process.exit(1);
        }
})

app.post('/api/rmuser:uid', async function main(req, res) {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        var input = req.params.uid;
        wallet.remove(input);

        console.log(input + " removed from wallet");
})



app.listen(8080);
