var nedb = require('nedb');
var bcrypt = require('bcryptjs');
var userdb = new nedb({ filename: 'database/users.db', autoload: true, timestampData: true});


var users = {}

users.login = function(user, pass, callback) {
	users.getUser(user, function(err, docs) {
		if(err)callback(err, false);
		else
		{
			bcrypt.compare(pass , docs.password , function(err, res) {
				if(res == true)
				{
					callback(null, docs);
				}
				else
				{
					callback(null, false);
				}
			});
		}
	});
};


users.getUser = function(user,callback) {
        userdb.findOne({username: user},function(err, docs) {
                callback(err, docs);
        });
};

users.getById = function(id,callback) {
        userdb.findOne({_id: id},function(err, docs) {
                callback(err, docs);
        });
};
/*
userdb.insert({
	username: 'admin',
	password: '$2a$10$mezuz2V0bfHkfoluo9wP8.hgW11ticqhUC8l.3651zSa1uxwWRwb6' });*/





module.exports = users;
