var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var Promise = require('bluebird');

Promise.promisifyAll(mongo.Collection.prototype);

var state = {
	db: null,
}

var exports = module.exports = {};

function afterConnect(db,collections,resolve){
	state.db = db
	for (var i in collections) {
		exports[collections[i]] = state.db.collection(collections[i]);
	}
	resolve("Successfully connected to mongo");
}

exports.connect = function(config) {
	return new Promise(function(resolve,reject){
		if (state.db){
			resolve("Already connected to mongo");
		}

		var url = config.host + "/" + config.db;
		if(config.replicaSet){
			url += "?replicaSet=" + config.replicaSet;
		}
		mongoClient.connect(url, function(err, db) {
			if (err){
				reject(err)
			}
			else{
				if(config.auth){
					db.admin().authenticate(config.auth.username,config.auth.password,function(err,res){
						if(err){
							reject(err);
						}
						else{
							afterConnect(db,config.collections,resolve);
						}
					})
				}
				else{
					afterConnect(db,config.collections,resolve);
				}
			}
		});
	});
}

exports.close = function() {
	return new Promise(function (resolve,reject){
		if (state.db) {
			state.db.close(function(err, result) {
				if(err){
					reject(err);
				}
				else{
					state.db = null
					resolve("Successfully closed mongo connection");
				}
			})
		}
		else{
			resolve("Mongo connection already closed");
		}
	});
}

exports.db = function() {
	return {
		db: state.db
	}
}
