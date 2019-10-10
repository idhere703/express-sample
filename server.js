const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const { Person, NewPerson } = require('./models');
let db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
const MISSING_ID_ERROR_MESSAGE = 'Person ID parameter required.';

async function getPeople(req) {
  const searchQuery = {};
  if (req.query.filter) searchQuery.type = req.query.filter;
  if (req.query.firstName) searchQuery.first_name = req.query.firstName;
  if (req.query.lastName) searchQuery.last_name = req.query.lastName;
  const people = await db.collection('people').find(searchQuery).sort({ last_name: 1 }).toArray();
  return people;
}

async function getPerson(id) {
  if (typeof id !== 'string') throw new Error('Expected id to be of type: String');
  const person = await db.collection('people').findOne({ _id: ObjectId(id) });
  return person;
}

async function createPerson(person) {
  const createdPerson = await db.collection('people').save(person);
  return createdPerson;
}

async function updatePerson(person, personId) {
  const updatedPerson = await db.collection('people').updateOne({ _id: ObjectId(personId) }, { $set: person });
  return updatedPerson;
}

async function deletePerson(personId) {
  const deleteResponse = await db.collection('people').deleteOne({ _id: ObjectId(personId) });
  return deleteResponse;
}

/**
  * @desc Get's a list of all people currently in the database.
  * @param string filter - An optional query parameter for filtering based on type.
  * @param string firstName - An optional query parameter for searching based on first name.
  * @param string lastName - An optional query parameter for searching based on last name.
  * @return Array - An array of JSON objects.
*/
router.get('/people', async (req, res, next) => {
  try {
    const people = await getPeople(req);
    res.json(people);
  } catch(err) {
    next(err);
  }
});

/**
  * @desc Get's a specific person from the people collection when passed a mongoid as a string.
  * @param string id - A mongodb object id as a string.
  * @return object - A JSON object of that particular person.
*/
router.get('/people/:id', async (req, res, next) => {
  if (typeof req.params.id !== 'string') return res.status(400).send(MISSING_ID_ERROR_MESSAGE);
  try {
    const person = await getPerson(req.params.id);
    res.json(person);
  } catch(err) {
    next(err);
  }
});

/**
  * @desc Creates a new person.
  * @param string req.body.first_name - A users first name.
  * @param string req.body.last_name - A users last name.
  * @param string req.body.email - A users email.
  * @param string req.body.type - One of several options as text. Case does matter.
  * @param string req.body.sex - One of several options as text. Case does matter.
  * @param string req.body.birthdate - A string passed in the format of: MM/DD/YYYY
  * @return Object - The newly created person as a JSON object.
*/
router.post('/people', async (req, res, next) => {
  let person;
  try {
    person = NewPerson(req.body);
  } catch(err) {
    return res.status(400).send(err.message);
  }

  try {
    const createdPerson = await createPerson(person);
    res.status(201).json(createdPerson.ops[0]);
  } catch(err) {
    next(err);
  }
});

/**
  * @desc Updates an existing person.
  * @param string id - A mongodb object id as a string.
  * @param string req.body.first_name - A users first name.
  * @param string req.body.last_name - A users last name.
  * @param string req.body.email - A users email.
  * @param string req.body.type - One of several options as text. Case does matter.
  * @param string req.body.sex - One of several options as text. Case does matter.
  * @param string req.body.birthdate - A string passed in the format of: MM/DD/YYYY
  * @return Object - The persons updated information as a JSON object.
*/
router.put('/people/:id', async (req, res) => {
  if (typeof req.params.id !== 'string') return res.status(400).send(MISSING_ID_ERROR_MESSAGE);
  let person;
  try {
    person = Person(req.body);
  } catch(err) {
    return res.status(400).send(err.message);
  }

  try {
    await updatePerson(person, req.params.id);
    const updatedPerson = await getPerson(req.params.id);
    res.json(updatedPerson);
  } catch(err) {
    next(err);
  }
});

/**
  * @desc Deletes and existing person.
  * @param string id - A mongodb object id as a string.
  * @return null
*/
router.delete('/people/:id', async (req, res, next) => {
  if (typeof req.params.id !== 'string') return res.status(400).send(MISSING_ID_ERROR_MESSAGE);
  try {
    await deletePerson(req.params.id);
    res.status(204).send();
  } catch(err) {
    next(err);
  }
});

router.use(function (req, res) {
  res.status(404).send('Route not found!');
});

app.use('/api', router);

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  db = client.db('rhinoexpress');
  app.listen(port, () => console.log(`Rhino Express listening on port ${port}!`))
});
