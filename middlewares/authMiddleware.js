// middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login'); // Redirect to login if not authenticated
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard'); // Redirect to dashboard if already logged in
    }
    next(); // Proceed to the next middleware if not authenticated
}

module.exports = { isAuthenticated, redirectIfAuthenticated };
