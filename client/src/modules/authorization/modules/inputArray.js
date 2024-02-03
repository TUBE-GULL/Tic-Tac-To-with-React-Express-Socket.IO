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
   placeholder: PasswordsDoNot ? 'passwords don\'t match' : "Register Password:",
   className: PasswordsDoNot ? 'passwordsDoNot' : '',
   autocomplete: "off",
   maxLength: 20,
   minLength: 3
},
{
   type: 'password',
   name: 'confirmPassword',
   value: registeringFormData.confirmPassword,
   onChange: (e) => handleChange(e, 'confirmPassword'),
   placeholder: PasswordsDoNot ? 'passwords don\'t match' : "Confirm Password:",
   className: PasswordsDoNot ? 'passwordsDoNot' : '',
   autocomplete: "off",
   maxLength: 20,
   minLength: 3
}];


export default { inputArraySignIn, inputArraySignUp }