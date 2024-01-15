const { getApiLog } = require("./apilogDB.js");
const { createAndSendRequest } = require("./handleApiWeb.js");
 


	 var setletter = process.argv[2];
	 //var setletter = '';
	 // console.log('setletter '+setletter);
	  
	
	// Parameter 3 ophalen
	  var guid = process.argv[3];
	 //var guid = '';
	  //console.log('guid '+guid); 
	  
	  // Parameter 4 ophalen
	  var applicatie = process.argv[4];
	 //var applicatie = '' ;
	 // console.log('applicatie '+applicatie); 
   
	var jsonApilog;
	var soapMessage;
	var antwoord;
	//logger.info('Test start logging');

async function startConsumeWebserviceApiWeb (setletter, guid, applicatie) {
   try{
   
    
   const respApiLog = await getApiLog(setletter, guid);
  // console.log('createAndSendRequest ' + JSON.stringify(respApiLog));
   let jsonApilog = await respApiLog;
   //console.log('createAndSendRequest ' + JSON.stringify(jsonApilog));
   
    
   let resolve = await createAndSendRequestWebservice(setletter, guid, jsonApilog);;
    
    } catch (e) {
        console.error(e);
		 
    } finally {
        console.log('ApiWeb cleanup');
		return ({ message: 'ApiWeb succesvol uitgevoerd'});
    }
}



async function createAndSendRequestWebservice(setletter, guid, jsonApilog) {
	try{
	//console.log('createAndSendRequest ' + JSON.stringify(jsonApilog));
	
    const respCreateAndSendRequest = await createAndSendRequest(setletter, guid,jsonApilog);
	let resultCreateAndSendRequest = await respCreateAndSendRequest;
	//console.log('resultCreateAndSendRequest: ' + resultCreateAndSendRequest);
	//logger.info('createAndSendRequestWebservice ' );
    return resultCreateAndSendRequest;
	} catch (e) {
        console.error(e);
		 
    }
}

	
//startConsumeWebserviceApiWeb (setletter, guid, applicatie);
 
async function handleConsumeWebserviceApiWeb (setletter, guid, applicatie)
{
    try{	
	//console.log('setletter:' + setletter);
	//logger.info('handleConsumeWebserviceApiWeb');
	
	var resolve = await startConsumeWebserviceApiWeb (setletter, guid, applicatie);
	return (resolve);
    }
	catch(err) { console.error('foutmelding handleConsumeWebserviceApiWeb ' + err);}
	
}


module.exports = {
  handleConsumeWebserviceApiWeb: handleConsumeWebserviceApiWeb
  }; 