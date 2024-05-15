async function sendFormToServer(post, formData, cookies, setCookie) {
   try {
      const response = await fetch(`${post}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.authToken}`
         },
         body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (post === '/submit_singIn') {

         return result.error
            ? { result: false, errorMessage: 'Wrong login or password !' }
            : { result: true, errorMessage: 'Successful authentication', userData: result.userData }

      } else {
         return result.error
            ? { result: false, errorMessage: 'Failed to log in' }
            : { result: true, errorMessage: 'Authorization was successful' };
      }
   } catch (error) {
      console.log(error.message);
      return { result: false, errorMessage: 'An error occurred while sending data' }
   }
}

export default sendFormToServer
