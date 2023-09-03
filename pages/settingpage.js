import React from 'react';
import { View, StyleSheet ,Dimensions,Button} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getAuth, signOut } from 'firebase/auth';

export function Settingpage({ navigation })  {

  // A function to sign the user out using Firebase function and navigating the user back to loginpage
    const signout = async () => {
        const auth = getAuth(); 
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Error signing out:', error);
        }
        navigation.navigate('Loginpage');
    };

  return (
    <View style={styles.container}>
        <View style={styles.iconcon}>
             <FontAwesome name="user-circle" style={styles.plusicon} size={130} color="#1E96FC" />
             <View style={styles.logoutcon}>
             <Button title='LOG OUT' onPress={signout}></Button>
             </View>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  iconcon:{
    alignContent:'center', 
    alignItems:'center', 
    top: (Dimensions.get('window').width * 0.2)
  },
  logoutcon:{
    marginTop:100
  }
});

export default Settingpage;
