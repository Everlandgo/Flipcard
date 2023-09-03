import React, { useState } from 'react';
import { View, TextInput, StyleSheet ,Text, TouchableOpacity} from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { firebase_auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

export function Signuppage({ navigation}) {
  const auth = firebase_auth;

  // State variables to store user email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // A function to sign the user up using Firebase authentication and navigate user to homepage 
  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful: WELCOME TO FLIPCARD");
      navigation.navigate('Homepage');
    } catch (error) {
      console.log(error);
      alert('Registration Unsuccessful: Please provide a valid email address');
    }
  };

  return (
  <View style={styles.container}>
      <LinearGradient
      colors={['#c5f5dd','#99c0fa']}
      style={styles.background}
      />
      <View style={styles.signContainer}>
      <View style={styles.signtxtcon}>
          <Text style={styles.signtxt}>SIGN UP</Text>
      </View>
      <View style={styles.logcontainer}>   
          <View style={styles.txtcon}>
              <Text style={styles.headingsty}>Email</Text>  
          </View>
          <View style={styles.inputcon}>           
              <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={'Email'}
              style={styles.input}
              />
          </View>

          <View style={styles.txtcon}>
              <Text style={styles.headingsty}>Password</Text>  
          </View>
          <View style={styles.inputcon}>           
          <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={'Password'}
              secureTextEntry={true}
              style={styles.input}
          />
          </View>
          <View style={styles.inputcon}>           
              <TouchableOpacity style={styles.signbtn} onPress={signUp}>
                  <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>
          </View>        
          </View> 
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  signContainer:{
    width:'80%',
    height:'55%',
    backgroundColor:'#FFFFFF',
    borderRadius:20, 
    shadowOpacity:0.3, 
    borderRadius:20
  },
  signtxtcon:{
    alignItems: 'left',
    justifyContent: 'left',
    padding:20,
    marginLeft:5
  },
  signtxt:{
    fontSize:50, 
    color:'#80c8db', 
    fontWeight:'600',
  },
  logcontainer:{
    position: 'absolute',
    width: '100%',
    top:100,
  },
  txtcon:{
    alignContent:'left',
    alignItems:'left',
    justifyContent:'left',
    marginLeft:50, 
    paddingTop:10,
  },
  input: {
    width: 270,
    height: 50,
    marginBottom: 13,
    paddingHorizontal: 15,
    borderRadius: 80,
    borderColor:'#B2CEDE',
    borderWidth:2,
    backgroundColor:'#fafdff',
  },
  inputcon:{
    alignContent:'center',    
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingsty:{
    fontSize:18,
    fontWeight:'500',
    color:'#6e7073'
  },
  signbtn:{
    alignContent:'center', 
    alignItems:'center', 
    marginTop:30, 
    color:'black', 
    borderRadius:30
  },
  buttonText:{
    backgroundColor:'#99c0fa',
    fontSize:20, 
    fontWeight:'500', 
    paddingVertical:10, 
    paddingHorizontal:20,
    color:'#FFFFFF',
  }
});

export default Signuppage; 

