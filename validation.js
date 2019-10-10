const PEOPLE_TYPES = ['Administration', 'Teacher', 'Student'];
const GENDER = ['M', 'F'];

function isValidDate(s) {
  var bits = s.split('/');
  var d = new Date(bits[2], bits[1] - 1, bits[0]);
  return d && (d.getMonth() + 1) == bits[1];
}

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePersonName(name) {
  if (typeof name !== 'string') throw new Error('Invalid name property. Name must be a non empty string');
}

function vaildatePersonEmail(email) {
  if (typeof email !== 'string' || !isValidEmail(email)) throw new Error('Invalid email property.');
}

function validatePersonBirthdate(birthdate) {
  if (!birthdate || !isValidDate(birthdate)) throw new Error('Invalid birthdate property. Must be in a non empty string in the format of MM/DD/YYYY');
}

function validatePersonSex(sex) {
  if (typeof sex !== 'string' || !GENDER.includes(sex)) throw new Error(`Invalid sex property. Must be a non empty string and one of: ${GENDER}`);
}

function validatePersonType(type) {
  if (!type || !PEOPLE_TYPES.includes(type)) throw new Error(`Invalid type property. Must be a non empty string and one of: ${PEOPLE_TYPES}`);
}

function validateNewPerson(person) {
  if (!person || typeof person !== 'object') throw new Error('Expected person instantianion to be passed an object');
  validatePersonName(person.first_name);
  validatePersonName(person.last_name);
  vaildatePersonEmail(person.email);
  validatePersonBirthdate(person.birthdate);
  validatePersonSex(person.sex);
  validatePersonType(person.type);
  return true;
}

function validateExistingPerson(person) {
  if (!person || typeof person !== 'object') throw new Error('Expected person instantianion to be passed an object');
  if (person.first_name) validatePersonName(person.first_name);
  if (person.last_name) validatePersonName(person.last_name);
  if (person.email) vaildatePersonEmail(person.email);
  if (person.birthdate) validatePersonBirthdate(person.birthdate);
  if (person.sex) validatePersonSex(person.sex);
  if (person.type) validatePersonType(person.type);
  return true;
}

module.exports = {
  validateNewPerson,
  validateExistingPerson
};
