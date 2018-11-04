var User = require('../passport/profile');
var async = require('async');
var crypto = require('crypto');
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var dbConfig = require('../db');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;

module.exports = function(app, passport){

	var mongoose = require('mongoose')
	app.use(function (req, res, next) {
		res.locals.login = req.isAuthenticated();
		next();
	});

    /* GET home page. */
    app.get('/', function(req, res, next) {
      res.render('home', { title: 'Gunn Business' });
    });
	// app.get('/pb', function(req, res, next) {
    //   res.render('pb', { title: 'Partnership with Business - name' });
    // });
	// app.get('/cs', function(req, res, next) {
    //   res.render('cs', { title: 'Community Service - name' });
    // });
    /* GET About page. */
    app.get('/about', function(req, res, next) {
      res.render('about', { title: 'Gunn Business' });
    });
    app.get('/officers', function(req, res, next) {
      res.render('officers', { title: 'Gunn Business' });
    });
	// app.get('/zohoverify/verifyforzoho.html', function(req, res, next) {
    //   res.render('verifyforzoho');
    // });
	/* GET New User page. */
	app.get('/login', function(req, res) {
		if(req.isAuthenticated(req, res)) {
            res.redirect('/resources');
        } else {
			// crypto.randomBytes(20, function(err, buf) {
			// 	var token = buf.toString('hex');
			// 	console.log(token);
			// 	console.log(Date.now() + 172800000);
			//   });
			res.render('login', { title: 'Gunn Business', message: req.flash('message')});
		}
	});
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/resources',
		failureRedirect: '/login',
		failureFlash : true
	}));
	/* GET New User page. */
	app.get('/registration', function(req, res) {
		if(req.isAuthenticated(req, res)) {
            res.redirect('/resources');
        } else {
			res.render('registration', { title: 'Gunn Business', message: req.flash('message')});
		}
	});
    /* Handle Registration POST */
    app.post('/registration', passport.authenticate('signup', {
		successRedirect: '/resources',
		failureRedirect: '/registration',
		failureFlash : true
	}));
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	app.get('/forgot', function(req, res) {
		if(req.isAuthenticated(req, res)) {
            res.redirect('/resources');
        } else {
			res.render('forgot', {
				title: 'Gunn Business',
				message: req.flash('message'),
				info: req.flash('info')
			});
		}
	});
	app.post('/forgot', function(req, res, next) {
		async.waterfall([
		    function(done) {
		      crypto.randomBytes(20, function(err, buf) {
		        var token = buf.toString('hex');
		        done(err, token);
		      });
		    },
		    function(token, done) {
		      User.findOne({ email: req.body.email }, function(err, user) {
		        if (!user) {
		          req.flash('message', 'No account with that email address exists.');
		          return res.redirect('/forgot');
		        }

		        user.resetPasswordToken = token;
		        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				console.log("token:",token);
		        user.save(function(err) {
		          done(err, token, user);
		        });
				// req.flash('info', 'Please see a name Officer for more the link to reset your password.');
		      });
			},
		    function(token, user, done) {
				var smtpTransport = nodemailer.createTransport(dbConfig.smtp);
				// console.log("same");
				var mailOptions = {
					to: user.email,
					from: 'info@gunnbusiness.com',
					subject: 'name Password Reset',
					text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + 'gunnbusiness.com' + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
					done(err, 'done');
				});
			}
		], function(err) {
			if (err) return next(err);
			res.redirect('/forgot');
		});
	});
	app.post('/contact', function(req, res, next) {
		async.waterfall([
			function(done) {
				var smtpTransport = nodemailer.createTransport(dbConfig.smtp);
				// console.log("same");
				console.log(req.body.name);
				var mailOptions = {
					to: 'info@gunnbusiness.com',
					from: 'info@gunnbusiness.com',
					subject: 'Message from ' + req.body.name,
					text: 'Name: ' + req.body.name + '\n\nEmail: ' + req.body.email + '\n\nMessage: ' + req.body.message
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					done(err, 'done');
				});
			}
		], function(err) {
			if (err) return next(err);
			res.redirect('/');
		});
	});
	app.get('/reset/:token', function(req, res) {
		User.findOne({resetPasswordToken:req.params.token}, function(err, user) {
			if (!user) {
				req.flash('message', 'Password reset token is invalid or has expired.');
				console.log(req.params.token);
			}
			res.render('reset', {
				user: req.user,
				title: 'Gunn Business',
				message: req.flash('message')
			});
		});
	});
	app.post('/reset/:token', function(req, res) {
		async.waterfall([
			function(done) {
				User.findOne({resetPasswordToken: req.params.token}, function(err, user) {
					if (!user) {
					  req.flash('message', 'Password reset token is invalid or has expired.');
					  return res.redirect('back');
					}

					user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function(err) {
						req.logIn(user, function(err) {
						done(err, user);
						});
					});
				});
			}
		], function(err) {
			res.redirect('/resources');
		});
	});
	/* GET Profile Page */
	app.get('/resources', isAuthenticated, function(req, res){
<<<<<<< HEAD
		MongoClient.connect('mongodb+srv://daniel:Password123@cluster0-wh7gg.azure.mongodb.net/testDB?retryWrites=true', (err, newDb) => {
		  if(err) {
			  return console.log("Error", err);
		  }
		  db = newDb; // ADD THIS

		  // const db = client.db('testDB')
		  console.log(db.asdf.find({id:3}))
		  db.listCollections().toArray(function(err, items) {
			  console.log(items)
        	});

		//   db.listCollections().toArray((err, collections) => {
	    //   	console.dir(collections);
	    //     db.close();
	    // });
		  // let showlist = db.collection('demo').find().toArray();
	  })
=======
		res.render('resources', { title: 'Gunn Business', user: req.user, message: req.flash('message')});
	});
	app.get('/resources/1', isAuthenticated, function(req, res){
		res.render('resources', { title: 'Gunn Business', user: req.user, message: req.flash('message')});
>>>>>>> refs/remotes/origin/master
	});
	app.get('/resources/hi', isAuthenticated, function(req, res){
		res.render('resources', { title: 'Gunn Business', user: req.user, message: req.flash('message')});
	});
	app.post('/setinfo', function(req, res) {
		req.user.firstName = req.body.firstName;
		req.user.lastName = req.body.lastName;
		req.user.email = req.body.email;
		req.user.phoneNumber = req.body.phoneNumber;
		req.user.grade = req.body.grade;
		req.user.birthday = req.body.birthday;
		req.user.studentID = req.body.studentID;
		req.user.parent1email = req.body.parent1email;
		req.user.parent2email = req.body.parent2email;
		req.user.save(function (err, member) {
			if (err) return console.error(err);
		});
		res.redirect('/resources');
	});

	app.get('/admin', isAuthenticated, function(req, res){
		if (req.user && req.user.isAdmin === true) {
			var userMap = {};
			mongoose.model("User").find({}, function(err, users)
			{
			    users.forEach(function(user) {
					userMap[user._id] = user;
				});
				console.log(userMap);
				res.render('admin', { title: 'Gunn Business', user: req.user, members: userMap, message: req.flash('message')});
			});
        } else {
			res.redirect('/resources');
		}
	});
	app.post('/admin', isAuthenticated, function(req, res){
		if (req.user && req.user.isAdmin === true) {
			var userMap = {};
			req.body.email.forEach(function(email, index) {
				mongoose.model("User").findOne({ 'email': req.body.email[index]}, function(err, user) {
					if (err){
						console.log(err)
					}
					console.log(email)
					if (!user) {
						res.json('nope');
						console.log('nope');
					}
				})
			});
		res.redirect('admin');
        } else {
			res.redirect('/resources');
		}
	});
	app.get('/user/:email', function(req, res) {
		User.findOne({email:req.params.email}, function(err, user) {
			if (!user) {
				req.flash('message', 'User could not be found.');
				console.log(req.params.email);
			}
			res.render('user', {
				user: user,
				title: 'Gunn Business',
				message: req.flash('message')
			});
		});
	});
	app.post('/user/:email', function(req, res) {
		async.waterfall([
			function(done) {
				User.findOne({email: req.params.email}, function(err, user) {
					if (!user) {
					  req.flash('message', 'User could not be found.');
					  return res.redirect('back');
					}
					user.firstName = req.body.firstName;
					user.lastName = req.body.lastName;
					user.email = req.body.email;
					user.phoneNumber = req.body.phoneNumber;
					user.grade = req.body.grade;
					user.birthday = req.body.birthday;
					user.studentID = req.body.studentID;
					user.parent1email = req.body.parent1email;
					user.parent2email = req.body.parent2email;

					user.save(function (err) {
						if (err) return console.error(err);
						done(err);
					});
				});
			}
		], function(err) {
			res.redirect('/admin');
		});
	});
    // return app;
}

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}
