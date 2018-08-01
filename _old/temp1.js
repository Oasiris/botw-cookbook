function fn(a = 5, b = 7) {
  console.log(a, b);
}

fn(undefined, false);

console.log(`Hello
  world!`);



let tIs = (a, b, ...fArr) => {
  console.log(`${a}, ${fArr} => ${b}`);
  // it(`${a}, ${fArr} => ${b}`)
  let out = a;
  for (let fn of fArr) {
    out = fn(out);
  }
  return out;
}

// console.log(tIs(5, 9, function(a){return a + 4}, function(a) {return "Hello world " + a}));

let func1 = (a) => a + 4;
let func2 = (a) => "Hello world " + a;

console.log(tIs(5, "Hello world 9", func1, func2));


console.log(typeof func1);
console.log(typeof [func1, func2]);