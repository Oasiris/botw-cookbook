// // NOTE: THIS IS NOT FINAL. DON'T RUN THIS



// const materials = require('./materialsRaw.json');

// let out = [];

// for (let m of materials) {
//   m.idx = Number(m.idx);
//   m.price = Number(m.price);

//   // Delete unneeded properties
//   delete m.effect2;
//   delete m.duration;
//   delete m.type0;



//   for (let key in m) {
//     if (m[key] == '–') {
//       m[key] = null;
//     }
//     const numericProperties = ['price_mon', 'crit_chance', 'potency'];
//     numericProperties.forEach((ele, i) => {
//       if (m[ele]) {
//         m[ele] = Number(m[ele]);
//       }
//     });
//   }


//   if (m.hp && String(m.hp).slice(m.hp.length - 2, m.hp.length) == "**") {
//     m.hp = Number(m.hp.slice(0, m.hp.length - 2));
//     // console.log(m);
//   }

//   // Assigns cooked/uncooked food stuff
//   if (m.name == 'Silent Princess') {
//     m.hp = 8;
//     m.hp_raw = 0;
//   } else if (m.hp && String(m.hp).slice(m.hp.length - 1, m.hp.length) == "*") {
//     m.hp = Number(m.hp.slice(0, m.hp.length - 1));
//     m.hp_raw = 0;
//   } else {
//     m.hp_raw = Number(m.hp);
//     m.hp = Number(m.hp) * 2;
//   }

//   // Splits m.families into array
//   m.families = m.families.split(', ');

//   out.push(m);
// }



// console.log(JSON.stringify(out));