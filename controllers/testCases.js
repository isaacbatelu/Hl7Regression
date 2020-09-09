const getFetchData = require('../util/database/getFetchData.js')
const TestCase = require('../models/testCase.js')
const incrementDate = require('../util/dates.js')
const TestCaseResult = require('../models/testCaseResult.js')

const fs = require('fs'); // require node file system core module
const path = require('path'); // require node path core module

const p = path.join( 
    path.dirname(process.mainModule.filename),
    'data');


// This GET will fetch all test cases and will be the landing page
exports.getTestCases = (req,res,next) => {
    
    TestCase.fetchAll(testCases => {
        testCases.sort((a, b)=>{ // Sort in decending order
            var keyA = new Date(a.testCaseDate),
                keyB = new Date(b.testCaseDate);
            // Compare the 2 dates
            if(keyA > keyB) return -1;
            if(keyA < keyB) return 1;
            return 0;
        });
        //console.log(testCases)
        res.render('index.ejs', {
            testCases: testCases,
            pageTitle: 'List of Test Cases',
            path: '/',
            email: req.session.email,
            access: req.session.userAccess,
            message: req.flash('message')
   
        });
    });    
};


// This GET will fetch details of a Test Case
exports.getTestCase = (req,res,next) => {
    const testID =  req.params.testID;  
    TestCase.fetchTestCaseByID(testID, testCase => {
        if (testCase !== undefined) {
            TestCaseResult.fetchAll (testID, testResult => {
                res.render('testDetails.ejs', {
                    testCase: testCase,
                    testResult: testResult,
                    pageTitle: 'Test Cases Details',
                    path: `'/integration/testcases/${testID}'`,
                    email: req.session.email,
                    access: req.session.userAccess
                }); 
    
            })

        } else {
            res.redirect('/integration/testcases/');
        }
        
         
    });    
}

//// FILE DOWN LOAD
exports.getFileTest = (req, res,next) =>{
    const testID =  req.params.testID;
    const fileName =  req.params.fileName;
    let fileLoc;
    if (fileName.match(/_ProdInput/g)) { 
        fileLoc = `${p}/${testID}/${fileName}.txt`;
    } else {
        fileLoc = `${p}/${testID}/results/${fileName}.txt`;
    }
    res.download(fileLoc); // Set disposition and send it.
  };

/// FILE DOWN LOAD
//exports.getInputFileTest = (req, res,next) =>{
 //   const testID =  req.params.testID;
  //  const fileName =  req.params.fileName;
    //const fileLoc = `${p}/${testID}/input/${fileName}.txt`;
    //res.download(fileLoc); // Set disposition and send it.
  //};
  
// This GET will display form to create new test case
exports.getTestCaseInput = (req,res,next) => {
    getFetchData.getData('Test', 'dbo.RHAPSODY_INTERFACES').then (results => {
        res.render('testCase.ejs', {
            hasCommPts: results.recordset >1,
            res: results.recordset,
            pageTitle: 'Create New Test',
            path: '/integration/testCases/new',
            email: req.session.email,
            access: req.session.userAccess
        });
    })
    .catch(err => {
        //HANDLE THIS ERROR WITH DATA BASE ERR NEW PAGE
        console.log(err);
    });  
};

// This post is to create result set

exports.postTestCaseResult = (req,res,next) => {
    
    const testID =  req.params.testID;
    TestCase.fetchTestCaseByID(testID, testCase => {
         let startDate =  testCase.fromDate;
         let endDate =  testCase.toDate;
         let inputCommID = testCase.inputCommID;
         let outputCommID = testCase.outputCommID;
         let testCaseName= testCase.testCaseName;
        // console.log(startDate);

         const testCaseResult = new TestCaseResult(testID);
         const fileNameMatch = ['recMisMatch', 'recMatch'];
         const fileNameFilter = ['InProdNotInStg', 'InStgNotInPrd'];
         const storedprocName = ['SP_RT_RhapsodyDEV_RhapsodyPRD_v2', 'SP_RT_FILTER_RhapsodyDEV_RhapsodyPRD'];
         let cnt = 0;
         req.connection.setTimeout( 1000 * 60 * 10 );
         getFetchData.getDataSP('Stg', inputCommID, outputCommID, 0,startDate, endDate, storedprocName[0])
         .then (results => {
            testCaseResult.createResultSet(results, storedprocName[0], fileNameMatch[0],testCaseName,comp =>{
                getFetchData.getDataSP('Stg', inputCommID, outputCommID, 1,startDate, endDate, storedprocName[0])
                .then (results => {
                    testCaseResult.createResultSet(results, storedprocName[0], fileNameMatch[1],testCaseName,comp =>{
                        getFetchData.getDataSP('Stg', inputCommID, outputCommID, 1,startDate, endDate, storedprocName[1])
                        .then (results => {
                            testCaseResult.createResultSet(results, storedprocName[1], fileNameFilter[0],testCaseName,comp =>{
                                getFetchData.getDataSP('Stg', inputCommID, outputCommID, 0,startDate, endDate, storedprocName[1])
                                .then (results => {
                                    
                                    testCaseResult.createResultSet(results, storedprocName[1], fileNameFilter[1],testCaseName,comp =>{
                                        TestCase.updateStatus(testID, cb => {
                                            testCaseResult.save(cb => {
                                                res.redirect('/integration/testcases/');
                                            });

                                        });
                                       
                                        
                                    })
                            
                                })

                            })
                        })
                    })
                })
       
            }) 
        })
        
    })
}; 



// This POST will Create a new Test Case
exports.postTestCase = (req,res,next) => {
    const testCaseName = req.body.testCaseName;
    const inputComm = req.body.inputComm.split('-')[0].replace(/\s+/g, ''); //REMOVE SPACES
    const outputComm = req.body.outputComm.split('-')[0].replace(/\s+/g, '');;//REMOVE SPACES
    const fromDate = req.body.fromDate;
    let toDate;
    if(req.body.switch == 'on') {
        toDate = req.body.toDate;
    } else {
        toDate = "";
    }
   // let toDate = req.body.toDate;
    toDate == "" ? toDate = incrementDate.incr_date(fromDate) : toDate = incrementDate.incr_date(toDate);
    let enteredStartDate = req.body.toDate;
    enteredStartDate == "" ? enteredStartDate = fromDate : enteredStartDate = enteredStartDate;
    req.connection.setTimeout( 1000 * 60 * 10 );
    getFetchData.getData('Prd', 'dbo.RHAPSODY_ARCHIVE', fromDate, toDate, inputComm).then (results => {
        const testCase = new TestCase(testCaseName,req.body.inputComm, req.body.outputComm, inputComm, outputComm, fromDate,toDate, enteredStartDate );
        testCase.save(results);
        res.redirect('/integration/testcases'); 
    })
    .catch(err => {
        console.log(err);
    });   
}; 


// Delete Request to delete a test case
exports.deleteTestCase = (req,res,next) => {
    const testID =  req.params.testID;  
    TestCase.deleteTestCaseByID(testID);    
    res.redirect('/integration/testcases'); 
}

// This is catch ALL URL which redircts to landing page
exports.defaultLanding = (req,res,next) => {
    res.redirect('/integration/testcases');
};