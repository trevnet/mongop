var url = require('url');
var mongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

var state = {
	db: null
}

function buildStringConnectionFromConfig(config){
	var connection = {
		protocol:"mongodb",
		slashes:true, //puts the // after mongdb:
		hostname:config.host,
		pathname:config.db,
		query:config.options
	};
	if (config.auth){
		connection.auth = config.auth.username+":"+config.auth.password;
	}
	return url.format(connection);
}

var exports = module.exports = {};

exports.connect = function(config) {
	if (state.db){
		return Promise.resolve("Already connected to mongo");
	}
	return mongoClient.connect(buildStringConnectionFromConfig(config),{promiseLibrary:Promise}).then(function(db){
		state.db = db;
		for (var i in config.collections) {
			exports[config.collections[i]] = state.db.collection(config.collections[i]);
		}
		return "Successfully connected to mongo";
	},function(err){
		return Promise.reject(err);
	});

}

exports.close = function() {
	if (state.db) return state.db.close();
	return Promise.resolve("Mongo connection already closed");
}

exports.db = function() {
	return state.db;
}
