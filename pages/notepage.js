import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FAB } from 'react-native-paper'; 

export function Notepage({ navigation }) {
  const [text, setText] = useState('');

  useEffect(() => {
    loadNoteText();
  }, []);

  useEffect(() => {
    saveNoteText();
  }, [text]);

  const loadNoteText = async () => {
    try {
      const savedText = await AsyncStorage.getItem('noteText');
      if (savedText !== null) {
        setText(savedText);
      }
    } catch (error) {
      console.error('Error while loading note:', error);
    }
  };

  const saveNoteText = async () => {
    try {
      await AsyncStorage.setItem('noteText', text);
    } catch (error) {
      console.error('Error while saving note:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.notearea}>
        <TextInput
          placeholder='Write your notes'
          label='note'
          style={styles.noteinput}
          maxLength={3000}
          multiline
          value={text}
          onChangeText={setText}
        />
      </View>
      <FAB
        style={styles.floatingbutton}
        icon="home"
        onPress={() => navigation.navigate('Homepage')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC'
  },
  headingcon: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headingsty: {
    fontSize: 25,
    color: '#686767',
    fontWeight: 'bold',
    shadowOpacity: 0.1
  },
  notearea: {
    flex: 1,
    backgroundColor: '#FFFFE0',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  noteinput: {
    flex: 1,
  },
  floatingbutton: {
    borderWidth: 1,
    borderColor: '#F7EE7F',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    right: 20,
    top: (Dimensions.get('window').height * 0.7),
    position: 'absolute',
    backgroundColor: '#F7EE7F',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
    floatingbutton1: {
    color:'black',
    borderWidth: 1,
    borderColor: '#F5FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    right:20,
    marginBottom:10,
    top:(Dimensions.get('window').height * 0.75),
    position: 'absolute',
    backgroundColor: '#F5FFFA',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
});

export default Notepage;
