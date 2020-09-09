const sql = require('mssql');

const dbConfig = require('./dbConfig');
const queryBuilder = require('./queryBuilder');


module.exports = {

    userData: async function(queryType, userdata) {
        // Need to put logic for Stage and Prod from incoming request
        let config = dbConfig.configRTUser();

        let dbConn = new sql.ConnectionPool(config);;
        await dbConn.connect();
        //console.log('connection sucess');
        let SQL = queryBuilder.userQuery(queryType, userdata)
        try {
            const request = new sql.Request(dbConn);
            let result = await request.query(SQL);
            dbConn.close();
            //console.log('connection closed');
            return result;
        } catch (err) {
            console.error('SQL error', err);
        }   
    },


    getData: async function(env, table, fromDate, toDate, inputComm) {
        // Need to put logic for Stage and Prod from incoming request
        let config = dbConfig.configProd();

        let dbConn = new sql.ConnectionPool(config);;
        await dbConn.connect();
        //console.log('connection sucess');
        let SQL = queryBuilder.query(table, fromDate, toDate, inputComm)
        try {
            const request = new sql.Request(dbConn);
            let result = await request.query(SQL);
            dbConn.close();
            //console.log('connection closed');
            return result;
        } catch (err) {
            console.error('SQL error', err);
        }   
    },

    getDataSP: async function(env, inInterfaceid,outInterfaceid, filter, fromDate, toDate, storedProc) {
        // Need to put logic for Stage and Prod from incoming request
        
       
        let config = dbConfig.configStg();

        let dbConn = new sql.ConnectionPool(config);
        await dbConn.connect();
        //console.log('connection sucess');
        if (storedProc == 'SP_RT_RhapsodyDEV_RhapsodyPRD_v2') {
            try {
                const request = new sql.Request(dbConn);
                let result = await request
                
                            .input('interfaceid', sql.Int, outInterfaceid)
                            .input('match', sql.Int, filter)
                            .input('FromDate', sql.VarChar(50), fromDate)
                            .input('ToDate', sql.VarChar(50), toDate)
                            .execute(storedProc)
                dbConn.close();
                //console.log('connection closed');
                return result;
            } catch (err) {
                console.error('SQL error', err);
            }   
        }
        if (storedProc == 'SP_RT_FILTER_RhapsodyDEV_RhapsodyPRD') {
            try {
                const request = new sql.Request(dbConn);
                let result = await request
                            .input('InInterfaceid', sql.Int, inInterfaceid)
                            .input('OutInterfaceid', sql.Int, outInterfaceid)
                            .input('Filter', sql.Int, filter)
                            .input('FromDate', sql.VarChar(50), fromDate)
                            .input('ToDate', sql.VarChar(50), toDate)
                            .execute(storedProc)
                dbConn.close();
                //console.log('Filter SP connection closed');
                return result;
            } catch (err) {
                console.error('SQL error', err);
            }

        }
        
    }

}


