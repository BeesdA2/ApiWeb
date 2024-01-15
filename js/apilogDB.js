const {dbconn, dbstmt} = require('idb-connector');

const querystring = require("querystring");
const odbc = require("odbc");
 
 
function getApiLog (setletter, guid) {
	 
   return new Promise(function(resolve)
  {  
	
	if (setletter !== undefined) {
    const sSql = 'SELECT * from dasfp' +setletter + '.apilog where LOG_GUID = \'' + guid + '\' with NONE ' ;
  // const sSql = 'SELECT * from dasfpa.apilog order by log_create_date desc limit 1';
	//const conn =  await odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;');
	const conn = odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;',  (error, connection) => { 
	//console.log('sSQL '+sSql); 
    
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
 
function getApiLog5 (setletter, guid) {
	 
  return new Promise(function(resolve)
  {
 
 
    const sSql = 'SELECT * from dasfp'+setletter + '.apilog where LOG_GUID = \'' + guid + '\' with NONE';
	//console.log('sSQL '+sSql); 
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);
     
	
    statement.exec(sSql, (x) => {
    //console.log('x :' +x);
	//console.log('x json :' +JSON.stringify(x));
	//var jsonVCNLKEYF = JSON.stringify(x);
	//console.log('ATFBRAN '+ jsonVCNLKEYF['FILIAAL_NUMMER']);
	//uitlezen(x);
	//testen(x);
	
  // console.log(jsonVcnlkeyf);
   
	statement.commit();
	  statement.close();
    connection.disconn();
     connection.close();
   // console.log('test' +jsonVcnlkeyf);
     
  // console.log('Net voor jsonvcnl return');
     
	resolve(x);  
    
	});
	
	
	
  });
 }
 
function updateApiLog (setletter, guid, response) {
	 
  return new Promise(function(resolve)
  {
  
 
 if (setletter !== undefined) {
     const res =  response.data.replace(/'/g, " ");
	 const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = ?, RESPONSE_HTTP_MESSAGE = ? , RESPONSE_HTTP_HEADER = ?,RESPONSE_DATA= ? where LOG_GUID =\'' + guid + '\' with NONE';
  
	// Binding elements 
	//console.log(JSON.stringify(response.headers));
	const arrayElements = [response.status.toString(), response.statusText, JSON.stringify(response.headers).trim(), res.trim()]; // response.statusText
   
	const conn = odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;',  (error, connection) => { 
	//console.log('sSQL '+sSql); 
    
     connection.query( sSql, arrayElements, (error, result) => {
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

function updateApiLog5 (setletter, guid, response) {
	 
  return new Promise(function(resolve)
  {
  console.log ("response apilog: " + JSON.stringify(response.data));
	const res =  response.data.replace(/'/g, " ");
	const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = ?, RESPONSE_HTTP_MESSAGE = ? , RESPONSE_DATA= ? where LOG_GUID =\'' + guid + '\' with NONE';
	//console.log("Status sql:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
    //connection.debug(true);
	const statement = new dbstmt(connection);    
	// Binding elements 
	const arrayElements = [response.status.toString(), response.statusText, res]; 
    //console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
	  arrayElements.length = 0;
	   console.log('array is ' + arrayElements.length );
      
    //console.log(x);
	resolve(x);    
	});
  });
 });
 }); 
  }

function updateApiLogJSON (setletter, guid, response) {
	 
  return new Promise(function(resolve)
  {          
	
	
	
	if (setletter !== undefined) {
 
     const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = ?, RESPONSE_HTTP_MESSAGE = ? , RESPONSE_HTTP_HEADER = ?, RESPONSE_DATA= ? where LOG_GUID =\'' + guid + '\' with NONE';
  
	// Binding elements 
	//console.log(JSON.stringify(response.headers));
	const arrayElements = [response.status.toString(), response.statusText, JSON.stringify(response.headers).trim(), JSON.stringify(response.data).trim()]; // response.statusText
   
	const conn = odbc.connect('DSN=*LOCAL;NAM=1;CMT=0;',  (error, connection) => { 
	//console.log('sSQL '+sSql); 
    
     connection.query( sSql, arrayElements, (error, result) => {
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

function updateApiLogJSON2 (setletter, guid, response) {
	 
  return new Promise(function(resolve)
  {          
	const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = ?, RESPONSE_HTTP_MESSAGE = ? , RESPONSE_HTTP_HEADER = ? , RESPONSE_DATA= ? where LOG_GUID =\'' + guid + '\' with NONE';
	//console.log("Status sql:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
   // connection.debug(true);
	const statement = new dbstmt(connection);    
	// Binding elements 
	console.log(JSON.stringify(response.headers));
	const arrayElements = [response.status.toString(), response.statusText, JSON.stringify(response.headers), JSON.stringify(response.data)]; // response.statusText
     //console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
	  connection.close();
	  arrayElements.length = 0;
	   console.log('array is ' + arrayElements.length );
      
    //console.log(x);
	resolve(x);    
	});
  });
 });
 }); 
  }

 
function updateApiLogError (setletter, guid, error) {
	 
  return new Promise(function(resolve)
  {
  
    const responseData =  querystring.stringify({query:error.response.data});
	//console.log('responseData: ' + responseData);
 
  
	const sSql = 'UPDATE dasfp' + setletter + '.apilog set RESPONSE_HTTP_CODE = \'' + error.response.status +'\' , RESPONSE_HTTP_MESSAGE = \'' + error.response.statusText + '\' , RESPONSE_HTTP_ERROR_MESSAGE = \'' + error + '\' , RESPONSE_DATA=\'' + error.response.data +'\' where LOG_GUID =\'' + guid + '\' with NONE';
	//console.log('sSQL '+sSql); 
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);
     
	
    statement.exec(sSql, (x) => {
    //console.log('x :' +x);
	//console.log('x json :' +JSON.stringify(x));
	//var jsonVCNLKEYF = JSON.stringify(x);
	//console.log('ATFBRAN '+ jsonVCNLKEYF['FILIAAL_NUMMER']);
	//uitlezen(x);
	//testen(x);
	
  // console.log(jsonVcnlkeyf);
    statement.close();
      connection.disconn();
      connection.close();
   // console.log('test' +jsonVcnlkeyf);
     
  // console.log('Net voor jsonvcnl return');
     
	resolve(x);    
	});
  });
 }

function updateApiLogErrorJSON (setletter, guid, error) {
	 
  return new Promise(function(resolve)
  {          
	const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = ?, RESPONSE_HTTP_MESSAGE = ? , RESPONSE_HTTP_ERROR_MESSAGE = ?, RESPONSE_DATA= ? where LOG_GUID =\'' + guid + '\' with NONE';
	console.log("Status sql:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
   // connection.debug(true);
	const statement = new dbstmt(connection);    
	// Binding elements 
	const arrayElements = [error.response.status.toString(), error.response.statusText, error, JSON.stringify(error.response.data)]; 
    // console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
	  arrayElements.length = 0;
	   console.log('array is ' + arrayElements.length );
	   //console.log(x);
	resolve(x);    
	});
  });
 });
 }); 
 }  
  
function uitlezen (jsonfile) {
//console.log('jsonFile '+ jsonfile);	
//console.log(JSON.stringify(jsonfile));
//var parseJsonfile = jsonfile.parseJsonfile;
//console.log('UITLEZEN IN FILIAAL object ' + parseJsonfile);
console.log('UITLEZEN OAKEYN ' + jsonfile[0].OAKEYN);
}

function testen (jsonfile) {
	console.log('testen');
	for (t=0; t < jsonfile.length; t++)
	{
		console.log('wAT IS T '+ t);
	 	console.log('OAKEYN ' + jsonfile[t].OAKEYN );
		console.log('OAKEYV ' + jsonfile[t].OAKEYV );
       // console.log('VKKEYV ' + jsonfile[t].VKKEYV.trim() );
    }	
}

 
 
 module.exports = {
  getApiLog: getApiLog,
  updateApiLog: updateApiLog,
  updateApiLogJSON: updateApiLogJSON,
  updateApiLogError: updateApiLogError,
  updateApiLogErrorJSON: updateApiLogErrorJSON
 };

function updateApiLogSave (setletter, guid, response) {
	 
  return new Promise(function(resolve)
  {
 
 
    //const sSql = 'SELECT * from dasfp'+setletter + '.apilog where LOG_GUID = \'' + GUID + '\' with NONE';
	//const responseData =  querystring.escape(response.data);
	
	 
	 const res =  response.data.replace(/'/g, " ");
	 //const res =  response.data;
	
	
	 
	
	//console.log('res : '+ res);
	//console.log('responseData: ' + responseData);
	
	const sSql = 'UPDATE DASFP' + setletter + '.apilog set RESPONSE_HTTP_CODE = \'' + response.status +'\' , RESPONSE_HTTP_MESSAGE = \'' + response.statusText + '\' , RESPONSE_DATA=\'' + res +'\' where LOG_GUID =\'' + guid + '\' with NONE';
	//console.log('sSQL '+sSql); 
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);
     
	
    statement.exec(sSql, (x) => {
   // console.log('x :' +x);
	//console.log('x json :' +JSON.stringify(x));
	//var jsonVCNLKEYF = JSON.stringify(x);
	//console.log('ATFBRAN '+ jsonVCNLKEYF['FILIAAL_NUMMER']);
	//uitlezen(x);
	//testen(x);
	
  // console.log(jsonVcnlkeyf);
    statement.close();
      connection.disconn();
      connection.close();
   // console.log('test' +jsonVcnlkeyf);
     
  // console.log('Net voor jsonvcnl return');
     
	resolve(x);    
	});
  });
 } 
