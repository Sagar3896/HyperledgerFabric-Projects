Step 1 : Install all  prerequisites / dependencies 

i. Docker

systemctl status docker 

ii. nodemon

iii. come to your desired folder

download and install fabroc-sample latest

curl -sSL https://bit.ly/2ysbOFE | bash -s

once done you must see a folder "fabric-samples"

iv. rename it to your desired name of application here we took as "fabcarWithReactJS"

mv fabric-samples fabcarWithReactJS

Step 2 : Clear the unwanted files (this step is optional I prefer to clear the unwanted one's

Go inside the folder 

cd fabcarWithReactJS

rm -rf asset*

rm -rf auction*

rm -rf *.md

rm -rf commercial-paper high-throughput hardware-security-module interest_rate_swaps off_chain_data

rm -rf test-network-* token*

rm -rf ci

after deletng above files your are left with handful of file/folder that we require

Step 3 :  Replace "fabcar" with the one in my github account

rm -rf fabcar

paste the "fabcar" folder from git to current location

Step 4 : Install all internal dependencies

cd fabcar/client/

This will have look into your package.json file and download all dependencies mentioned in it.

npm install

to the same thing inside 

cd ../uiserver/

npm install

you should see a file (package-lock.json) and a folder node-modules in that location now.


Step 5 : Start the fabric 

come to fabcar  folder 

./startFabric.sh

while the above things happen be patient and if possible read the verbose logs that will clearly explain the ongoing method as id creation, enrollment, approval ,chaincode installation etc.

Check whether all the dockers are started 

docker ps -a


Step 6 : Check whether wallet is empty if not  empty wallet and enroll the admin

Go inside "uiserver" folder

cd uiserver/

ls wallet/   --> make sure there are NO ids initially if exists here than remove them

rm -rf * 

-- Enroll the admin

node enrollAdmin.js 

and start the server from same location

npm start 

Go to the URL its showing as local 

http://localhost:3000

Further you have to register yourself the steps are quite user friendly .....

Once you login there  are 4 options on "Home tab" as Query all cars , Insert , Quera a single and Update the Owner ....

Hurray, the react application is ready to use,  Feel free to explore them !!

Thanks again for reading this.....you can experiment more on yourselves as you feel !!!!

