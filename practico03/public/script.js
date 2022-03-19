async function load(url) {
  let obj = await (await fetch(url)).json();
  console.log(obj)
  var preElements = document.getElementsByTagName('pre');
  preElements[0].innerHTML = JSON.stringify(obj,null,2);
}