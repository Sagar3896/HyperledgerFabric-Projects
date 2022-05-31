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


//-------------------->   For Session Related :

//session middleware
app.use(sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized:true,
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

        //res.render('createcar');
        res.sendFile(path.join(__dirname, 'views/createcar.html'));

});

app.get('/allcars', function (req, res) {

        // //         //res.render('createcar ');
        res.sendFile(path.join(__dirname, 'views/allcars.html'));

});

app.get('/enrolluser', function (req, res) {

        // //         //res.render('createcar ');  req.app.set('msg',show);
        console.log('msg IS : ',req.app.get('msg'));
        res.sendFile(path.join(__dirname, 'views/Enroll.html'));
        

});

app.get('/home', function (req, res) {
       
        res.sendFile(path.join(__dirname, 'views/Home.html'));
});

app.get('/home1', function (req, res) {
       
        res.sendFile(path.join(__dirname, 'views/Home1.html'));
});

app.post('/user',(req,res) => {
        if(req.body.username == myusername){
            session=req.session;
            session.userid=req.body.username;
            console.log(req.session)
            res.send("Hey there, welcome <a href=\'/logout'>click to logout</a>");
        }
        else{
            res.send('Invalid username or password');
        }
    });


    app.get('/logout',(req,res) => {
        req.session.destroy();
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

app.get('/api/query/:car_index', async function (req, res) {
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
                const result = await contract.evaluateTransaction('queryCar', req.params.car_index);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response: result.toString() });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                process.exit(1);
        }
});


//------------------------>   Add a Car

app.post('/api/addcar/', urlencodedParser, async function (req, res) {
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
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')

                await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);

                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted CAR ADDED');
                //res.send();
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
})

//------------------------>   Change the Car Owner

app.put('/api/changeowner/:car_index', async function (req, res) {
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
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('changeCarOwner', req.params.car_index, req.body.owner);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
})

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
                if (userIdentity) {
                        //console.log('An identity for the user "appUser" already exists in the wallet');
                        console.log('An identity for the user ' + input + '  already exists in the wallet');
                        return res.redirect('/home');
                        //return;
                }

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
                //res.send('/home1');
                
                await wallet.put(input, x509Identity);
                //console.log(val);
                //console.log('Successfully registered and enrolled admin user ' + input + ' and imported it into the wallet');
                //r
                if (userIdentity) {
                        //console.log('An identity for the user "appUser" already exists in the wallet');
                        console.log('An identity for the user ' + input + '  already exists in the wallet');
                        return res.redirect('/home1');
                        //return;
                }

        } catch (error) {
                console.error(`Failed to register user : ${input} error as : ${error}`);
                process.exit(1);
        } 
            
                
        
        
})

// app.post('/api/enrolluser:uid', async function main(req, res) {
//         var input = req.params.uid;
//         console.log(input);

// })


//----------------->   Check for existing User

app.post('/api/checkuser:uid', async function main(req, res) {
        try {
                
                //console.log("Into the API : " + req.params.uid);
                //console.log(req.body);
                // load the network configuration
                session = req.session ;
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
                        return res.redirect('/home');
                        //res.send("Welcome User <a href=\'/logout'>click to logout</a>");
                        //return('An identity for the user' + input + 'already exists in the wallet');
                }
                else{                      
                        console.log('Seems your ID is not registered , we request you to create one !!');
                         return res.redirect('/enrolluser');
                 }
                 //alert(outString);
    
                // Check to see if we've already enrolled the admin user.
                const adminIdentity = await wallet.get('admin');
                if (!adminIdentity) {
                        // console.log('An identity for the admin user "admin" does not exist in the wallet');
                        // console.log('Run the enrollAdmin.js application before retrying');
                        // return;
    
                        res.send('An identity for the admin user "admin" does not exist in the wallet');
                        res.send('Run the enrollAdmin.js application before retrying');
    
                }
    
        } catch (error) {
                console.error(`Failed to register user : ${input} error as : ${error}`);
                process.exit(1);
        }
    })

app.listen(8080);
