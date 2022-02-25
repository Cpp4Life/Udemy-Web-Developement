const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB');

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articlesSchema);

module.exports = { articlesSchema, Article }