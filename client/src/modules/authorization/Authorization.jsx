import './Authorization.scss';
import React, { useState } from "react"
import ComponentAuthorization from './components/Component_authorization'
import Notice from "../notice/Notice";

export default function Authorization() {
   const [Registering, setRegistering] = useState(true);
   const [PasswordsDoNot, setPasswordsDoNot] = useState(true);
   const [NoticeMessage, setNoticeMessage] = useState('');
   const [showNotice, setShowNotice] = useState(false);
   const [loginFormData, setLoginFormData] = useState({
      Nickname: '',
      password: '',
   });

   const [registeringFormData, setRegisteringFormData] = useState({
      Nickname: '',
      registerPassword: '',
      confirmPassword: '',
   });
   const textHTwoSignIn = ['Already have an account? ', 'Sign in '];
   const textHTwoSignUp = ['Don\'t have an account ? ', 'Register'];
   const inputArraySignIn = [{
      type: 'text',
      name: 'Nickname',
      value: loginFormData.Nickname,
      onChange: (e) => handleChange(e, 'Nickname'),
      placeholder: "Nickname:",
      maxLength: 20,
      minLength: 3
   },
   {
      type: 'password',
      name: 'password',
      value: loginFormData.password,
      onChange: (e) => handleChange(e, 'password'),
      placeholder: "Password:",
      autocomplete: "off",
      maxLength: 20,
      minLength: 3
   }];

   const inputArraySignUp = [{
      type: 'text',
      name: 'Nickname',
      value: registeringFormData.Nickname,
      onChange: (e) => handleChange(e, 'Nickname'),
      placeholder: "Nickname:",
      maxLength: 20,
      minLength: 3
   },
   {
      type: 'password',
      name: 'registerPassword',
      value: registeringFormData.registerPassword,
      onChange: (e) => handleChange(e, 'registerPassword'),
      placeholder: "Register Password:",
      className: PasswordsDoNot ? 'passwordsDoNot' : '',
      autocomplete: "off",
      maxLength: 20,
      minLength: 8
   },
   {
      type: 'password',
      name: 'confirmPassword',
      value: registeringFormData.confirmPassword,
      onChange: (e) => handleChange(e, 'confirmPassword'),
      placeholder: "Confirm Password:",
      className: PasswordsDoNot ? 'passwordsDoNot' : '',
      autocomplete: "off",
      maxLength: 20,
      minLength: 8
   }];

   const showTemporaryNotice = (message, duration = 2000) => {
      setNoticeMessage(message);
      setShowNotice(true);

      setTimeout(() => {
         setShowNotice(false);
         setNoticeMessage('');
      }, duration);
   };

   const handleToggleForm = () => {
      setRegistering(!Registering);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;

      if (Registering) {
         setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
      } else {
         setRegisteringFormData((prevData) => ({ ...prevData, [name]: value }));
      }
   };

   const checkSubmit = (object) => {
      return Object.values(object).every(value => value.trim() !== '');
   };

   const sendFormToServer = async (formData, post) => {
      try {
         const response = await fetch(`${post}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
         })
         const result = await response.json();
         if (post === '/api/submit_singIn') {

            if (result.error) {
               showTemporaryNotice('Wrong login or password', 5000);
            } else {
               const socket = io('http://localhost:8080', { cors: { origin: "*", methods: ["GET", "POST"] } });
               // socket.emit('singIn', formData);
               // setMessengerFormData(formData);
               // setShowLogin(!showLogin);
            }
            console.time('end');
         } else {

            if (result.error) {
               showTemporaryNotice('Failed to log in', 5000);
            } else {
               showTemporaryNotice('authorization was successful', 5000);
               setRegistering(!Registering);
            }
            console.time('end');

         }
      } catch (error) {
         console.log(error.message);
         showTemporaryNotice('An error occurred while sending data', 5000);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      //send data in server 
      if (Registering) {//sing in
         checkSubmit(loginFormData)//check form  to blank text
            ? await sendFormToServer(loginFormData, '/api/submit_singIn')
            : showTemporaryNotice('unfilled form ', 3000);
      } else {//sing up
         if (checkSubmit(registeringFormData)) {//check form  to blank text
            if (registeringFormData.registerPassword === registeringFormData.confirmPassword) {
               console.log(registeringFormData.registerPassword);
               console.log(registeringFormData.confirmPassword);

               const formData = {// if register confirm password true send data
                  firstName: registeringFormData.firstName,
                  lastName: registeringFormData.lastName,
                  password: registeringFormData.registerPassword,
               };
               await sendFormToServer(formData, '/api/submit_singUp');
            } else {
               showTemporaryNotice('passwords don\'t match', 3000);
               setPasswordsDoNot(!PasswordsDoNot)
            };
         } else {
            showTemporaryNotice('unfilled form', 3000);
         };
      };

      setLoginFormData({
         firstName: '',
         password: '',
      });

      setRegisteringFormData({
         firstName: '',
         lastName: '',
         registerPassword: '',
         confirmPassword: '',
      });
   };

   return (
      <div className="AuthorizationBlock">

         <div className="loginBlock">

            <form onSubmit={handleSubmit} className="loginForm">
               <div className="formInside">
                  <h1>{Registering ? 'ACCOUNT SIGN IN' : 'CREATE AN ACCOUNT'}</h1>

                  {Registering
                     ? inputArraySignIn.map((el, index) => (
                        <ComponentAuthorization key={index} {...el} />
                     ))
                     : inputArraySignUp.map((el, index) => (
                        <ComponentAuthorization key={index} {...el} />
                     ))}
                  <button type="submit">{Registering ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
               </div>

               <h2>
                  {Registering ? textHTwoSignIn[0] : textHTwoSignUp[0]}
                  <a onClick={handleToggleForm}>
                     {Registering ? textHTwoSignIn[1] : textHTwoSignUp[1]}
                  </a>
               </h2>

            </form>
         </div>
         {showNotice && <Notice message={NoticeMessage} />}

      </div>
   )
};

