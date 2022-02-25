const model = require('../model/article');

const Article = model.Article;

exports.get = (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err)
            res.send(foundArticles);
        else
            res.send(err);
    });
}

exports.post = (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(err => {
        if (!err)
            res.send('Successfully added a new article');
        else
            res.send(err);
    });
}

exports.delete = (req, res) => {
    Article.deleteMany({}, err => {
        if (!err)
            res.send('Successfully deleted all articles');
        else
            res.send(err);
    });
}

exports.getArticle = (req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
        if (foundArticle)
            res.send(foundArticle);
        else
            res.send('No matching articles found!');
    });
}

exports.putArticle = (req, res) => {
    Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        err => {
            if (!err)
                res.send('Successfully updated article');
            else
                res.send(err);
        }
    );
}

exports.patchArticle = (req, res) => {
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body },
        err => {
            if (!err)
                res.send('Successfully updated article');
            else
                res.send(err);
        }
    );
}

exports.deleteArticle = (req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, err => {
        if (!err)
            res.send('Successfully deleted the corresponding article');
        else
            res.send('Failed to delete');
    });
}