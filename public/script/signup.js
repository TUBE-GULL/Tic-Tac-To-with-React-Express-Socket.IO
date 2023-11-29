const myForm = document.getElementById('form');

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
         window.location.href = "/users";
      }
   } catch (error) {
      alert(error.message || 'Произошла ошибка при отправке данных');
   }

}

