var nedb = require('nedb');
var uploaddb = new nedb({ filename: 'database/uploads.db', autoload: true, timestampData: true});


var uploads = {}

uploads.addOne = function(upload,callback) {
        uploaddb.insert(upload,callback);
};

uploads.getAll = function(callback) {
        userdb.find({},callback);
};
/*
userdb.insert({
	username: 'admin',
	password: '$2a$10$mezuz2V0bfHkfoluo9wP8.hgW11ticqhUC8l.3651zSa1uxwWRwb6' });*/





module.exports = uploads;
