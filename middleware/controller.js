require('dotenv').config();
const Users = require('./../models/Users');
const Business = require('./../models/Business');
const Payment = require('./../models/payment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validateBusinessRegisterInput = require('./validation/registerBus');
const validateClinetRegisterInput = require('./validation/registerUser');
const validateLoginInput = require('./validation/login');
const sendAuthEmail = require('./mail');
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const configureStripe = require('stripe');
const stripe = configureStripe(STRIPE_SECRET_KEY);

function fourdigit() {
	return Math.floor(1000000 + Math.random() * 9000000);
}

function fivedigit() {
	return Math.floor(1000000 + Math.random() * 9000000);
}

exports.login = (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;
	// Find user by email
	Users.findOne({ email }).then((user) => {
		// Check if user exists
		if (!user) {
			Business.findOne({ email }).then((user) => {
				// Check if user exists
				if (!user) {
					return res.status(404).json({ emailnotfound: 'Email not found' });
				}
				// Check password
				bcrypt.compare(password, user.password).then((isMatch) => {
					if (isMatch) {
						const payload = {
							idBusiness: user.idBusiness,
							lastName: user.lastName,
						};
						jwt.sign(
							payload,
							process.env.ACCESS_TOKEN_SECRET,
							{
								expiresIn: 31556926, // 1 year in seconds
							},
							(err, token) => {
								res.json({
									success: true,
									confirmed: user.confirmed,
									token: 'Bearer ' + token,
								});
							}
						);
					} else {
						return res
							.status(400)
							.json({ passwordincorrect: 'Password incorrect' });
					}
				});
			});
		}

		// Check password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				const payload = {
					userId: user.userId,
					lastName: user.lastName,
				};
				jwt.sign(
					payload,
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: 31556926, // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							confirmed: user.confirmed,
							token: 'Bearer ' + token,
						});
					}
				);
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: 'Password incorrect' });
			}
		});
	});
};

exports.logout = (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
	res.sendStatus(204);
};

// Use this function to add user to database in Users with auth
exports.addUser = async (req, res) => {
	const { errors, isValid } = validateClinetRegisterInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	try {
		Users.findOne({ email: req.body.email }).then((result) => {
			if (result === null) {
				bcrypt.hash('' + req.body.password, 10).then((hashedPassword) => {
					let User = new Users({
						userId: fourdigit(),
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						phone: req.body.phone,
						email: req.body.email,
						password: hashedPassword,
						locations: [{ number: req.body.location }],
					});
					const userId = User.userId;
					User.save().then(() => {
						res.status(201).send(userId);
					});
				});
			} else {
				res.send('Eamil is exits');
			}
		});
	} catch (err) {
		res.status(500).send(err);
	}
};

// Use this funciton to find a user from database
exports.findUser = async (req, res) => {
	Users.findOne({ userId: req.params.userId })
		.then((information) => {
			if (information == null) {
				return res.status(400).send('Cannot find user');
			}
			bcrypt.compare(req.body.password, information.password).then((result) => {
				if (result) {
					res.send('Success');
				} else {
					res.send('Not Allowed');
				}
			});
		})
		.catch(() => {
			res.status(501).send('there something bad in findUser');
		});
};

exports.findUserById = async (req, res) => {
	var object = {};
	Users.findOne({ userId: req.params.userId })
		.then((information) => {
			object['UserId'] = information.userId;
			object['FullName'] = information.firstName + ' ' + information.lastName;
			object['Phone'] = information.phone;
			object['Location'] = information.location;
			res.send(object);
		})
		.catch(() => {
			res.send('There in somthing bad in findUserById');
		});
};

// Use this function to find all users from datebase
exports.findAllUser = function (req, res) {
	Users.find({}, function (err, information) {
		if (err) {
			return res.send(err);
		}
		res.send(information);
	});
};

