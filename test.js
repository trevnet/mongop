var assert = require('assert');
var sinon = require('sinon');
var Promise = require('bluebird');
var mongoClient = require('mongodb').MongoClient;
var db = require('./db');

var databaseConfig = require('./testConfig.json')
var mongoConnect = null;

describe('db.', function(){
	beforeEach(function(){
		mongoConnect = sinon.stub(mongoClient,"connect").returns(Promise.resolve({close:function(){return Promise.resolve("Closed");},collection:function(collectionName){ return "Got"+collectionName}}));
	});
	afterEach(function(done){
		db.close().then(function(){
			mongoConnect.restore();
			done();
		});
	});
	describe('connect()', function(){
		it('should connect with auth config', function(done){
			db.connect(databaseConfig.auth).then(function(result){
				assert.equal(result,"Successfully connected to mongo");
				done();
			});
		});
		it('should connect with noAuth config', function(done){
			db.connect(databaseConfig.noAuth).then(function(result){
				assert.equal(result,"Successfully connected to mongo");
				done();
			});
		});
		it('should error when missing host in config', function(done){
			db.connect(databaseConfig.missingHost).then(function(result){
				console.log("shouldn't get here");
			},function(err){
				assert.equal(err,"Invalid Config");
				done();
			});
		});
		it('should error when missing db in config', function(done){
			db.connect(databaseConfig.missingDB).then(function(result){
				console.log("shouldn't get here");
			},function(err){
				assert.equal(err,"Invalid Config");
				done();
			});
		});
		it('buildStringConnectionFromConfig should return correctly formatted mongo connection string', function(done){
			db.connect(databaseConfig.auth).then(function(result){
				assert(mongoConnect.calledWith('mongodb://alfonzo:windymeadows@testhost1.fake,testhost2/test?replicaSet=test0&authSource=admin'));
				done();
			});
		});
		it('should not attempt to connect again once connected', function(done){
			db.connect(databaseConfig.auth).then(function(result){
				db.connect(databaseConfig.auth).then(function(result){
					assert.equal(result,"Already connected to mongo");
					done();
				});
			});
		});
		it('should error on db error', function(done){
			mongoConnect.restore();
			mongoConnect = sinon.stub(mongoClient,"connect").returns(Promise.reject("database error"));
			db.connect(databaseConfig.auth).then(function(result){
				console.log(result)
			},function(err){
				assert.equal(err,"database error");
				done();
			});
		});
	});
	describe('db()', function(){
		it('should return null from state before connect', function(done){
			db.db().then(function(storedb){
				assert.deepEqual(storedb,{db:null});
				done();
			})
		});
		it('should return stored db from state after connect', function(done){
			db.connect(databaseConfig.auth).then(function(result){
				db.db().then(function(storedb){
					assert(storedb.db.close);
					assert(storedb.db.collection);
					done();
				});
			});
		});
	});
	describe('close()', function(){
		it('should close the open connection and reset the db on state to null', function(done){
			db.connect(databaseConfig.auth).then(function(result){
				db.close().then(function(result){
					assert.equal(result,"Successfully closed connection");
					db.db().then(function(storedb){
						assert.deepEqual(storedb,{db:null});
						done();
					})
				});
			});
		});
		it('should not attempt to close when null db is set on state', function(done){
			db.close().then(function(result){
				assert.equal(result,"Mongo connection already closed");
				done();
			});
		});
	});
});
