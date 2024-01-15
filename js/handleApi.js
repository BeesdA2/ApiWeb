const { updateApiLog } = require("./apilogDB.js");
const { updateApiLogJSON } = require("./apilogDB.js");
const  { updateApiLogError } = require("./apilogDB.js");
const  { updateApiLogErrorJSON } = require("./apilogDB.js");
const axios = require('axios');
const qs = require('qs');
//const fs = require('fs');

var setletter = process.argv[2];

var guid = process.argv[3];

var jsonApilog = process.argv[4];

 
async function createAndSendRequest (setletter, guid, jsonApilog) {
   
   		console.log('********************  handleApi.js *******************');   
// Informatie voor bericht Rob samenstellen 
let logGuid           = jsonApilog[0].LOG_GUID.trim();
console.log('logGuid ' + logGuid);
let logApplication    = jsonApilog[0].LOG_APPLICATION.trim();
console.log('logApplication ' + logApplication);
let requestData       = jsonApilog[0].REQUEST_DATA.trim();
console.log('requestData ' + requestData);
let requestMethod     = jsonApilog[0].REQUEST_METHOD.trim();
console.log('requestMethod ' + requestMethod);
let requestURL        = jsonApilog[0].REQUEST_URL.trim();
console.log('requestURL ' + requestURL);
let requestParameters = jsonApilog[0].REQUEST_PARAMETERS.trim();
console.log('requestParameters ' + requestParameters);
let requestToken      = jsonApilog[0].REQUEST_TOKEN.trim();
console.log('requestToken ' + requestToken);

   
	try {
		

		
        // set the url
		
       var url = requestURL.trim() ;
	   console.log("Url: " + url)
	   
	   if (requestParameters.length > 0)
	   {
         url = requestURL.trim() + '/' + requestParameters.trim();
       }	
	    
	//Build Header for request	 
	   var headers;
	   var contentType;

	   // determine JSON/XML
	   if (IsJsonString(requestData) == true)
	   {
	   contentType = 'application/json';
       }
	   else
	   {
	   contentType = 'text/xml;charset=UTF-8';
       }
		
		
	   //Token 
	    if (requestToken.length > 0)
		{
		if (logApplication.trim() == 'SMS_API_SEND')	
		{
		headers = {'Content-Type' : contentType , 'Authorization': 'AccessKey ' + requestToken};
		}
		else
		{
		headers = {'Content-Type' : contentType , 'Authorization': 'bearer ' + requestToken};
		}
		}
		else
		{
		//Header toevoegen voor Applicatie ICC_API_GETCONFIG
		if (logApplication.trim() == 'ICC_API_GETCONFIG')
		{
		headers = {'Content-Type' : contentType, 'apollographql-client-name' : 'iDAS' };			
		}
		else
		{
		headers = {'Content-Type' : contentType };
		}
		}	   
		
		//============================================================================
        // SOAP service (XML)
	    //============================================================================ 
	if (IsJsonString(requestData) != true)
	  {	
		
		
        // SOAP service
         var config ;
		 if (requestMethod === 'GET')
		 {
			 console.log('Webservice');
			const configWeb = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers	
			 
		            }
			config= configWeb;
			console.log('config XXXXXXX: '+ qs.stringify(configWeb));
		 } else
		 {
			 console.log('SOAPservice');
        // SOAP service
           const configSoap = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers,		
			data: requestData
 
		          }
			config = configSoap;
		 }
         // console.log('config: ' + config);		
		 
        
		
        
		console.log('config XXXXXXX: '+ qs.stringify(config));
    // aanroep webservice
	const res =  await axios.request(config);

	// antwoord webservice teruggeven
	console.log('res ' + res.data);
	console.log(res.status);
    console.log(res.statusText);
var set1 = ";,/?:@&=+$";  // Reserved Characters
var set2 = "-_.!~*'()";   // Unescaped Characters
var set3 = "#";           // Number Sign
var set4 = "ABC abc 123"; // Alphanumeric Characters + Space

console.log('encodeUri ' +encodeURI(set1)); // ;,/?:@&=+$
console.log('encodeUri ' +encodeURI(set2)); // -_.!~*'()
console.log('encodeUri ' +encodeURI(set3)); // #
console.log('encodeUri ' + encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log('encodeURIComponent ' +encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log('encodeURIComponent '+encodeURIComponent(set2)); // -_.!~*'()
console.log('encodeURIComponent ' +encodeURIComponent(set3)); // %23
console.log('encodeURIComponent '+ encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

    const antwoordUpdateApiLog = await updateApiLog(setletter, guid,  res);
	let antwoord = await antwoordUpdateApiLog;
	
  return 'geslaagd';
		}
		
		
		//============================================================================
        // REST service (JSON)
	    //============================================================================ 
	  if (IsJsonString(requestData) == true)
	 	{	
		console.log('RESTservice');
        // Rest service
         const config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers,				
			data: requestData
 
		}
  	 
  	console.log('config: '+ qs.stringify(config));
  
    // aanroep webservice
	const res =  await axios.request(config);
	
	
    
	// antwoord webservice teruggeven
    let antwoord = await updateApiLogJSON(setletter, guid, res);	
    return 'geslaagd';
		}
		
    } catch (error) {
		console.log('error msg ' + error);
		 
		console.error(error.response.data);
		console.error(error.response.status);
        console.error(error.response.statusText);
		
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
        return false;
    }
    return true;
}

module.exports = {
  createAndSendRequest: createAndSendRequest
  };