module.exports ={
	findAll: function (req, res) {
		Category.find()
			.populate('posts')
			.populate('users')
			.then(_categories => {
				//console.log(_categories);
				if (!_categories || _categories.length === 0) {
					throw new Error('No category found');
				}
				return res.ok(_categories);
			})
			.catch(err => res.serverError(err));
	},
};