export default function ComponentAuthorization(props) {

   return (<>
      <input
         type={props.type}
         name={props.name}
         value={props.value}
         onChange={props.onChange}
         placeholder={props.placeholder}
         // className={!checkSubmit(loginFormData) && !loginFormData.firstName.trim() ? style.error : ''}
         maxLength={props.maxLength}
         minLength={props.minLength}
         required
      />
   </>
   )
};