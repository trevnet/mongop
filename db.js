var mongoClient = require('mongodb').MongoClient
var q = require('q');

var state = {
	db: null,
}

var exports = module.exports = {};

exports.connect = function(config) {
	var deferred = q.defer();

	if (state.db){
		deferred.resolve("Already connected to mongo");
	}

	var url = config.host + "/" + config.db;
	if(config.replicaSet){
		url += "?replicaSet=" + config.replicaSet;
	}
	mongoClient.connect(url, function(err, db) {
		if (err){
			deferred.reject(err)
		}
		else{
			if(config.auth){
				db.admin().authenticate(config.auth.username,config.auth.password,function(err,res){
					if(err){
						deferred.reject(err);
					}
					else{
						state.db = db
						deferred.resolve("Successfully connected to mongo");
					}
				})
			}
			else{
				state.db = db
				deferred.resolve("Successfully connected to mongo");
			}
		}
	})

	return deferred.promise;
}

exports.close = function() {
	var deferred = q.defer();
	if (state.db) {
		state.db.close(function(err, result) {
			if(err){
				deferred.reject(err);
			}
			else{
				state.db = null
				deferred.resolve("Successfully closed mongo connection");
			}
		})
	}
	else{
		deferred.resolve("Mongo connection already closed");
	}
	return deferred.promise;
}

exports.db = function() {
	return {
		db: state.db
	}
}

exports.collection = function(collectioName){
	return {
		collection: state.db.collection(collectioName),

		findOne: function(match){
			var deferred = q.defer();
			this.collection.find(match).limit(1).next(done(deferred));
			return deferred.promise;
		},

		find: function(match){
			var deferred = q.defer();
			this.collection.find(match).toArray(done(deferred));
			return deferred.promise;
		},

		aggregate: function(pipeline){
			var deferred = q.defer();
			this.collection.aggregate(pipeline,done(deferred));
			return deferred.promise;
		},

		update: function(match,updateObj,options){
			var deferred = q.defer();
			this.collection.update(match,updateObj,options,done(deferred));
			return deferred.promise;
		},

		remove: function(match){
			var deferred = q.defer();
			this.collection.remove(match,options,done(deferred));
			return deferred.promise;
		}
	}

}

function done(deferred){
	return function(err,result){
		if(err){
			deferred.reject(err);
		}
		else{
			deferred.resolve(result);
		}
	}
}
