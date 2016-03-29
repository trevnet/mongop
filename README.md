# Mongop

Wraps mongodb operations in promises.

### Installation

npm install Mongop

### Usage
Require mongop module:
```
	var db = require('mongop');
```
Connect to mongo - host is required, everything else is optional.
```
	db.connect({
			db:"<db>",
			host:"<host1:port1,host2:port2...hostN:portN>", // Ports are optional
			user:{
				username:"<username>",
				password:"<password>"
			},
			options:{
				replicaSet:"<replica set>",
				authSource:"<auth source>" //if authenticating against a different database than db
			},
			collections:[
				"<collection1>",
				"<collection2>",
				...
				"<collectionN>"
			]
		})
```
Collections are loaded into the module on connection.

Example usage:
```
	db.collection1.findOne({hello:'world'})
	.then(function(result){
		console.log(result);
	},function(err){
		console.log(err);
	})
```
Retrieve the database connection object:
```
	db.db()
```
Close the database connection:
```
	db.close()
```
