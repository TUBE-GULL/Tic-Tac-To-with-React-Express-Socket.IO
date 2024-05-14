import { useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

//modules
import { inputArraySignIn, inputArraySignUp } from '../modules/inputArray';
import ComponentAuthorization from '../components/Component_authorization';
import sendFormToServer from '../modules/sendFormToServer';
import sendCookieToServer from '../modules/sendCookieToServer';
import Notice from '../components/notice/Notice';
import { EntranceLobby } from '../../../App';

function AuthorizationController() {
   const { showAuthorization, setShowAuthorization, setSocketFormData } = useContext(EntranceLobby);
   const [passwordsDoNot, setPasswordsDoNot] = useState(false);
   const [NoticeMessage, setNoticeMessage] = useState('');
   const [registering, setRegistering] = useState(true);
   const [showNotice, setShowNotice] = useState(false);
   const [cookies, setCookie] = useCookies(['authToken']);
   const textSignIn = ['Sign in ', 'ACCOUNT SIGN IN', 'Already have an account? ', 'SIGN IN'];
   const textSignUp = ['Register', 'CREATE AN ACCOUNT', 'Don\'t have an account ? ', 'CREATE ACCOUNT'];

   useEffect(() => {
      const fetchData = async () => {
         const authToken = cookies.authToken;
         if (authToken) {
            try {
               const result = await sendCookieToServer('/submit_singIn', authToken, cookies, setCookie);
               if (result) {
                  setShowAuthorization(!showAuthorization);
               } else {
                  console.log('The token has expired or there is no token');
                  document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
               }
            } catch (error) {
               console.error('An error occurred:', error);
            }
         }
      };

      fetchData();
   }, []);


   const [loginFormData, setLoginFormData] = useState({
      Nickname: '',
      password: '',
   });
   const [registeringFormData, setRegisteringFormData] = useState({
      Nickname: '',
      registerPassword: '',
      confirmPassword: '',
   });

   const showTemporaryNotice = (message, duration = 2000) => {
      setNoticeMessage(message);
      setShowNotice(true);

      setTimeout(() => {
         setShowNotice(false);
         setNoticeMessage('');
      }, duration);
   };

   const handleToggleForm = () => {
      setRegistering(!registering);
      setPasswordsDoNot(false);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;

      if (registering) {
         setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
      } else {
         setRegisteringFormData((prevData) => ({ ...prevData, [name]: value }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      // check form 
      if (registering) {//sing in
         const result = await sendFormToServer('/submit_singIn', loginFormData, cookies, setCookie)
         if (result.result) {
            setSocketFormData(loginFormData);
            setShowAuthorization(!showAuthorization);
         } else {
            showTemporaryNotice(result.errorMessage, 3000);
         }
      } else {//sing up
         if (registeringFormData.registerPassword === registeringFormData.confirmPassword) {
            const formData = {
               Nickname: registeringFormData.Nickname,
               password: registeringFormData.registerPassword
            };
            // newSocket.emit('sendMessage', formData)
            const result = await sendFormToServer('/submit_singUp', formData, cookies, setCookie);

            console.log(result)
            if (result.result) {
               showTemporaryNotice(result.errorMessage, 3000);
               setPasswordsDoNot(false);
               setRegistering(!registering);
            } else {
               showTemporaryNotice(result.errorMessage, 3000);
            }
         } else {//never password 
            showTemporaryNotice('passwords don\'t match', 3000);
            setPasswordsDoNot(true)
         }
      }

      //Input cleaning
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

   return (
      <div className="loginBlock">

         {showNotice && <Notice message={NoticeMessage} />}

         <form onSubmit={handleSubmit} className="loginForm">
            <div className="formInside">
               <h1>{registering ? textSignIn[1] : textSignUp[1]}</h1>

               {registering
                  ? inputArraySignIn(loginFormData, handleChange).map((el, index) => <ComponentAuthorization key={index} {...el} />)
                  : inputArraySignUp(registeringFormData, handleChange, passwordsDoNot).map((el, index) => <ComponentAuthorization key={index} {...el} />)
               }
               <button type="submit">{registering ? textSignIn[3] : textSignUp[3]}</button>
            </div>

            <h2>
               {registering ? textSignIn[2] : textSignUp[2]}
               <a onClick={handleToggleForm}>
                  {registering ? textSignUp[0] : textSignIn[0]}
               </a>
            </h2>

         </form>
      </div>
   )
}

export default AuthorizationController
