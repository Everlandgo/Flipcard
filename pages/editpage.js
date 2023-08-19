import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper'; 

export function Editpage({ route, navigation }) {
  const { projectId } = route.params;
  const [wordanddef, setWordAndDef] = useState([]); 

  useEffect(() => {
    retrievedata(); 
  }, []);

  const saveandnav = async () => {
    try {
      await AsyncStorage.setItem(`@${projectId}:key`, JSON.stringify(wordanddef));
      navigation.navigate('Homepage', { title: projectId });
    } catch (error) {
      Alert.alert('Error occurred while storing the data');
    }
  };

  const todictionary =()=>{
    navigation.navigate('Dictionarypage');
  }

  const retrievedata = async () => {
    try {
      const data = await AsyncStorage.getItem(`@${projectId}:key`);
      const wordAndDef = JSON.parse(data);
      if (wordAndDef) {
        setWordAndDef(wordAndDef);
      } else {
        console.log('No data found.');
      }
    } catch (error) {
      Alert.alert('Error occurred while retrieving the data');
    }
  };

  const renderworddefinitioninputs = () => {
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

  const handleChange = (text, index, isWord) => {
    setWordAndDef((prevWordAndDef) => {
      const newWordAndDef = [...prevWordAndDef];
      if (isWord) {
        newWordAndDef[index].word = text;
      } else {
        newWordAndDef[index].definition = text;
      }
      return newWordAndDef;
    });
  };

  const addInputPlaces = () => {
    setWordAndDef((prevWordAndDef) => {
      const newWordAndDef = [...prevWordAndDef];
      newWordAndDef.push({ word: '', definition: '' });
      return newWordAndDef;
    });
  };

  const homebtn = () => {
    Alert.alert(
      'Are you sure you want to go back to homepage?',
      'The data would not be saved',
      [{ text: 'Cancel' },{text: 'OK',
          onPress: () => {
            navigation.navigate('Homepage');
          },
        },
      ],
      { cancelable: false }
    );
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
          {renderworddefinitioninputs()}

          <TouchableOpacity style={styles.addbutton} onPress={addInputPlaces}>
            <Icon name="pluscircle" style={styles.addbutton} size={50} color="#4392F1" />
            <Text style={{ color: 'grey' }}>Add words</Text>
          </TouchableOpacity>

          <Button onPress={saveandnav} title="SAVE" color="#1E96FC" />

        </View>

      </ScrollView>
        <FAB
            style={styles.floatingbutton1}
            icon={() => <IoniconsIcon name="search" size={26} color="black" />}
            onPress={todictionary}
          />
        <FAB
            style={styles.floatingbutton2}
            icon="home"
            onPress={homebtn}
          />
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
    fontWeight:'500',
    padding: 10,
  },
  addbutton: {
    backgroundColor: '#FFFFFF',
    marginTop: 5,
    alignItems: 'center',
  },
  floatingbutton2: {
    borderWidth: 1,
    borderColor: '#C3EB78',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    right:20,
    top:(Dimensions.get('window').height * 0.6),
    position: 'absolute',
    backgroundColor: '#C3EB78',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
  floatingbutton1: {
    color:'black',
    borderWidth: 1,
    borderColor: '#FFFFE0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    right:20,
    position: 'absolute',
    backgroundColor: '#FFFFE0',
    marginTop:(Dimensions.get('window').height * 0.7),
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
});

export default Editpage;
