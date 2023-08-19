import { StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { worknikkey } from './keys/wordnikkey';
import 'react-native-gesture-handler';

//page directories
import { Loginpage } from './pages/loginpage';
import { Homepage } from './pages/homepage';
import { Displaypage } from './pages/displaypage';
import { Inputpage } from './pages/inputpage';
import { Editpage } from './pages/editpage';
import { Signuppage } from './pages/signuppage';
import { Dictionarypage } from './pages/dictionarypage';
import { Notepage } from './pages/notepage';
import { Settingpage } from './pages/settingpage';

const Stack = createStackNavigator();

export default function App() {
  const [word, setWord] = useState(null);
  const [definition, setDefinition] = useState(null);

  useEffect(() => {
    getwordoftheday();
  }, []);

  const getwordoftheday = (lat = 25, lon = 25) => {
    fetch(
      `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${worknikkey}`
    )
      .then(res => res.json())
      .then(json => {
        setWord(json.word);
        setDefinition(json.definitions[0].text);

      }).catch(error => {
          console.error(error);
        });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loginpage" component={Loginpage}  options={{ headerShown:false}}/>
        <Stack.Screen name="Homepage" 
        options={{ headerShown:false}}>
          {(props) => (
            <Homepage
              word={word}
              definition={definition}
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Displaypage" component={Displaypage}/>
        <Stack.Screen name="Inputpage" component={Inputpage} />
        <Stack.Screen name="Editpage" component={Editpage} />
        <Stack.Screen name="Signuppage" component={Signuppage}/>
        <Stack.Screen name="Notepage" component={Notepage}
        options={{title: 'My Note'}}/>
        <Stack.Screen name="Dictionarypage" component={Dictionarypage}  
        options={{title: 'Dictionary'}}/>
        <Stack.Screen name="Settingpage" component={Settingpage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