// use this function to add a new business to database at Business
exports.addBusiness = async (req, res) => {
	const { errors, isValid } = validateBusinessRegisterInput(req.body);
	const fivedigit1 = fivedigit();
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	try {
		Business.findOne({ email: req.body.email }).then((result) => {
			if (!result) {
				bcrypt.hash('' + req.body.password, 10).then((hashedPassword) => {
					const {
						BusinessName,
						phone,
						email,
						type,
						location,
						BusinessImage,
					} = req.body;

					let Bus = new Business({
						idBusiness: fivedigit1,
						BusinessName,
						phone,
						email,
						type,
						password: hashedPassword,
						location,
						BusinessImage,
					});
					const idBusiness = Bus.idBusiness;
					Bus.save().then(() => {
						res.send(idBusiness); // Nasr
						// res.send('We save it to database');
					});
				});
			} else {
				res.send('Email is already exist');
			}
		});
	} catch (err) {
		res.send(err.message);
	}
};

// Use this function to add meal to specific Business at dataBase
exports.addMealToBusiness = function (req, res) {
	var addMeal = {
		idMeal: fourdigit(),
		mealName: req.body.mealName,
		discription: req.body.mealDiscription,
		mealAmount: req.body.mealAmount,
		image: req.body.mealURL,
		price: req.body.price,
		resId: req.params.idBusiness,
	};
	Business.updateOne(
		{ idBusiness: req.params.idBusiness },
		{
			$push: {
				meal: addMeal,
			},
		},
		{ returnOriginal: true }
	)
		.then((res) => {
			res.send('Meal Add to user' + req.params.idBusiness);
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

exports.PendingMealToBusiness = function (req, res) {
	var addMeal = {
		mealId: req.body.mealId,
		UserId: req.body.UserId,
		quantity: req.body.quantity,
	};
	Business.findOne(
		{ idBusiness: req.params.idBusiness },
		{
			pending: {
				$elemMatch: {
					mealId: req.body.mealId,
					UserId: req.body.UserId,
				},
			},
		}
	)
		.then((result) => {
			if (result.pending.length > 0) {
				Business.updateOne(
					{
						idBusiness: req.params.idBusiness,
						pending: { $elemMatch: { _id: result.pending[0]._id } },
					},
					{
						$inc: { 'pending.$.quantity': req.body.quantity },
					}
				).then((result) => {
					console.log(result);
				});
			} else {
				Business.updateOne(
					{ idBusiness: req.params.idBusiness },
					{
						$push: {
							pending: addMeal,
						},
					},
					{ returnOriginal: true }
				).then((res) => {
					res.send('Meal Add to Busnisees');
				});
			}
			res.end();
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.doneMealToBusiness = function (req, res) {
	var addMeal = {
		mealId: req.body.mealId,
		UserId: req.body.UserId,
		quantity: req.body.quantity,
	};
	Business.updateOne(
		{ idBusiness: req.params.idBusiness },
		{
			$push: {
				Done: addMeal,
			},
		},
		{ returnOriginal: true }
	)
		.then((res) => {
			res.send('Meal Add to Busnisees');
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

exports.findMealInBusiness = function (req, res) {
	Business.findOne({ idBusiness: req.params.idBusiness })
		.then((result) => {
			res.send(result.meal);
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.findMealInBusinessDone = function (req, res) {
	Business.findOne({ idBusiness: req.params.idBusiness })
		.then((result) => {
			res.send(result.Done);
		})
		.catch((err) => {
			res.send(err);
		});
};

// Use this function to remove a meal from a Businesse profile
exports.removeMealBusiness = function (req, res) {
	var addMeal = {
		idMeal: req.body.idMeal,
	};
	Business.updateOne(
		{ idBusiness: req.params.idBusiness },
		{
			$pull: {
				meal: addMeal,
			},
		}
	)
		.then((res) => {
			res.send('Meal Delete from user : ' + req.params.idBusiness);
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

// Use this function to find a User inside the database
exports.findBusiness = function (req, res) {
	Business.findOne({ idBusiness: req.params.idBusiness })
		.then((result) => {
			if (result == null) {
				return res.status(400).send('Cannot find Business');
			}
			bcrypt.compare(req.body.password, result.password).then((result) => {
				if (result) {
					res.send('Success');
				} else {
					res.send('Not Allowed');
				}
			});
		})
		.catch((err) => {
			res.status(501).send('Nothing to find in businsess');
		});
};

// Use this function to find all user in the database
exports.findAllBusiness = function (req, res) {
	Business.find({}, function (err, information) {
		if (err) {
			return res.send(err);
		}
		res.send(information);
	});
};

// Use this function to add order to a User
exports.addOrderUser = function (req, res) {
	var addMeal = {
		mealId: req.body.mealId,
		resId: req.body.resId,
		userId: req.params.userId,
		amount: req.body.amount,
	};

	Users.find(
		{
			userId: req.params.userId,
		},
		{
			orderList: { $elemMatch: { mealId: req.body.mealId } },
		}
	)
		.then((result) => {
			if (result[0].orderList.length > 0) {
				Users.updateOne(
					{
						userId: req.params.userId,
						orderList: { $elemMatch: { _id: result[0].orderList[0]._id } },
					},
					{
						$inc: { 'orderList.$.amount': req.body.amount },
					}
				).then((result) => {
					console.log(result);
				});
			} else {
				Users.updateOne(
					{ userId: req.params.userId },
					{
						$push: {
							orderList: addMeal,
						},
					}
				).then((result) => {
					res.send('Meal Add to user' + req.params.idBusiness);
				});
			}
			res.send('in side the add to order meal to meal');
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.removeAllOrderUser = function (req, res) {
	Users.updateOne({ userId: req.params.userId }, { $set: { orderList: [] } })
		.then((result) => {
			res.send(result.orderList);
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

// Use this function to delete an order from User's Order
exports.removeOrderUser = function (req, res) {
	var addMeal = {
		mealId: req.body.mealId,
	};
	Users.updateOne(
		{ userId: req.params.userId },
		{
			$pull: {
				orderList: addMeal,
			},
		}
	)
		.then((res) => {
			res.send('Meal Delete from user : ' + req.params.userId);
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

exports.PendinngMealInBusiness = async function (req, res) {
	const { idBusiness } = req.params;
	const { mealId, mealAmount } = req.body;
	var result = await Business.findOne({ idBusiness: idBusiness });
	if (result) {
		for (var i = 0; i < result.meal.length; i++) {
			if (result.meal[i].idMeal == mealId) {
				if (result.meal[i].mealAmount - Number(mealAmount) > 0) {
					result.meal[i].mealAmount =
						result.meal[i].mealAmount - Number(mealAmount);
				} else if (result.meal[i].mealAmount - Number(mealAmount) === 0) {
					var name = result.meal[i].mealName;
					result.meal.splice(i, 1);
					//   res.send(`out of ${name}`);
				}
			}
		}
		result
			.save()
			.then((result2) => {
				res.send('Request Confirmed');
			})
			.catch((err) => {
				console.log(err, 'failure in updating the meal amount');
			});
	}
};

// exports.removePendinngMealInBusiness = function (req, res) {
// 	var addMeal = {
// 		mealId: req.body.mealId,
// 	};
// 	Business.updateOne(
// 		{ idBusiness: req.params.idBusiness },
// 		{
// 			$pull: {
// 				pending: addMeal,
// 			},
// 		}
// 	)
// 		.then((res) => {
// 			res.send('Meal Delete from Busniss Pending : ' + req.params.idBusiness);
// 		})
// 		.catch((err) => {
// 			res.send(err.massage);
// 		});
// };

// exports.removePendinngMealInBusiness = function (req, res) {
// 	console.log(typeof req.params.idBusiness, req.body.mealId, req.body.UserId);
// 	var meal = Number(req.body.mealId);
// 	var user = Number(req.body.UserId);
// 	console.log(typeof meal);
// 	// Business.update(
// 	// 	{
// 	// 		idBusiness: req.params.idBusiness,
// 	// 		pending: {
// 	// 			$elemMatch: {
// 	// 				UserId: req.body.UserId,
// 	// 			},
// 	// 		},
// 	// 	},
// 	// 	{
// 	// 		$pull: { mealId: req.body.mealId },
// 	// 	},
// 	// 	{ multi: true }
// 	// )
// 	// 	.then((result) => {
// 	// 		if (result.nModified === 0) {
// 	// 			console.log(result);
// 	// 			res.send(' Meal Not delete from database');
// 	// 		}
// 	// 		console.log(result);
// 	// 		res.send('Meal Delete from Busniss Pending : ' + req.params.idBusiness);
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		console.log(err);
// 	// 		res.send(err.massage);
// 	// 	});
// };
// 	Business.findOne(
// 		{ idBusiness: req.params.idBusiness },
// 		{
// 			pending: {
// 				$elemMatch: {
// 					mealId: req.body.mealId,
// 					UserId: req.body.UserId,
// 				},
// 			},
// 		}
// 	).then((result) => {
// 		result.pending;
// 		res.send(result);
// 	});
// };

exports.removePendinngMealInBusiness = function (req, res) {
	const { idBusiness } = req.params;
	const { mealId, userId } = req.body;
	Business.findOne({ idBusiness: idBusiness })
		.then((result) => {
			if (result) {
				for (var i = 0; i < result.pending.length; i++) {
					if (
						result.pending[i].mealId == mealId &&
						result.pending[i].UserId == userId
					) {
						result.pending.splice(i, 1);
					}
				}
				result
					.save()
					.then((response) => {
						res.send('removed from pending successfully');
					})
					.catch((err) => {
						console.log(err);
					});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.removeAllFromPending = function (req, res) {
	var addMeal = {
		mealId: req.body.mealId,
	};
	Business.updateOne(
		{ idBusiness: req.params.idBusiness },
		{
			$pull: {
				pending: addMeal,
			},
		}
	)
		.then((res) => {
			res.send('Meal Delete from Busniss Pending : ' + req.params.idBusiness);
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

exports.saveImage = function (req, res) {
	console.log('We save the image');
};

exports.removeBusOrderUser = function (req, res) {
	Users.updateOne(
		{ userId: req.params.userId },
		{ $pull: { orderList: { resId: req.body.resId } } },
		{ multi: true }
	)
		.then((result) => {
			res.send(`delete all meal mach the resId`);
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.findOrderUser = function (req, res) {
	Users.findOne({ userId: req.params.userId })
		.then((result) => {
			const resIds = [];
			const mealsIds = [];
			result.orderList.map((e) => {
				resIds.push(e['resId']);
				mealsIds.push(e['mealId']);
			});
			Business.find({ idBusiness: { $in: resIds } }, (err, data) => {
				if (err) {
					console.log(err);
				} else {
					var comm = com(data);
					var fi = final(mealsIds, comm);
					addAmount(result.orderList, fi);
					var man = makeObject(fi, resIds);
					res.send(man);
				}
			});
		})
		.catch((err) => {
			res.send(err.massage);
		});
};
//------------ Nasr
exports.confirmEmail = (req, res) => {
	const { userId, email } = req.body;
	console.log(email, '----------- email ---------');
	console.log(userId, '--------- userId ----------');
	sendAuthEmail(email, userId);
};

exports.emailConfirmation = (req, res) => {
	const { userId } = req.params;
	const id = userId.substring(1);
	Business.updateOne(
		{ idBusiness: id },
		{
			confirmed: true,
		}
	)
		.then(() => {
			console.log('status changed !!');
		})
		.catch((err) => {
			console.log('Error in updating status', err);
		});
	Users.updateOne(
		{ userId: id },
		{
			confirmed: true,
		}
	)
		.then((data) => {
			if (data.nModified === 0) {
			}
			res.end();
		})
		.catch((err) => {
			console.log('Error in updating status', err);
		});
};
//----

//------ Payment ----- //
exports.stripeCheckoutGet = (req, res) => {
	res.send({
		message: 'Hello Stripe checkout server!',
		timestamp: new Date().toISOString(),
	});
};

exports.stripeCheckoutPost = (req, res) => {
	const postStripeCharge = (res) => (stripeErr, stripeRes) => {
		if (stripeErr) {
			res.status(500).send({ error: stripeErr });
		} else {
			res.status(200).send({ success: stripeRes });
		}
	};
	stripe.charges.create(req.body, postStripeCharge(res));
};
//--------------------//

exports.findMealInBusinessPending = async (req, res) => {
	Business.findOne({ idBusiness: req.params.idBusiness })
		.then((result) => {
			const UserId = [];
			const mealsIds = [];
			result.pending.map((e) => {
				UserId.push(e['UserId']);
				mealsIds.push(e['mealId']);
			});
			Users.find({ userId: { $in: UserId } }, (err, data) => {
				if (err) {
					console.log(err);
				} else {
					var man = dateToUser(data); //object of user and array
					var man2 = fromPendignToMeal(result, man);
					res.send(man2);
				}
			});
		})
		.catch((err) => {
			res.send(err.massage);
		});
};

function fromPendignToMeal(data, object) {
	var object2 = object;
	data.pending = removeduplicats(data.pending);
	for (let i = 0; i < data.pending.length; i++) {
		for (let e = 0; e < data.meal.length; e++) {
			var one = data.pending[i].mealId + '';
			var two = data.meal[e].idMeal + '';
			if (one === two) {
				object2[data.pending[i].UserId].push(data.meal[e]);
			}
		}
	}
	for (var key in object2) {
		for (let i = 0; i < object2[key].length; i++) {
			object2[key][i].mealAmount = 0;
		}
	}

	for (var key in object2) {
		for (let i = 0; i < object2[key].length; i++) {
			for (let e = 0; e < data.pending.length; e++) {
				if (
					data.pending[e].UserId == key &&
					data.pending[e].mealId == object2[key][i].idMeal
				) {
					object2[key][i]['mealAmount'] += data.pending[e].quantity;
				}
			}
		}
	}
	return object2;
}

function removeduplicats(data) {
	var array = [];
	var array2 = [];
	for (let i = 0; i < data.length; i++) {
		for (let e = i + 1; e < data.length; e++) {
			if (
				data[i].mealId === data[e].mealId &&
				data[i].UserId === data[e].UserId
			) {
				data[i].quantity += data[e].quantity;
				data[e].mealId = 123;
				data[e].UserId = 123;
			}
		}
		array.push(data[i]);
	}
	for (var i = 0; i < array.length; i++) {
		if (array[i]['mealId'] === 123 || array[i]['UserId'] === 123) {
		} else {
			array2.push(array[i]);
		}
	}
	return array2;
}

function dateToUser(data) {
	const object = {};
	for (let index = 0; index < data.length; index++) {
		object[data[index].userId] = [];
	}
	return object;
}

function addAmount(array1, array2) {
	const result = [];
	for (let i = 0; i < array1.length; i++) {
		for (let e = 0; e < array2.length; e++) {
			if (array1[i].mealId === array2[e].idMeal) {
				array2[e]['mealAmount'] = array1[i]['amount'];
			}
		}
	}
	return array2;
}

function makeObject(arr, resId) {
	const object = {};
	for (let i = 0; i < resId.length; i++) {
		object[resId[i]] = [];
	}
	for (let i = 0; i < arr.length; i++) {
		object[arr[i].resId].push(arr[i]);
	}
	return object;
}

function com(arr) {
	const array = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]['meal'].length >= 1) {
			const arrays = arr[i]['meal'];
			for (let e = 0; e < arrays.length; e++) {
				array.push(arrays[e]);
			}
		}
	}
	return array;
}

function final(array1, array2) {
	const result = [];
	for (let i = 0; i < array1.length; i++) {
		for (let e = 0; e < array2.length; e++) {
			if (array1[i] === array2[e]['idMeal']) {
				result.push(array2[e]);
			}
		}
	}
	return result;
}

exports.payment = async (req, res) => {
	var payment = new Payment({
		userId: req.body.userId,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		address1: req.body.address1,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		country: req.body.country,
	});
	payment
		.save()
		.then(() => {
			res.send('We save the Payment info in database ');
		})
		.catch((err) => {
			res.send(err);
		});
};

exports.updateMeal = (req, res) => {
	Business.findOne({ idBusiness: req.params.idBusiness })
		.then((result) => {
			if (result == null) {
				res.send('We cant find the res');
			} else {
				Business.update(
					{
						idBusiness: req.params.idBusiness,
						meal: { $elemMatch: { idMeal: req.body.idMeal } },
					},
					{
						$set: {
							'meal.$.mealName': req.body.mealName,
							'meal.$.discription': req.body.discription,
							'meal.$.mealAmount': req.body.mealAmount,
							'meal.$.price': req.body.price,
						},
					}
				).then((result) => {
					res.send('Meal Updated');
				});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};
