module.exports = {
	tableName: 'users',
	attributes:
		{
			first_name :
				{
					type: 'string',
					required: true
				},
			last_name :
				{
					type: 'string',
					required:true
				},
			age :
				{
					type : 'integer'
				},
			posts:
				{
					collection: 'post',
					via:'user'
				},
			category :
				{
					model :'category',
					columnName:'category_id',
					required:true
				},
		}
};
