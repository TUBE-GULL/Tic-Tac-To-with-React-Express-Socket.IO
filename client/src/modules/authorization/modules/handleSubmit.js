async function handleSubmit(e) {
   e.preventDefault();
   //send data in server 
   if (Registering) {//sing in
      await sendFormToServer(loginFormData, '/api/submit_singIn')
   } else {//sing up
      if (registeringFormData.registerPassword === registeringFormData.confirmPassword) {
         const formData = {// if register confirm password true send data
            Nickname: registeringFormData.Nickname,
            password: registeringFormData.registerPassword,
         };
         await sendFormToServer(formData, '/api/submit_singUp');
      } else {
         showTemporaryNotice('passwords don\'t match', 3000);
         setPasswordsDoNot(false)
      };
   };

   setPasswordsDoNot(!PasswordsDoNot)
   setLoginFormData({
      Nickname: '',
      password: '',
   });

   setRegisteringFormData({
      Nickname: '',
      registerPassword: '',
      confirmPassword: '',
   });
};

export default handleSubmit 