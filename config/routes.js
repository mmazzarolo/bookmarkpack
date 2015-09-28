module.exports = function (app, passport) {

	var homeController = require('../controllers/home');
	var userController = require('../controllers/user');
	var contactController = require('../controllers/contact');
	var passportConf = require('../config/passport');

	/**
	 * Account routes.
	 */
	app.get('/', homeController.index);
	app.get('/login', userController.getLogin);
	app.post('/login', userController.postLogin);
	app.get('/logout', userController.logout);
	app.get('/forgot', userController.getForgot);
	app.post('/forgot', userController.postForgot);
	app.get('/reset/:token', userController.getReset);
	app.post('/reset/:token', userController.postReset);
	app.get('/signup', userController.getSignup);
	app.post('/signup', userController.postSignup);
	app.get('/contact', contactController.getContact);
	app.post('/contact', contactController.postContact);
	app.get('/account', passportConf.isAuthenticated, userController.getAccount);
	app.post('/account/id', passportConf.isAuthenticated, userController.postUpdateId);
	app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
	app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
	app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
	app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

	/**
	 * OAuth authentication routes. (Sign in)
	 */
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
		res.redirect(req.session.returnTo || '/');
	});
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
		res.redirect(req.session.returnTo || '/');
	});
	app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
		res.redirect(req.session.returnTo || '/');
	});
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
		res.redirect(req.session.returnTo || '/');
	});
	app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
		res.redirect(req.session.returnTo || '/');
	});

	/**
	 * User routes.
	 */
	app.get('/:username', userController.getUser);
	app.post('/:username/add', userController.postAdd);

};
