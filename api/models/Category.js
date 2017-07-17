module.exports = {
	tableName:'categories',
	attributes:
	{
		name : { type: 'string', unique: true, required: true },
		posts: {
			collection:'post',
			via:'category'
		},
		users: {
			collection: 'user',
			via: 'category'
		}
	}
};