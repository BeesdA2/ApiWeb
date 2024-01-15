const { getApiLog } = require("./apilogDB.js");
const { createAndSendRequest } = require("./handleApi.js");


	 var setletter = process.argv[2];
	 // console.log('setletter '+setletter);
	  
	
	// Parameter 3 ophalen
	  var guid = process.argv[3];
	  //console.log('guid '+guid); 
	  
	  // Parameter 4 ophalen
	  var applicatie = process.argv[4];
	 // console.log('applicatie '+applicatie);
	 
   
	var jsonApilog;
	var soapMessage;
	var antwoord;
	 

async function startConsumeWebservice (setletter, guid, applicatie) {
   try{
	   
   const respApiLog = await getApiLog(setletter, guid);
   let jsonApilog = await respApiLog;
   console.log('createAndSendRequest ' + JSON.stringify(jsonApilog));
   let resolve = await createAndSendRequestWebservice(setletter, guid, jsonApilog);;
    
    } catch (e) {
        console.error(e);
    } finally {
        console.log('ApiWeb cleanup');
		return ({ message: 'ApiWeb succesvol uitgevoerd'});
    }
}



async function createAndSendRequestWebservice(setletter, guid,jsonApilog) {
	try{
	console.log('createAndSendRequest ' + JSON.stringify(jsonApilog));
    const respCreateAndSendRequest = await createAndSendRequest(setletter, guid,jsonApilog);
	let resultCreateAndSendRequest = await respCreateAndSendRequest;
	console.log('resultCreateAndSendRequest: ' + resultCreateAndSendRequest);
    return resultCreateAndSendRequest;
	} catch (e) {
        console.error(e);
    }
}

	
startConsumeWebservice (setletter, guid, applicatie);
 
async function handleConsumeWebservice (setletter, guid, applicatie)
{
    try{	
	console.log('setletter:' + setletter);
	
	var resolve = await startConsumeWebservice (setletter, guid, applicatie);
	return (resolve);
    }
	catch(err) {}
	
}


module.exports = {
  handleConsumeWebservice: handleConsumeWebservice
  }; 