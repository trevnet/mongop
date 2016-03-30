# Mongop

### Installation
```
npm install mongop
```
### Usage
Require mongop module:
```
var db = require('mongop');
```
Connect to mongo - host and db are required, everything else is optional.
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
db.getDb()
```
Close the database connection:
```
db.close()
```

###Testing
When testing your app, add the following code to the beginning of your tests to populate the mongop object with your collections.
```
var db = require('mongop');
var collection = require('mongodb').Collection;
for(var i in config.mongo.collections){
	db[ config.mongo.collections[i] ] = Object.create(collection.prototype);
}
```

Then you can stub out the mongodb calls:
```
sinon.stub(db.Hello,'findOne').returns(q.when({"world":1}))
```
