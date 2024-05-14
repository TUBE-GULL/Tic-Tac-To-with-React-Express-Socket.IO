async function sendCookieToServer(post, authToken, cookies, setCookie) {
   try {
      const response = await fetch(`http://localhost:8080${post}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Cookie': `authToken=${cookies.authToken || ''}`,
         },
         body: JSON.stringify({ authToken }),
      });

      const result = await response.json();
      return result.success
   } catch (error) {
      console.log(error.message);
      return { result: false, errorMessage: 'An error occurred while sending data' }
   }
}

export default sendCookieToServer;
