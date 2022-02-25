const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main () {
    await mongoose.connect('mongodb://localhost:27017/fruitsDB');
}

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please check your data entry, no name specified']
    },
    rating: {
        type: Number,
        max: 10,
        min: 1
    },
    review: String
});

const Fruit = mongoose.model('Fruit', fruitSchema);

const fruitInstance = new Fruit({
    name: 'Banana',
    rating: 7.5,
    review: 'Smooth fruit'
});

// fruitInstance.save();

// const strawberry = new Fruit({
//     name: 'Strawberry',
//     rating: 7.0,
//     review: 'Loving taste'
// });

const peach = new Fruit({
    name: 'Peach',
    rating: 9.5,
    review: 'Ohh so sweet'
})

// Fruit.insertMany([strawberry, peach], err => { });

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteFruit: fruitSchema
});

const Person = mongoose.model('Person', personSchema);

// const person1 = new Person({
//     name: 'Daniel',
//     age: 19
// });

// person1.save();

Person.updateOne({ name: 'Daniel' }, { favoriteFruit: peach }, err => {
    if (err)
        console.log(err);
    else {
        console.log('Successfully updated the document');
    }
});

Fruit.find((err, fruits) => {
    if (err)
        console.log(err)
    else {
        // mongoose.connection.close();
        fruits.forEach(element => {
            console.log(element.name);
        });
    }
})

// Fruit.updateOne({ _id: "61a19e14ea759fce153315a6" }, { rating: 8.5 }, err => {
//     if (err)
//         console.log(err);
//     else {
//         mongoose.connection.close();
//         console.log('Successfully updated the document');
//     }
// });

// Fruit.deleteOne({ name: 'Strawberry' }, err => {
//     if (err)
//         console.log(err);
//     else {
//         mongoose.connection.close();
//         console.log('Successfully deleted the document');
//     }
// });
