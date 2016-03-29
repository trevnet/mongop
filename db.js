var url = require('url');
var assert = require('assert');
var mongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

var state = {
	db: null
}

function validConfig(config) {
	return (typeof config.db === 'string' && typeof config.host === 'string');
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
	if (!validConfig(config)) return Promise.reject("Invalid Config");
	return mongoClient.connect(buildStringConnectionFromConfig(config),{promiseLibrary:Promise}).then(function(db){
		state.db = db;
		for (var i in config.collections) {
			exports[config.collections[i]] = state.db.collection(config.collections[i]);
		}
		return "Successfully connected to mongo";
	},function(err){
		throw err;
	});

}

exports.close = function() {
	if (state.db) return state.db.close().then(function(){
		state.db = null;
		return "Successfully closed connection"
	});
	return Promise.resolve("Mongo connection already closed");
}

exports.db = function() {
	return Promise.resolve({
		db: state.db
	});
}
