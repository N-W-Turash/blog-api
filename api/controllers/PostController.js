/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	paginationCheck: function(){

	},

  /**
   * `PostController.create()`
   */
	create: function (req, res) {

		let title = req.param('title'),
		content = req.param('content'),
		userId = req.param('user_id'),
		categoryName = req.param('category_name');

		if (!title) return res.badRequest({err: 'Invalid post title field'});
		if (!content) return res.badRequest({ err: 'Invalid post content field'});
		if (!userId) return res.badRequest({ err: 'Invalid user_id field'});
		if (!categoryName) return res.badRequest({ err: 'Invalid category_name field'});

		Category.findOrCreate({ name: categoryName })
			.then(_category => {
				if (!_category) throw new Error('Unable to create category record');
				return _category;
			})
			.then(_category => {
				return Post.create({
					title,
					content,
					user: userId,
					category: _category.id
				});
			})
			.then(_post => {
			  //console.log(_post);
				if (!_post) throw new Error('Unable to create new post');
				return res.ok(_post);
			})
			.catch(err => res.serverError(err.message));
	},


  /**
   * `PostController.findAll()`
   */
	findAll: function (req, res) {
		Post.count()
			.then(postsCount => {
				if (postsCount === 0) {
					throw new Error('No post found.');
				}

				const limit = 3;
				const page = Number(req.params('page')) || 1;

				Post.find()
					.paginate({page: page, limit: limit})
					.then(posts => {
						if (!posts || posts.length === 0) {
							throw new Error('No post found.');
						}
						return res.ok(
							{
								posts,
								count: postsCount,
								currentPage: page,
								nextPage: PaginationCheckService.checkNext(postsCount, limit, page),
								previousPage: PaginationCheckService.checkPrevious(page)
							});
					})
					.catch(err => res.serverError(err));

			});
	},

  /**
   * `PostController.findOne()`
   */
	findOne: function (req, res) {
		let postId = req.params.id;
		if (!postId) return res.badRequest({ err: 'missing post_id field' });

		Post.findOne({ id: postId })
			.populate('category')
			.populate('user')
			.then(_post => {
				if (!_post) return res.notFound({ err: 'No post found' });
				return res.ok(_post);
			})
			.catch(err => res.serverError(err));
	},

  /**
   * `PostController.delete()`
   */
	delete: function (req, res) {
		let postId = req.params.id;
		if (!postId) return res.badRequest({ err: 'missing post_id field'});

		Post.destroy({ id: postId })
			.then(_post => {
				if (!_post || _post.length === 0) return res.notFound({ err: 'No post found in our record' });
				return res.ok({msg:`Post is deleted with id ${postId}`});
			})
			.catch(err => res.serverError(err));
	},

  /**
   * `PostController.update()`
   */
	update: function (req, res) {

		let title = req.param('title'),
        content = req.param('content'),
        userId = req.param('user_id'),
        categoryId = req.param('category_id'),
		    postId = req.params.id;

		if (!postId) return res.badRequest({ err: 'post id is missing' });

		let post = {};
		if (title) {
			post.title = title;
		}
		if (content) {
			post.content = content;
		}
		if (userId) {
			post.user = userId;
		}
		if (categoryId) {
			post.category = categoryId
		}
		Post.update({ id: postId }, post)
			.then(_post => {
				if (!_post[0] || _post[0].length === 0) return res.notFound({ err: 'No post found' });
				return res.ok(_post[0]);
			}).catch(err => res.serverError(err));
	},

	search: function (req, res) {
		Post.count(
		{
			or : [
				{title: { contains: req.param('searchText')}},
				{content: { contains: req.param('searchText') }},
			],
		})
		.then(postsCount => {
			if (postsCount === 0) {
				throw new Error('No post found for this search.');
			}

			const limit = 3;
			const page = Number(req.param('page')) || 1;

			Post.find(
				{
					or : [
						{title: { contains: req.param('searchText')}},
						{content: { contains: req.param('searchText') }},
					]
				}
			)
			.paginate({page: page, limit: limit})
			.then(posts => {
				if (!posts || posts.length === 0) {
					throw new Error('No post found for this search.');
				}
				return res.ok(
					{
						posts,
						count: postsCount,
						currentPage: page,
						nextPage: PaginationCheckService.checkNext(postsCount, limit, page),
						previousPage: PaginationCheckService.checkPrevious(page)
					});
			})
			.catch(err => res.serverError(err));

		});
	},
};

