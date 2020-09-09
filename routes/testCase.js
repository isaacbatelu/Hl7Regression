const express = require('express');

const router = express.Router();

// getting controller for test cases
const testCasesController = require('../controllers/testCases');

const isAuth = require('../middleware/is-auth');
const hasAccess = require('../middleware/has-access');



// landing page listig all test cases
router.get('/',isAuth, testCasesController.getTestCases);

// New Test Case Creation Page
router.get('/new',isAuth,hasAccess, testCasesController.getTestCaseInput);


// download copy of test
router.get('/:testID/download/:fileName',isAuth, testCasesController.getFileTest);

// Display a test case
router.get('/:testID',isAuth, testCasesController.getTestCase);

// Delete a test case
router.delete('/:testID',isAuth, testCasesController.deleteTestCase);

// Process Results for Test Case
router.post('/:testID',isAuth,testCasesController.postTestCaseResult);

// POST request to create a new test Case
router.post('/',isAuth, testCasesController.postTestCase);

//Catch ALL - default landing page
router.get('*', isAuth, testCasesController.defaultLanding);

module.exports = router;