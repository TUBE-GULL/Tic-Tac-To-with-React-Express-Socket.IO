class Logger {

   constructor() { }

   data(): string {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
   };

   log(text: unknown, ...texts: (string | number)[]): void {
      console.log(`${this.data()} \x1b[4m INFO/\x1b[0m: ➜ \x1b[4m${text}\x1b[0m`);


      for (const text of texts) {
         console.log(`${this.data()} \x1b[4m INFO/\x1b[0m: ➜ \x1b[4m${text}\x1b[0m`);
      }
   };

   error(error: unknown[]) {
      this.data()
      console.error(`${this.data()} \x1b[31m ERROR/\x1b[0m : ➜  ${error}`);
   };
}

export default Logger;


// function logger(text: unknown, ...texts: (string | number)[]): void {
//    console.log(` ➜ \x1b[4m${text}/\x1b[0m`);

//    for (const text of texts) {
//       console.log(` ➜ \x1b[4${text}/\x1b[0m`);
//    }
// };
