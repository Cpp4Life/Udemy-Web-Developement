const express = require('express');
const ejs = require('ejs');
const controller = require('./controller/articleController')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.route('/articles')
    .get(controller.get)
    .post(controller.post)
    .delete(controller.delete);

app.route('/articles/:articleTitle')
    .get(controller.getArticle)
    .put(controller.putArticle)
    .patch(controller.patchArticle)
    .delete(controller.deleteArticle);

app.listen(3000, () => console.log('Server running on port 3000'));

