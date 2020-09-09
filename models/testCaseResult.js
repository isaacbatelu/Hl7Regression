const fs = require('fs-extra'); // require node file system core module
const path = require('path'); // require node path core module

const getLocalDateTime = require('../util/dates.js')

const nanoid = require('nanoid');

// defining path to save file or retrive data from file
const p = path.join( 
    path.dirname(process.mainModule.filename),
    'data');

const getTestCasesResultFromFile = (testCaseID,cb) => {
    fs.readFile(`${p}/${testCaseID}/result.json`, (err, fileContent) => {
        if(err){ // Check if file exists
           return cb([])
        }
        else {
            if(fileContent.length > 0) { // if file exist check size of file
                cb(JSON.parse(fileContent));
            } else { // return if file size > 0
                return cb([])
            }
        }
    })

}




// Class for TestCase - This is what represents a single test case
module.exports = class TestCaseResult {
    constructor(testCaseID) { // Constructor for the class 
        this.testCaseID = testCaseID;
        this.InProdNotInStgCnt = 0,
        this.InProdNotInStg = false,
        this.InStgNotInPrdCnt = 0,
        this.InStgNotInPrd = false,
        this.recMisMatchCnt = 0,
        this.recMatchCnt = 0,
        this.recMatchStg = false,
        this.recMatchPrd = false,    
        this.testCaseDate = getLocalDateTime.localDateTime();
    }

    save(cb) { // save method to save to array or DB
        // This will simply create an object for the test Cases
        getTestCasesResultFromFile (this.testCaseID,testCasesResult => {
            testCasesResult.push(this);
            fs.writeFileSync(`${p}/${this.testCaseID}/result.json`,JSON.stringify(testCasesResult))
            return cb([])
        });
        
       
    }

     createResultSet(result,storedprocName,filename,testCaseName,cb) {
    
        let filePrd = `${filename}Prd.txt`;
        let fileStg = `${filename}Stg.txt`;
        let fileCnt = `${filename}Cnt`;
        let  cnt = result.recordset.length;  

        fs.mkdirSync(`${p}/${this.testCaseID}/results`, { recursive: true }, (err) => {
            if (err) throw err;
          });
        if(storedprocName == 'SP_RT_RhapsodyDEV_RhapsodyPRD_v2')   {

            for (var i = 0; i < result.recordset.length; i++) {
            
                fs.appendFileSync(`${p}/${this.testCaseID}/results/${testCaseName}_${filename}Prd.txt`, `\n${result.recordset[i].PRD_MESSAGE}\n`) 
                fs.appendFileSync(`${p}/${this.testCaseID}/results/${testCaseName}_${filename}Stage.txt`, `\n${result.recordset[i].DEV_MESSAGE}\n`) 
            }
           
            if (cnt >0) {
                this[fileCnt] = cnt;
                this[filename] = true;
            }
            return cb([]);
        } else {
             
            for (var i = 0; i < result.recordset.length; i++) {
                
                fs.appendFileSync(`${p}/${this.testCaseID}/results/${testCaseName}_${filename}.txt`, `\n${result.recordset[i].PAYLOAD}\n`) 
               
            }
           
            if (cnt >0) {
                this[fileCnt] = cnt;
                this[filename] = true;
            }
            return cb([]);
        }   
       
       // this.save();
    }

    static fetchAll(id, cb) { // Util function to fetch all test cases - This is a static method and can be called without instanting the testcases  class
        getTestCasesResultFromFile(id,cb)
    }

    static fetchTestCaseByID(id,cb) { // Util function to fetch a single test cases - This is a static method and can be called without instanting the testcases  class
        getTestCasesFromFile(testCases => {
            const testcase = testCases.find(t => t.testCaseID === id)
            cb(testcase);
        });
    }

    static deleteTestCaseByID(id) { // Util function to delete a single test cases - This is a static method and can be called without instanting the testcases  class
        try {
            fs.rmdirSync(`${p}/${id}`, { recursive: true });  
            getTestCasesFromFile(testCases => {
                const remainingTestCases = testCases.filter(t => t.testCaseID !== id)
                fs.writeFile(`${p}/testCases.json`,JSON.stringify(remainingTestCases), (err) =>{ // write data to the file
                    console.log(err);
                });
            }); 
        }
        catch(err) {
            console.log(err);
        }
    }
};