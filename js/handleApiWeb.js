const { updateApiLog } = require("./apilogDB.js");
const { getDocddpSql } = require("./docddpsqlDB.js");
const FormData = require('form-data');
const { updateApiLogJSON } = require("./apilogDB.js");
const  { updateApiLogError } = require("./apilogDB.js");
const  { updateApiLogErrorJSON } = require("./apilogDB.js");
const  { updateApiLogConfigJSON } = require("./apilogDB.js");
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
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
		  
		  const respDocddpsql = await getDocddpSql(setletter, requestData, 'TOP', 'T');
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
		var res;
	  	var config;

		
  	 
  	//console.log('config: '+ qs.stringify(config));
		var res;
    // aanroep webservice
	  // ALs applicatienaam BLOB bevat, wordt er een blob als antwoord verwacht
	if (logApplication.includes('BLOB'))
	{	
		config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers, 
			data: requestData,
			responseType: 'arraybuffer'
 
		}
	const startWithBLOB = new Date();
    var datetime = startWithBLOB.toLocaleString();

 console.log(datetime + ' net voor Axios request ' + logApplication ); 
  	
 	res = await axios.request(config);
	
	const endWithBLOB = new Date();
     datetime = endWithBLOB.toLocaleString();
	console.log(datetime + ' net na Axios request ' + logApplication ); 
	
    // response omzetten van blob(arraybuffer) naar base64string
	// , zodat het antwoord via repsonse_data(CLOB) in apilog kan worden teruggegeven
	res.data = await Buffer.from(res.data, 'binary').toString('base64');	
	}
		  // Anders wordt er de default(JSON) als antwoord verwacht
	else
	{
		config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers, 
			data: requestData
			}

	  // alleen voor sales_binning. Impact laag
   if (logApplication.trim() == 'API_GRIP_POST_SALES_BINNING_VR')
		{
		console.log('API_GRIP_POST_SALES_BINNING_VR Post Method');	
		config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers, 
			data: requestData,
            maxContentLength: Infinity,
            maxBodyLength: Infinity

			//maxContentLength: Buffer.byteLength(requestData) * 1.5,
            //maxBodyLength: Buffer.byteLength(requestData) * 1.5
 	
		}
		
		}
	
	   
      

         // ALs applicatienaam SNDPDF bevat, wordt er PDF verstuurd via Axios
	if (logApplication.includes('SNDPDF'))
	  {
		  console.log('AMIQUOTSND');
		  let data = JSON.parse(requestData);

          
		  
		  let filename = data.filename;
		  let base64String = data.base64String;
		  
		  let amiDocumentType = '';
		  if (requestLog_create_program === 'AMIQUOTSND')
		  {  
		  amiDocumentType = data.amiDocumentType; 
		  } 
		  
		   
		  

           
           
         const buffer = Buffer.from(base64String, 'base64');
         
		  
		  
//fs.writeFileSync('/beesda2/NodeJS/Productie/ApiWeb/js/test-ami.pdf', buffer);

          
		  
          
		  
		 //const buffer =jsonDocddpsql[0].FILE_BLOB;
		  
		  
		  
		  
		  let form = new FormData();

          form.append("file", buffer  , {filename: filename, contentType: 'application/pdf'});
		  
		  if (requestLog_create_program === 'AMIQUOTSND')
		  {
		  form.append("documentType" , amiDocumentType);
          }
		  
		  let requestHeaderJson = JSON.parse(requestHeader);
		  
		  let authorizationBearer = requestHeaderJson.Authorization;


          console.log('requestHeader:', requestHeader);
 

          const formHeaders = form.getHeaders();
 const request_header = {
      'Authorization' : authorizationBearer.trim(), 
	  'accept': 'application/json', 
      ...formHeaders
    
       
};
        headers = request_header;
      	url = requestURL.trim();	
	   	requestData = form;  

	  	
   
		console.log('AMIQUOTSND Post Method');	
		config = {
			method: '' + requestMethod ,
			url:  '' +  url , 			
            headers: headers, 
			data: requestData,
            maxContentLength: Infinity,
            maxBodyLength: Infinity

			//maxContentLength: Buffer.byteLength(requestData) * 1.5,
            //maxBodyLength: Buffer.byteLength(requestData) * 1.5
 	
		}
		 
		
		//let configHeaders = JSON.stringify(config.headers); 
		//let configBody = JSON.stringify(config.data); 
		
		//let consolebericht = await updateApiLogConfigJSON(setletter, guid,  configHeaders, configHeaders);
		//console.log('AMIQUOTSND console:', JSON.stringify(config, null, 2));
		}
		
    

	const start = new Date();
    datetime = start.toLocaleString();
    console.log(datetime + ' net voor Axios request ' + logApplication ); 
	
	

	
	res =  await axios.request(config);	
	
	//console.log('AXIOS STATUS SUCCESVOL:', res.status);
    //console.log('AXION DATA SUCCESVOL:', res.data);
	
	const einde = new Date();
    datetime = einde.toLocaleString();
    console.log(datetime + ' net na Axios request ' + logApplication ); 
	
	}
 
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
		const errordate = new Date();
	console.log('AXIOS ERROR:', error.message);
    console.log('AXIOS CODE:', error.code);	
		
    datetime = errordate.toLocaleString();
    	console.log(datetime + ' error msg ' + error);
		console.log('Status:', error.response?.status);
    console.log('Response:', JSON.stringify(error.response?.data, null, 2));
    console.log('URL:', error.config?.url);
    console.log('Method:', error.config?.method);
		//let foutbericht = await updateApiLogErrorJSON(setletter, guid, error);
	
	if (error.response) {
        console.log('STATUS:', error.response.status);
        console.log('DATA:', error.response.data);
    }

    if (error.request) {
        console.log('Er is een request verstuurd maar geen response ontvangen');
    }	
		
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