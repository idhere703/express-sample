const { validateNewPerson, validateExistingPerson } = require('./validation');

function NewPerson(personObj) {
  validateNewPerson(personObj);
  return {
    first_name: personObj.first_name,
    last_name: personObj.last_name,
    sex: personObj.sex,
    email: personObj.email,
    type: personObj.type,
    birthdate: new Date(personObj.birthdate)
  };
}

function Person(personObj) {
  validateExistingPerson(personObj);
  const person = {};
  if (personObj.first_name) person.first_name = personObj.first_name;
  if (personObj.last_name) person.last_name = personObj.last_name;
  if (personObj.email) person.email = personObj.email;
  if (personObj.birthdate) person.birthdate = new Date(personObj.birthdate);
  if (personObj.sex) person.sex = personObj.sex;
  if (personObj.type) person.type = personObj.type;
  return person;
}

module.exports = {
  NewPerson,
  Person
};