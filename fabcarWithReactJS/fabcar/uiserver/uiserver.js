//import session from 'express-session';
//import sessionStorage from 'express-session';

var flag;


var express = require('express');
var bodyParser = require('body-parser');
const cors = require("cors")

var session = require('express-session');



//-------------------->   For Session Related :

//const cookieParser = require("cookie-parser");
//const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;


var data;

var app = express();
app.use(cors({
        origin : "*",
}))
window = {};
sessionStorage = {};



var global_uid;

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
const common = require('mocha/lib/interfaces/common');


//-------------------->   For Session Related :

//session middleware
app.use(session({
        secret: "thisismysecretekey",
        saveUninitialized: true, 
        cookie: { httpOnly: true, maxAge: oneDay },
        resave: false  
}));



// parsing the incoming data

//app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var jsonParser = bodyParser.json()

//serving public file
app.use(express.static(__dirname));

//app.use(cookieParser());


var session;


//-------------------->   For Session Related 

//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '/home/HFL/FolderWise/fabcarexample_new/fabcar/client/src/components/'));

//app.set("view engine","pug");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set("view engine","ejs");   

const port = process.env.PORT || 8081;

app.listen(port);
console.log('Server started at http://localhost:' + port);




//------------------------>   Query All Cars

app.get('/api/queryallcars:uid', async function (req, res) {

       

        try {
                console.log("Into the Query Car API !!")
                console.log(req.params);

                console.log(" User ID : "  + req.params.uid);

                var sess_id = req.params.uid.toString();

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
                await gateway.connect(ccp, { wallet, identity: sess_id, discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');

                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryAllCars');
                //console.log("Result data : " + result);
                //console.log("JSOn : " + JSON.parse(result));
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

app.get('/api/query:carid&:uid', async function (req, res) {
        
        try {
                console.log("Into the Query Car API !!")
                console.log(req.params);

                console.log("Car id : "+req.params.carid+ " Owner "  + req.params.uid);

                var sess_id = req.params.uid.toString();

                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                

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
// :cid&:cmake:cmodel:ccol:cown

app.post('/api/addcar/', urlencodedParser, async function (req, res) {
        
        //console.log("Into the Add API...."+sessionStorage.getItem('userid'));
        //console.log("id : "+ req.query.carid+" make"+req.body.make+" model"+req.body.model+" col"+req.body.colour+" owner"+req.body.owner);
        
        
       //  const uid = window.localStorage.getItem('userid');

       // console.log(localStorage === window.localStorage); 
        var sess_id = req.session.val;
        
        console.log("Session Value Adding : "+ global_uid);


        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);


                // Check to see if we've already enrolled the user.
                const identity = await wallet.get(global_uid);

               // console.log(identity);

                if (!identity) {
                        console.log('An identity for the user '+global_uid+' does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: global_uid, discovery: { enabled: true, asLocalhost: true } });

                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');

                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                
                console.log(req.body['Carid'], req.body['Make'], req.body['Model'], req.body['Colour'], req.body['Owner']);

                await contract.submitTransaction('createCar', req.body['Carid'], req.body['Make'], req.body['Model'], req.body['Colour'], req.body['Owner']);

                console.log('Transaction has been submitted');
                //res.send('Transaction has been submitted CAR ADDED');
                //res.send("Transactiom has been submitted and CAR has been Added !!  Click on <a href=\'/homepage'>To Home</a>");
                
                //res.status(200).send("Done , Transactiom has been submitted and CAR has been Added !!   <a href=\'/homepage'>Proceed ahead !!</a>");
                res.status(200).send("Done " + global_uid + " Transaction submitted CAR added   <a href=\'http://localhost:3000/menupage'>Proceed ahead !!</a>");
        
                //res.status(200).send("Done " + global_uid + " Transaction submitted CAR added   <Link  to='/homepage'>Proceed ahead</Link>");
                //res.render('/createcar', {success : ''});
                //res.redirect('/home/HFL/FolderWise/fabcarexample_new/fabcar/client/src/components/HomePage.js');
                //res.render('/Homepage.js', {username : req.session.val});
                
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
})

//------------------------>   Change the Car Owner

app.post('/api/changeowner/:carid&:owner&:uid', async function (req, res) {

        console.log(req.params);

        console.log("Car id : "+req.params.carid+ " Owner "  + req.params.owner);

        var sess_id = req.params.uid.toString();

        console.log("Session Value Adding : "+ sess_id);

        try {
                const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                
                const userIdentityList =   await  wallet.list();
                console.log(userIdentityList);

                const identity= userIdentityList.includes(sess_id);

                // Check to see if we've already enrolled the user.
               // const identity = await wallet.get("C1");

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
                console.log('After Update : '+result);

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

app.post('/api/enrolluser:uid', async function main(req, res) {

        console.log("Into the Enroll User API....");
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

               const userIdentityList =   await  wallet.list();
                
               console.log(userIdentityList);

               //localStorage.setItem('username', data);

               const userIdentity= userIdentityList.includes(input);

                if (userIdentity) {
                        console.log('Welcome ' + input + ' please proceed with your activity !!');
                   
                        //res.status(200).send("Welcome " + input + " Please proceed by  <a href=\'/menupage'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>");

                        res.send({
                                message : "Welcome " + input + " Please proceed by  <a href=\'/menupage'>Going to Home</a>  Else If you wish to Logout Click on   <a href=\'/logout'>Logout</a>",
                                flag : true
      
                              })

                } 
    
                //-----------------TO BE Commented...............
                // Check to see if we've already enrolled the admin user.
                const adminIdentity = await wallet.get('admin');
                if (!adminIdentity) {

                        console.log('An identity for the admin user "admin" does not exist in the wallet');
                        console.log('Run the enrollAdmin.js application before retrying');
                        
    
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

                console.log("Done , User Enrolled Successfully !!");
                
                //res.status(200).send("Congrats " + input + " your ID has been created   <a href=\'/menupage'>Proceed ahead !!</a>");

                res.send({
                        message : "Congrats " + input + " your ID has been created   <a href=\'/menupage'>Proceed ahead !!</a>",
                        flag : true

                      })
                
    
        } catch (error) {
                console.error(`Failed to register user : ${input} error as : ${error}`);
                //process.exit(1);
        }
    
    })


//----------------->   Check for existing User

app.get('/api/checkuser:uid', async function main(req, res) {

        global_uid = req.params.uid;
        req.session.val = global_uid;

        try {
        
                console.log("Into the Check API......");
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

                //console.log("Session Value : " + req.params.uid);
 
                //console.log("Betweem alerts");

                const userIdentityList =   await  wallet.list();
                
                console.log(userIdentityList);

                //localStorage.setItem('username', data);

                const userIdentity= userIdentityList.includes(input);
                
                if (userIdentity) {
                        var data = "Thats OK";
                        
                        console.log('Welcome ' + input + ' please proceed with your activity !!'+ data);
                        //res.status(200).send("Welcome " + input + ", <a href=\'/menupage'>Please Proceed ahead !!</a>");
                        
                        res.send({
                                message : "Welcome " + input + ", <a href=\'/menupage'>Please Proceed ahead !!</a>",
                                flag : true
      
                              })
                     
                }
                else {
                        //sessionStorage.setItem("flag","F");
                        console.log('Seems your ID is not registered , we request you to create one !!');
                        res.send({
                          message : "Seems your ID is not registered , we request you to  <a href=\'/enrolluser'>Create One </a>",
                          flag : false

                        })
                        //res.status(200).send("Seems your ID is not registered , we request you to  <a href=\'/enrolluser'>Create One </a>");
                        //res.send("Seems your ID is not registered , we request you to  <a href=\'/enrolluser'>Create One </a> ");
                }
                //alert(outString);

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


app.listen(8080);
