import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';



firebase.initializeApp(firebaseConfig);

function App() {
// sign in er jonno state declare kora hoice
  const [newUser, setNewUser] = useState(false);

  // sign up er jonno state declare kora hoice
  const [user, setUser] = useState({
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success:false
  })

        // STEP-2

  const handleBlur = (e) => {
    // console.log(e.target.name, e.target.value);
    let isFieldValid = true;
    if (e.target.name === 'email') {
      // e.target.value dile email ta pabo
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      
      
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      // e.target.value dile password ta pabo
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    // email and password sudhu valid holei jno show kore tai ata kora hoice
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
      
    }
  }

    //  STEP-3
// sign up er jonno....
  const handleSubmit=(e)=>{
    console.log(user.email, user.email);

      if (newUser && user.email && user.password) {
        
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        // new email diye sign up korar somoy browser er error msg ta jno chole jay tai ata kora hoice
        const newUserInfo = {...user};
        newUserInfo.error = '';
        // new email hole success dekhabe and error hide thkbe
        newUserInfo.success = true;
        setUser(newUserInfo)

        updateUserName(user.name)

      })
      .catch(error => {
        // browser a error message ta dekhanor jonno custom vabe aivabe kora hoice..
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        // new email na hole success hide thkbe and error show  korbe
        newUserInfo.success = false;
        setUser(newUserInfo)


        // var errorCode = error.code;
        // var errorMessage = error.message;
        // console.log(errorCode, errorMessage);
        // ..
      });
    }
      
  // newUser na hole r baki 2 ta thkle taile sign In hobe
      if (!newUser && user.email && user.password) {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
          newUserInfo.error = '';
          // new email hole success dekhabe and error hide thkbe
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign un user name' , res.user);
      })
      .catch((error) => {
          const newUserInfo = {...user}
          newUserInfo.error = error.message;
          // new email na hole success hide thkbe and error show  korbe
          newUserInfo.success = false;
          setUser(newUserInfo)
      });
      
    }
      
   


// aita na dile bar bar console a refresh nibe tai aita first ei deya vlo
    e.preventDefault();
  }


  const updateUserName = name => {
        const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
     
    }).then(() => {
      console.log('user name update succesfully');
    }).catch((error) => {
      console.log(error);
    });  
  }


  return (
    <div className="App">

       {/* STEP -1 */}

     <h1>Our Authentication</h1>
     {/* email and password valid hole show kore kina setai check kora hoice  */}
     {/* <p>Email: {user.email}</p>
     <p>Password: {user.password}</p> */}

        {/* sign up er jonno */}
      <input type="checkbox" name="newUser" onChange={()=> setNewUser(!newUser)} id="" />
      <label htmlFor="newUser">New User Sign Up</label>


     <form onSubmit={handleSubmit} >
       {/* sign up er jonno notun kore dynamic kora hoice */}
       { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter Your Name"  />}
      <br />
       <input type="text" name="email" onBlur={handleBlur} placeholder="enter your email" required/>
       <br />
       <input type="password" name="password" onBlur={handleBlur} placeholder="enter your password" required/>
       <br />
       <input onclick="handleButton" type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />

     </form>


      {/* error message ta show koranor jonno ata deya hoice...same email diye account korte gele error message ta form er niche dekhabe */}
     <p style={{color:'red'}}>{user.error}</p>

     {/* success message ta show koranor jonno ata kora hoice */}
     {
     user.success && <p style={{color:'green'}}>user {newUser ? 'created' : 'Loged In' } successfully</p>
     }
    </div>
  );
}

export default App;
