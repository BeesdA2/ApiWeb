const querystring = require("querystring");
const odbc = require("odbc");

function getDocddpSql (setletter, filenameAttachment) {
	 
  return new Promise(function(resolve)
  {
  
 
 if (setletter !== undefined) {
      
	 const sSql = 'Select * FROM DASFP' + setletter + '.docddpsql  where FILE_NAAM =\'' + filenameAttachment + '\'  and  DOCUMENT_TYPE = \'TOP\' AND OORSPRONG_CODE=\'T\' with NONE';
  
	// Binding elements 
	//console.log(JSON.stringify(response.headers));
	//const arrayElements = [base64String, base64String]; 
   
	const conn = odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;',  (error, connection) => { 
	console.log('sSQL '+sSql); 
    
     connection.query( sSql, (error, result) => {
	 if (error) {
       throw error;
     }	
	 
	 //console.log(`Result Set: ${JSON.stringify(result)}`);
	  
     // let resultaat = result;
	 // console.log('Resultaat:' +JSON.stringify(resultaat));
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
	getDocddpSql: getDocddpSql
   
 };