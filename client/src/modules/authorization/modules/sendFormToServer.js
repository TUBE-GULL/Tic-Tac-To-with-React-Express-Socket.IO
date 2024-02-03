const sendFormToServer = async (formData, post) => {
   try {
      const response = await fetch(`${post}`, {
         method: 'POST',
         headers: defaultHeaders,
         body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (post === '/api/submit_singIn') {
         setCookie('authToken', result.token, { path: '/' });

         if (result.error) {
            showTemporaryNotice('Internal Server Error', 5000);
         } else {
            // const socket = io('http://localhost:8080', { cors: { origin: "*", methods: ["GET", "POST"] } });
            // socket.emit('singIn', formData);

            setSocketFormData(formData);
            setShowAuthorization(!showAuthorization);
         }
      } else {
         if (result.error) {
            showTemporaryNotice('Failed to log in', 5000);
         } else {
            showTemporaryNotice('authorization was successful', 5000);
            setRegistering(!Registering);
         }
      }
   } catch (error) {
      console.log(error.message);
      showTemporaryNotice('An error occurred while sending data', 5000);
   }
};
