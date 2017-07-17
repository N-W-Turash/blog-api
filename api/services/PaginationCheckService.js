module.exports = {
	checkNext: function(count, limit, page){
		return (count - limit * page) <= 0 ? null : (page+1);
	},
	checkPrevious: function(page){
		return (page-1 <= 0) ? null : (page-1);
	}
};