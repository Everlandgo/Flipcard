import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Inputpage({route,navigation}) {
  // Retrieving project id from the route
  const { projectId } = route.params;
  const [wordanddef, setwordanddef] = useState(Array.from({ length: 3 }, () => ({ word: '', definition: '' })));

// saving inputted data in asyncstorage and navigate to homepage
  const saveAndNavigate = async () => {
    console.log("Data to be saved:", wordanddef); 
      try {
        await AsyncStorage.setItem(`@${projectId}:key`, JSON.stringify(wordanddef));
        navigation.navigate('Homepage', { projectId });
      } catch (error) {
        Alert.alert('Error occurred while storing the data');
      }
  };

// looping to length of wordanddef usestate to create the textinput elements
  const worddefinitioninputplace = () => {
    return wordanddef.map(({ word, definition }, index) => (
      <View key={index} style={styles.wordDefinitionContainer}>
        {/* numbering*/}
        <Text style={{ marginLeft: 0, fontWeight: 700, color: '#404F60' }}>{index + 1}.</Text>
        {/* Input place for words */}
        <TextInput
          value={word}
          onChangeText={(text) => handleChange(text, index, true)}
          placeholder={"Enter word"}
          style={styles.wordInput}
        />
        {/* Input place for definition */}
        <TextInput
          value={definition}
          onChangeText={(text) => handleChange(text, index, false)}
          placeholder={"Enter definition "}
          style={styles.definitionInput}
          multiline
          maxFontSizeMultiplier={500}
        />  
      </View>
    ));
  };

  // checks if incoming text is word or definition after recognizing, stores the text accordingly in the correct location 
  const handleChange = (text, index, isWord) => {
    setwordanddef((prevWordAndDef) => {
    const newWordAndDef = [...prevWordAndDef];
    if (isWord) {
      newWordAndDef[index].word = text;
    } else {
      newWordAndDef[index].definition = text;
    }
    checkDuplicates(newWordAndDef);
    return newWordAndDef;
    });
  };

  const checkDuplicates = (updatedWordAndDef) => {
    const wordList = updatedWordAndDef.map(item => item.word.toLowerCase());
    const duplicateWords = [];
  
    wordList.forEach((word, index) => {
      const isDuplicate = wordList.indexOf(word) !== index; // Check if word appears more than once
      const isNotAdded = !duplicateWords.includes(word);
      if (isDuplicate && isNotAdded && word!=='') {
        duplicateWords.push(word);
      }
    });

    if (duplicateWords.length > 0) {
      Alert.alert('Duplicate word found:', duplicateWords.join(', '));
    }
    }

  // adding input places for word and def
  const addInputPlaces = () => {
    setwordanddef((prevWordAndDef) => {
    const newwordanddef = [...prevWordAndDef];
    newwordanddef.push({ word: '', definition: '' });
    return newwordanddef;
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleplace}>
          <Text style={styles.titlesty}>
            {projectId}
          </Text>
          </View>
          {worddefinitioninputplace()}

          <TouchableOpacity style={styles.addbutton} onPress={addInputPlaces}>
            <Icon name="pluscircle" style={styles.addbutton} size={50} color="#4392F1" />
            <Text style={{ color: 'grey' }}>Add words</Text>
          </TouchableOpacity>

          <Button onPress={saveAndNavigate} title="SAVE" color="#1E96FC" />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  titlesty: {
    fontSize: 22,
    fontWeight: '800',
    color: '#97BDFB',
  },
  titleplace: {
    width: Dimensions.get('window').width * 0.9,
    height: 55,
    fontSize: 15,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    borderColor: '#97BDFB',
    borderWidth: 5,
    borderRadius: 20,
    alignContent:'center',
    alignItems:'center'
  },
  wordDefinitionContainer: {
    flexDirection: 'column',
    alignItems: 'left',
  },
  wordInput: {
    width: Dimensions.get('window').width * 0.8,
    height: 40,
    borderRadius: 20,
    margin: 5,
    padding: 10,
    color: '#2d2e30',
    borderColor: '#B1D6F1',
    borderWidth: 2,
    fontWeight:'500',

  },
  definitionInput: {
    width: Dimensions.get('window').width * 0.8,
    height: 70,
    borderRadius: 15,
    padding: 10,
    margin: 5,
    backgroundColor: "#FFFFFF",
    borderColor: '#B1D6F1',
    borderWidth: 2,
    color: '#2d2e30',
    padding: 10,
    fontWeight:'500',

  },
  addbutton: {
    backgroundColor: '#FFFFFF',
    marginTop: 5,
    alignItems: 'center',
  },
  floatingbutton: {
    borderWidth: 1,
    borderColor: '#C3EB78',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    right:20,
    top:(Dimensions.get('window').height * 0.7),
    position: 'absolute',
    backgroundColor: '#C3EB78',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
});

export default Inputpage;
