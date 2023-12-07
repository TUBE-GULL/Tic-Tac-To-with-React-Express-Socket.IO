



console.time('timer_for')
for (let i = 0; i < 10000; i++) {

}
console.timeEnd('timer_for')

console.time('timer_while')
let i = 0;
while (i < 10000) {
   i++

}
console.timeEnd('timer_while')
