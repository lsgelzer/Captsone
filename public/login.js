function Login(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState(''); 
  const [user, setUser] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      user={user}
      isLoggedIn={isLoggedIn}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus} setUser={setUser}  user={user} setIsLoggedIn={setIsLoggedIn} />}
    />
  ) 
}

function LoginMsg(props){
  return(<>
    <h5>Success {props.user}</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Authenticate again
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  
  
  function handle() {
    const url = 'http://localhost:4000/login'
    const loginInfo = { email: "", password: "" };
    loginInfo.email = email;
    loginInfo.password = password;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        
      },
      body: JSON.stringify(loginInfo),
    }
  
    fetch(url, requestOptions)
    .then(response => response.text())
    .then(text => {
      try {
            const data = JSON.parse(text);
            props.setStatus('Welcome '+ data.userName);
            props.setShow(false);
            localStorage.setItem('token', data.refreshToken)
            localStorage.setItem('email', data.email)
            props.setUser(data.userName);
            props.setIsLoggedIn(true);
            console.log('JSON:', data);
        } catch(err) {
            props.setStatus(text)
            console.log('err:', text);
        }
      
    });
  }


  return (<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </>);
}