import React, { useState } from 'react';
import { View, TextInput, StyleSheet ,Text, Dimensions, Button, Image, TouchableOpacity} from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { firebase_auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export function Loginpage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = firebase_auth;

  const signIn = async () => {
    console.log("Inside the signIn function");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Homepage');
    } catch (error) {
      console.log(error);
      alert('Invalid credentials. Please review the email and password you entered.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#c5f5dd', '#99c0fa']}
        style={styles.background}
      />
      <View style={styles.headingContainer}>
        <Text style={styles.headingsty}>WELCOME TO</Text>
      </View> 
      <View style={styles.logocon}>
        <Image
        style={styles.logosty}
        source={require('../assets/logo.png')}
      />
      </View>
       <View style={styles.logcontainer}>     
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={'Email'}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />

      <Button 
        title="LOGIN" 
        type="solid"
        buttonStyle={styles.buttonsty}
        titleStyle={styles.buttonText} 
        onPress={signIn}
      />

      </View>
      <View style={styles.stxtcontainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Signuppage")}>    
        <Text style={styles.smalltext}>Don’t have an account?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signuppage")}>    
      <Text style={styles.smalltext}>Sign Up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },

  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },

  headingContainer: {
    position: 'absolute',
    top: (Dimensions.get('window').height*0.15),
    width: '100%',
    alignItems: 'center',
  },

  headingsty:{
    fontSize:60, 
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
    padding:10
  },

  logcontainer:{
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top:(Dimensions.get('window').height*0.5), 
  },
  input: {
    width: 270,
    height: 50,
    marginBottom: 13,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor:'#FFFAFA'
  },

  buttonsty: {    
    width:150,
    marginTop:20,
    marginRight:40,
    marginLeft:40,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#2381c2',
    borderRadius:100,
  },
  buttonText: {
    fontWeight:600,
    fontSize: 19, 
  },
  stxtcontainer:{
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top:(Dimensions.get('window').height*0.70),
    marginTop:50

  },
  smalltext:{
    color:"#FFFFFF",
    fontSize: 17,
    marginTop:5
  },
  logosty:{
    width:350, 
    height:350, 
    padding:0,
    top:Dimensions.get('window').height*0.25,
    marginLeft:30
    
  }, 
  logocon:{
    alignItems:'center', 
    alignContent:'flex-start', 
    justifyContent:'flex-end'
  }
});

export default Loginpage; 

