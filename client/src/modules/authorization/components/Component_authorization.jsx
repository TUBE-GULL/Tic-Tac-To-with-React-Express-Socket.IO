export default function ComponentAuthorization(props) {

   return (<>
      <input
         type={props.type}
         name={props.name}
         value={props.value}
         onChange={props.onChange}
         placeholder={props.placeholder}
         className={props.className}
         maxLength={props.maxLength}
         minLength={props.minLength}
         required
      />
   </>
   )
};