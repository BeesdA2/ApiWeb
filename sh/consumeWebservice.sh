echo "setletter parameter 1" $1
echo "guid parameter 2" $2
echo "applicatie parameter 3" $3

## export PATH=/QOpenSys/pkgs/lib/nodejs14/bin:$PATH;  
## export LIBPATH=/QOpenSys/pkgs/lib/nodejs14/bin:$LIBPATH;
## export NODE_PATH=/QOpenSys/pkgs/lib/nodejs14/node_modules:$NODE_PATH;
export PATH=/QOpenSys/pkgs/lib/nodejs14/bin:/usr/local/bin:/usr/local/src:/QOpenSys/pkgs/bin:/QOpenSys/usr/bin:/usr/ccs/bin:/QOpenSys/usr/bin/X11:/usr/sbin:/usr/bin$PATH; 
export LIBPATH=/QOpenSys/pkgs/lib/nodejs14/bin:$LIBPATH
## export NODE_PATH=/beesda2/nodejs14/productie/pdfimage/js:$NODE_PATH
export NODE_PATH=/QOpenSys/pkgs/lib/nodejs14/node_modules:$NODE_PATH;





node /Beesda2/NodeJS/Productie/ApiWeb/js/consumeWebservice.js $1 $2 $3 > log-file.txt;
      