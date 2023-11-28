const myForm = document.getElementById('form');

myForm.addEventListener('submit', (event) => {
   event.preventDefault();

   const formData = new FormData(myForm);
   const name = formData.get('name');
   const password = formData.get('password');
   const registration = formData.get('registration')


   console.log(registration)
   registrationForm({ name, password, registration });
});

const registrationForm = async (formData) => {
   try {
      const response = await fetch('/submit', {
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
         window.location.href = "./users.html";
      }
   } catch (error) {
      alert(error.message || 'Произошла ошибка при отправке данных');
   }

}