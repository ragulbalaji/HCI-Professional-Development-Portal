


var users = {}

users.login = function(user, pass, callback) {
	if(user == 'admin' && pass == 'admin')
	{
		callback(null, {username: user, id: 'abcdefg' });
	}
	else
	{
		callback(null, false, {message: 'Incorrect'});
	}
};

users.getById = function(id, callback) {
	callback(null, {username: 'admin', id: 'abcdefg' });
};







module.exports = users;
