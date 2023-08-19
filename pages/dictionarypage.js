import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TextInput, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Dictionarypage({ navigation }) {
  const [searchWord, setSearchWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [synonyms, setsynonyms] = useState('');
  const [previousWord, setPreviousWord] = useState([]);

  useEffect(() => {
    loadPreviousWord();
  }, []);

  const loadPreviousWord = async () => {
    try {
      const storedWord = await AsyncStorage.getItem('previousWord');
      if (storedWord) {
        setPreviousWord(storedWord);
      }
    } catch (error) {
      console.error('Error while loading previous word:', error);
    }
  };

  const savePreviousWord = async () => {
    try {
      await AsyncStorage.setItem('previousWord', searchWord);
    } catch (error) {
      console.error('Error while saving previous word:', error);
    }
  };

  const connectDictionary = () => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      .then(res => res.json())
      .then(data => {
        if (!data) {
          alert(`No results found for "${searchWord}"`);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          const searchResult = data[0];
          const meanings = searchResult.meanings;
          const phonetics = searchResult.phonetics;
          let synonym = searchResult.meanings[0].synonyms;
          synonym = synonym.join(', ');
          setsynonyms(synonym);

          if (!meanings || meanings.length === 0) {
            alert(`No meanings found for "${searchWord}"`);
          } else {
            const meaningList = meanings.map(meaningObj => meaningObj.definitions[0].definition);
            setDefinition(meaningList.join('\n'));
          }
          if (!phonetics || phonetics.length === 0) {
            alert(`No phonetics found for "${searchWord}"`);
          } else {
            const phoneticList = phonetics.map(phoneticObj => phoneticObj.text);
            setPhonetic(phoneticList.join(', '));
          }
        } else {
          alert(`No valid results found for "${searchWord}"`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderWordInfo = () => {
    if (searchWord) {
      return (
        <View>
          <View style={styles.dictionarysty}>
            <Text style={styles.wordstyle}>{displayWord}</Text>
          </View>
          <View style={styles.phoneticCon}>
            <Text style={styles.phoneticstyle}>{phonetic}</Text>
          </View>
          <View style={styles.worddefcon}>
            <Text style={styles.wordDefinitionsty}>Definition: </Text>
          </View>
          <View style={styles.defCon}>
            <Text style={styles.definistionstyle}>{definition}  </Text>
          </View>
          <View>
            <Text style={styles.synonymsty}>synonyms: </Text>
            <Text style={styles.definistionstyle}>{synonyms}  </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.wordpreveslycon}>
            <Text style={styles.prevtext}> Previously searched word: </Text>
          </View>
          <View style={styles.prevcon}>
          <Text style={styles.prevword}>{previousWord}</Text>
          </View>
        </View>
      );
    }
  };

  const searching = () => {
    setDisplayWord(searchWord);
    connectDictionary();
    savePreviousWord();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.searchbarcon}>
            <TextInput
              placeholder='Search'
              maxLength={100}
              value={searchWord}
              style={styles.searchbar}
              onChangeText={setSearchWord}
            />
            <TouchableOpacity onPress={searching}>
              <Icon name="search" size={30} color="#1E96FC" />
            </TouchableOpacity>
          </View>
          <View style={styles.definecon}>
            {renderWordInfo()}
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',    
    marginBottom:20,
  },
  searchbarcon:{
    alignSelf: 'center',
    height:60, 
    width:'80%', 
    borderRadius:25, 
    borderColor:'#a6cae6',
    marginTop:20, 
    borderWidth:3,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: 'white',

  },
  searchbar:{
    height:60, 
    borderRadius:10, 
    fontSize:25, 
    fontWeight:'600',
    textAlign: 'center' ,
    width: '90%',
  },
  definecon:{
    height:(Dimensions.get('window').height * 0.75), 
    width:'90%',
    backgroundColor:'#FFFFFF', 
    opacity:0.9, 
    alignContent:'center', 
    alignItems:'center', 
    marginVertical:10, 
    borderRadius:50, 
    shadowOpacity:0.2
  },
  imageBackground: {
    width:'100%', 
    height:'100%',
    alignContent:'center', 
    alignItems:'center', 
  },
  floatingbutton: {
    borderWidth: 1,
    borderColor: '#C3EB78',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    right:25,
    top:(Dimensions.get('window').height * 0.7),
    position: 'absolute',
    backgroundColor: '#C3EB78',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
  dictionarysty:{
    alignItems: 'left',
    marginLeft:20
  },
  wordstyle:{
    fontSize:30, 
    paddingTop:20, 
    paddingBottom:10, 
    fontWeight:'700', 
    justifyContent:'center'
  }, 
  phoneticstyle:{
    fontSize:18, 
  }, 
  phoneticCon:{
    textAlign: 'left',
    marginLeft:15, 
  },
  worddefcon:{
    alignSelf: 'flex-start',
    marginLeft:10, 
  },
  wordDefinitionsty:{
    marginTop:20,
    marginBottom:10,
    fontSize:18, 
    fontWeight:'600'
  },
  synonymsty:{
    marginTop:20,
    marginBottom:10,
    fontSize:18, 
    fontWeight:'600', 
    marginLeft:10
  },
  defCon:{
    alignContent:'center', 
    alignItems:'center', 
    justifyContent:'center', 
  },
  definistionstyle:{
    fontSize:20, 
    justifyContent:'center', 
    textAlign: 'left',
    paddingHorizontal:10
  },
  prevtext:{
    fontSize:20, 
    fontWeight:'600'
  },
  prevword:{
    fontSize:20, 
    fontWeight:'600'
  },
  prevcon:{
    alignContent:'center', 
    alignItems:'center', 
    backgroundColor:'#b1cee0', 
    padding:10, 
    borderRadius:10, 
    margin:5
  },
  wordpreveslycon:{
    paddingVertical:20
  }


});

export default Dictionarypage;
