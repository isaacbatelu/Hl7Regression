module.exports = (req, res, next) => {
    if(req.session.userAccess != 1) {
        req.flash('message', 'Access Denied - You dont have access to visit that page');
        return res.redirect('/integration/testcases');
    }
    next();
}