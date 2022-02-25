const express = require('express');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', itemsSchema);

const something = new Item({
    name: 'Something'
});

const morething = new Item({
    name: 'More-thing'
});

const anything = new Item({
    name: 'Anything'
});

const defaultItems = [something, morething, anything];

const listSchema = new mongoose.Schema({
    listTitle: String,
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
    const day = date.getDate();
    Item.find((err, foundItems) => {
        if (err)
            console.log(err);
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, err => {
                if (err)
                    console.log(err);
                else
                    console.log('Success');
            });
            res.redirect('/');
        } else
            res.render('list', { listTitle: day, newListItems: foundItems });
    });
});

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ listTitle: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const listEntity = new List({
                    listTitle: customListName,
                    items: defaultItems
                });
                listEntity.save();
                res.redirect('/' + customListName);
            } else {
                res.render('list', { listTitle: foundList.listTitle, newListItems: foundList.items });
            }
        }
    });

})

app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    console.log(req.body);
    const item = new Item({
        name: itemName
    });

    if (listName === date.getDate()) {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ listTitle: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }
})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        Item.findByIdAndRemove(checkedItemId, err => {
            if (!err)
                res.redirect('/');
        });
    } else {
        List.findOneAndUpdate({ listTitle: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        });
    }
})

app.get('/work', (req, res) => {
    res.render('list', { listTitle: 'Work List', newListItems: workItems });
})

app.listen(3100, () => console.log('server running on port 3000'));