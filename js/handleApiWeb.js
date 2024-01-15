const { updateApiLog } = require("./apilogDB.js");
const { getDocddpSql } = require("./docddpsqlDB.js");
const FormData = require('form-data');
const { updateApiLogJSON } = require("./apilogDB.js");
const  { updateApiLogError } = require("./apilogDB.js");
const  { updateApiLogErrorJSON } = require("./apilogDB.js");
const axios = require('axios');
const qs = require('qs');
//const fs = require('fs');
 
async function createAndSendRequest (setletter,  guid, jsonApilog) {
console.log('********************  handleApiWeb.js *******************'); 

   
// Informatie voor bericht Rob samenstellen 
let logGuid           = jsonApilog[0].LOG_GUID.trim();
//console.log('logGuid ' + logGuid);
let logApplication    = jsonApilog[0].LOG_APPLICATION.trim();
//console.log('logApplication ' + logApplication);
let requestData       = jsonApilog[0].REQUEST_DATA.trim();
//console.log('requestData ' + requestData);
let requestMethod     = jsonApilog[0].REQUEST_METHOD.trim();
//console.log('requestMethod ' + requestMethod);
let requestURL        = jsonApilog[0].REQUEST_URL.trim();
//console.log('requestURL ' + requestURL);
let requestParameters = jsonApilog[0].REQUEST_PARAMETERS.trim();
//console.log('requestParameters ' + requestParameters);
let requestHeader      = jsonApilog[0].REQUEST_TOKEN.trim();
//console.log('requestHeader ' + requestHeader);
let requestLog_create_program = jsonApilog[0].LOG_CREATE_PROGRAM.trim();
   
	try {
		
        // set the url
		
       var url = requestURL.trim() ;
	   //console.log	("Url: " + url)
	   
	   	
	   
	     //Build Header for request	met JSON header 
	  var headers ;
	   // console.log(headers);

	  
      if (requestLog_create_program === 'TOPDESKATT')
	  {
		  console.log('TOPDESKATT');
		  const respDocddpsql = await getDocddpSql(setletter, requestData);
          let jsonDocddpsql = await respDocddpsql;
		  const buffer = Buffer.from(jsonDocddpsql[0].FILE_BLOB,'binary');
		  let filenaam = requestParameters.trim();
		  let form = new FormData();

          form.append("file", buffer  , {filename: filenaam});
          form.append('invisibleForCaller', 'false');
          form.append('description', 'idas bijlage tbv Topdesk');




          const formHeaders = form.getHeaders();

     const request_header = {
     
     
    "Authorization" : "Basic aWRhc0BiZWVzZGEyLm5sOmsyMnI1LWQzY3JiLXV1aGg3LXVnM2diLW5jYnJm" ,
    ...formHeaders
    
    
};
        headers = request_header;
      		
	   	requestData = form;
	  }	 else {
		  
		  if (requestParameters.length > 0)
	   {
         url = requestURL.trim() + '/' + requestParameters.trim();
       }
	   
          headers = JSON.parse(requestHeader.trim());
	  } 		  
		//============================================================================
        // Webservice Call
	    //============================================================================ 	
		console.log('webservice ' + logApplication + ' start');
		
			const config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers, 
			data: requestData
 
		}
  	 
  	//console.log('config: '+ qs.stringify(config));
  
    // aanroep webservice
	const res =  await axios.request(config);
 
	//console.log(res.status);
	//console.log(res.statusText);
   // console.log('res ' + res.data);
	
		  if (IsJsonString(res.data) != true)
	 	{	
	  // antwoord webservice JSON-formaat teruggeven
	  console.log('Update Api log zonder JSON');
	  let antwoord = await updateApiLog(setletter, guid, res);
	  return 'geslaagd';
		} 
	
	 if (IsJsonString(res.data) == true)
	 	{	
	// antwoord webservice text formaat teruggeven
    let antwoord = await updateApiLogJSON(setletter, guid, res);	
    return 'geslaagd';
		}
		
    } catch (error) {
		console.log('error msg ' + error);
		let foutbericht = await updateApiLogErrorJSON(setletter, guid, error);
		return('mislukt');
		}
};

function checkWebservice(jsonApilog)
{
	
return config;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
		// Is already an object(JSON)
		if (str != null && typeof str == 'object')
		{
		return true;	
		}
		else
		{return false;}
    }
    return true;
}

module.exports = {
  createAndSendRequest: createAndSendRequest
  };