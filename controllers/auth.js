const getFetchData = require('../util/database/getFetchData.js')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs');
const passwordValidator = require('password-validator');

let schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(20)                                 // Max length
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces();                           // Should not have spaces

// GET for LoginPage
exports.getLogin = (req,res,next) => {
    //console.log(req.session.isLoggedIn)
    res.render('login.ejs',{
        pageTitle: 'Login in RT',
        message: req.flash('message')

    }) 
};

// Get request for Change Password page
exports.getChangePass = (req,res,next) => {
    //console.log(req.session.isLoggedIn)
    res.render('changePwd.ejs',{
        pageTitle: 'Login in RT',
        email: req.session.email,
        access: req.session.userAccess,
        path: '/integration/user/' + req.session.email + '/edit',
        message: req.flash('message')

    }) 
};

// POST request for Changing Password 
exports.postChangePass = (req, res, next) => {
    const base64Email = req.session.email;
    const buff = Buffer.from(req.session.email, 'base64');
    const email = buff.toString('utf-8');
    const oldPwd = req.body.oldPwd;
    const newPwd = req.body.newPwd;
    const repeatPwd = req.body.repeatPwd;

    if(repeatPwd === newPwd) {

        if(schema.validate(newPwd)){
            getFetchData.userData('select', email).then (result => {
                if(result.rowsAffected > 0) {
                    bcrypt.compare(oldPwd, result.recordset[0].password).then (doMatch => {
                        if(doMatch) {
                            bcrypt.hash(newPwd,12).then(hashedpassword => {
                                var userData = {email: email,
                                    password: hashedpassword
                                }                
                                getFetchData.userData('update', userData).then (results => {
                                    req.flash('message', 'Password changed sucessfully');
                                    res.redirect('/integration/testcases'); 
                                })
                                .catch(err => {
                                    console.log(err);
                                }); 
                            });
                        } else {
                            req.flash('message', 'Unable to change password - Incorrect old password');
                            //res.redirect('/integration/testcases');
                            res.redirect('/integration/user/' + base64Email + '/edit')
    
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    
                } else {
                    req.flash('message', 'Unable to change password at this time');
                    res.redirect('/integration/testcases');
                
                }
            })
        } else {
            req.flash('message', 'Password requirement not met - Your password must be 8-20 characters long, contain lower case and upper case letters, numbers, and must not contain spaces.');
            //res.redirect('/integration/testcases');
            res.redirect('/integration/user/' + base64Email + '/edit')
        }

    }
    else {
        req.flash('message', 'Unable to change password - Your password and confirmation password do not match');
        //res.redirect('/integration/testcases');
        res.redirect('/integration/user/' + base64Email + '/edit')
    }
    
}

// POST request to login  
exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    getFetchData.userData('select', email).then (result => {
        if(result.rowsAffected == 0) {
            req.flash('message', 'Invalid email or password');
            res.redirect('/integration/login'); 
        } else {
            bcrypt.compare(password, result.recordset[0].password).then (doMatch => {
                if(doMatch) {
                    let buff = Buffer.from(result.recordset[0].email);
                    let base64data = buff.toString('base64')
                    req.session.email = base64data;
                    req.session.userAccess = result.recordset[0].access_level;
                    req.session.isLoggedIn = true;
                    res.redirect('/integration/testcases');
                } else {
                    req.flash('message', 'Invalid email or password');
                    res.redirect('/integration/login'); 
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    })

}

//Post request to log out
exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        
        res.redirect('/integration/login');
        
    });
};

// GET request to create new user
exports.getUser = (req,res,next) => {
    res.render('register.ejs',{
        pageTitle: 'Create a new User',
        path: '/integration/user/new',
        email: req.session.email,
        access: req.session.userAccess,
        message: req.flash('message')
        
        
    })
};

// This POST will Create a new User
exports.postUser = (req,res,next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    let userAccess;
    if(req.body.userAccess == 'on') {
        userAccess = 1;
    } else {
        userAccess = 0;
    }
    getFetchData.userData('select', email).then (result => {
        if(result.rowsAffected > 0) {
            req.flash('message', 'Unable to create user - Email already exists');
            res.redirect('/integration/user/new'); 
        } else {
            if(schema.validate(password)){
                bcrypt.hash(password,12).then (hashedpassword => {
                    const user = new User(firstName, lastName, email, hashedpassword, userAccess)
                    getFetchData.userData('insert', user).then (results => {
                        req.flash('message', 'New user created successfully');
                        res.redirect('/integration/user/new'); 
                    })
                    .catch(err => {
                        console.log(err);
                    }); 
    
                })
            } else {
                req.flash('message', 'Password requirement not met - Your password must be 8-20 characters long, contain lower case and upper case letters, numbers, and must not contain spaces.');
                res.redirect('/integration/user/new'); 

            }
        
           

        }
    })
  
}; 

exports.defaultLanding = (req,res,next) => {
    res.redirect('/integration/login');
};