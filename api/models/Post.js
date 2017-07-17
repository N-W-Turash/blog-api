module.exports = {
	tableName:"posts",
	attributes:
		{
			title :
				{ type: 'string',
					required:true
				},
			content :
				{ type: 'longtext',
					required:true
				},
			//Associations
			category :
				{
					model :'category',
					columnName:'category_id',
					required:true
				},
			user :
				{
					model :'user',
					columnName:'user_id',
					required:true
				}
		}
};