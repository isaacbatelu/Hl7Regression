const fs = require('fs-extra'); // require node file system core module
const path = require('path'); // require node path core module

const getLocalDateTime = require('../util/dates.js')

const nanoid = require('nanoid');

// defining path to save file or retrive data from file
const p = path.join( 
    path.dirname(process.mainModule.filename),
    'data');

const getTestCasesFromFile = (cb) => {
    fs.readFile(`${p}/testCases.json`, (err, fileContent) => {
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

const  updateFile = (fileDate) => {
    fs.writeFile(`${p}/testCases.json`,JSON.stringify(fileDate), (err) =>{ // write data to the file
        console.log(err);
    });

}



// Class for TestCase - This is what represents a single test case
module.exports = class TestCase {
    constructor(testCaseName, inputComm, outputComm, inputID, outputID, fromDate,toDate, enteredStartDate) { // Constructor for the class 
        this.testCaseID = nanoid();
        this.testCaseName = testCaseName;
        this.inputComm = inputComm,
        this.outputComm = outputComm,
        this.inputCommID = inputID,
        this.outputCommID = outputID,
        this.fromDate = fromDate,
        this.toDate = toDate,
        this.enteredStartDate = enteredStartDate,
        this.status = 'Created',
        this.testCaseDate = getLocalDateTime.localDateTime();
    }

    save(result) { // save method to save to array or DB
        // This will simply create an object for the test Cases
        getTestCasesFromFile (testCases => {
            testCases.push(this);
            fs.writeFile(`${p}/testCases.json`,JSON.stringify(testCases), (err) =>{ // write data to the file
                console.log(err);
            });
        });

        fs.mkdirSync(`${p}/${this.testCaseID}`, { recursive: true }, (err) => {
            if (err) throw err;
          });
        for (var i = 0; i < result.recordset.length; i++) {
                // Change Append File Sync
                fs.appendFileSync(`${p}/${this.testCaseID}/${this.testCaseName}_ProdInput${this.inputCommID}.txt`, `<A>\n${result.recordset[i].payload}</A>\n`) 
        }
    }

    static fetchAll(cb) { // Util function to fetch all test cases - This is a static method and can be called without instanting the testcases  class
        getTestCasesFromFile(cb)
    }

    static fetchTestCaseByID(id,cb) { // Util function to fetch a single test cases - This is a static method and can be called without instanting the testcases  class
        getTestCasesFromFile(testCases => {
            const testcase = testCases.find(t => t.testCaseID === id)
            cb(testcase);
        });
    }

    static updateStatus(id, cb) { // Util function to update 
        getTestCasesFromFile(testCases => {
            const upDatedTestcase = testCases.find(t => t.testCaseID === id);
            const remainingTestCases = testCases.filter(t => t.testCaseID !== id);
           // console.log(upDatedTestcase, remainingTestCases);
            upDatedTestcase.status ='Ready';            
            remainingTestCases.push(upDatedTestcase);
            updateFile(remainingTestCases);
            return cb([]);
        });
    }

    static deleteTestCaseByID(id) { // Util function to delete a single test cases - This is a static method and can be called without instanting the testcases  class
        try {
            let fileLoc = `${p}/${id}`;
            //fs.rmdirSync(`${p}/${id}`, { recursive: true });  
            fs.removeSync(fileLoc);
            getTestCasesFromFile(testCases => {
                const remainingTestCases = testCases.filter(t => t.testCaseID !== id)
                updateFile(remainingTestCases);
               /* fs.writeFile(`${p}/testCases.json`,JSON.stringify(remainingTestCases), (err) =>{ // write data to the file
                    console.log(err);
                });*/
            }); 
        }
        catch(err) {
            console.log(err);
        }
    }

    
};