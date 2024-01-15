const { dbconn, dbstmt } = require("idb-connector");
const connection = new dbconn();
    //connection.debug(true);
connection.conn("*LOCAL");

function runsqlp(sql, conn) {
    return new Promise((resolve) => {
        let statement = new dbstmt(conn);
        statement.exec(sql, (result, error) => {
            if (error) {
                statement.close();
                console.log(JSON.stringify(error));
                return resolve(error);

            }
			resolve(result);
			delay(3000);
			statement.close();
            
            
        });
    });
}

async function testSQL() {
    console.log("```debug output");
    
    console.log("---------------------------------------------");
    result = await runsqlp(
        `SELECT * from dasfpa.apilog order by log_create_date desc limit 1`, 
       
        connection
    );
    console.log("```debug output \n");
    console.log(`\`\`\` result output \n ${JSON.stringify(result,null," ")} \n\`\`\``);
}


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

testSQL();



module.exports = {
testSQL: testSQL, }