module.exports = function() {
  var element = document.createElement('h1');

  element.className = 'pure-button';
  element.innerHTML = 'Hello World!';

  const fn = () => 'stuff';
  console.log(fn());

  return element;
};
