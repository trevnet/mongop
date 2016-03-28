# Mongop

Wraps mongodb operations in promises.

### Installation

npm install Mongop

### Usage
Require mongop module:

	var mongo = require('mongop');

Connect to mongo - host is required, everything else is optional. Host string includes database (ie: 'mongodb://127.0.0.1/test')

	mongo.connect({
			host:"<host>",
			replicaSet:"<replica set>",
			auth:{
				username:"<username>",
				password:"<password>"
			}
		})

Retrieve the database connection object:

	mongo.db()

Retrieve a collection object:

	mongo.collection(<collection name>)

Since this module just wraps the mongodb module in promises, you can call any operation on the database and collection objects. In addition to this, the collection object has the following operations already wrapped in promises:

	findOne(<match object>)
	find(<match object>)
	aggregate(<pipeline array>)
	update(<match object>,<update object>,<options object>)
	remove(<match object>)

Example usage:

	mongo.collection('collection').findOne({hello:'world'})
	.then(function(result){
		console.log(result);
	},function(err){
		console.log(err);
	})
