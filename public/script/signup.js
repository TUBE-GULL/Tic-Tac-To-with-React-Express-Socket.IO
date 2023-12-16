// const bcrypt = require('bcrypt');
const myForm = document.getElementById('form');

// myForm.addEventListener('submit', async (event) => {
//    event.preventDefault();

//    const formData = new FormData(myForm);
//    const name = formData.get('name');
//    const password = formData.get('password');
//    try {
//       const saltRounds = 10
//       const salt = bcrypt.genSaltSync(saltRounds)
//       const hashedPassword = await bcrypt.hash(password, salt)

//       registrationForm({ name, hashedPassword });
//    } catch {
//       console.error(error)
//       alert('Error hashing password')
//    }
// });

myForm.addEventListener('submit', (event) => {
   event.preventDefault();

   const formData = new FormData(myForm);
   const name = formData.get('name');
   const password = formData.get('password');

   registrationForm({ name, password });
});

const registrationForm = async (formData) => {
   try {
      const response = await fetch('/submit_singup', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
      })

      const result = await response.json();

      if (result.error) {
         throw new Error(result.error);
      } else {
         window.location.href = "/singin";
      }
   } catch (error) {
      alert(error.message || 'Произошла ошибка при отправке данных');
   }

}

