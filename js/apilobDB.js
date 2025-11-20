const querystring = require("querystring");
const odbc = require("odbc");
 
 
function getApiLob (setletter, guid) {
	 
   return new Promise(function(resolve)
  {  
	
	if (setletter !== undefined) {
    const sSql = 'SELECT * from dasfp' +setletter + '.apilob where LOB_GUID = \'' + guid + '\' with NONE ' ;
 
	const conn = odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;',  (error, connection) => { 
   
     connection.query( sSql, (error, result) => {
	 if (error) {
       throw error;
     }	
	 
	 resolve(result);
	  connection.close().then(() => {
        console.log('closed');
    });
}); 
     
});
     
	}	
 });   
 }
 
 module.exports = {
  getApiLob: getApiLob,
 };
