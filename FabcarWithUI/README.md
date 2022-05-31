////-------------------> **Hyperledger Fabric Projects**
//-----------> **FabCar With UI**

This is my First Hyperledger Fabric Project the basic one's Fabcar example.

I have created a simple UI inorder to hit transactions to the Blockchain.

Please follow steps for demo test :

**Prerequisites :**
Here I assume that you have pre-installed Nodejs below is the another tool  I have downloaded 

1. Nodemon

It is tool that helps us monitor/develop our application by automatically restarting the node application when file changes in the directory are detected
at runtime.

**Steps to execute :**

Step 1 : Start the Fabric Network 

Go to 
FabcarWithUI/fabcar

./startFabric.sh

Note :
1. It takes a while to pull docker images so please b patient and do not panic.
2. Once the script is completed run command "docker ps -a" in order to check dockers are running and make sure ports are assigned to them.

Step 2 : Register the admin 

Go to and run the command to enrol the admin first

FabcarWithUI/fabcar/uiserver

node enrollAdmin.js


Step 3 : start the js file(API file) using Nodemon 

nodemon uiserver.js

This would give a host url , open the link in browser.

Step 4 : The Application

Once the link is opened try any id(Eg your name) it would ask you to create one.

Once created Voila !!

Please explore the rest of options like "View All Cars", "Insert a new car", "Query a Car", "Change the Owner" and finally the "Logout" as well.

Thanks for Reading and and Excecuting it as well (if did so) !!!!!!!
