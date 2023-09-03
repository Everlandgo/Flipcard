import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions,Alert} from 'react-native';
import Animated, { useAnimatedStyle, withTiming} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export function Displaypage({route}) {
  const {projectId} = route.params;

  // A state variable to track the flip state
  const [isFlipped, setIsFlipped] = useState(false);

  // A state variable to indicate if there is a next value available to display
  const [haveNxtVal, sethaveNxtVal] = useState(false);

  // A state variable to track whether the loop is on or off
  const [loop, setlooping] = useState(false); 

  // A state variable to track whether the shuffle is on or off
  const [shuffle, setshuffle] = useState(false);  

  // A emtpy array state variable to store the words and defintions retrieved from AsyncStorage
  const [WordAndDef, setWordAndDef] = useState([]); 
  
  // A state variable to store array indexs that has been already chosen (in order) 
  const [indexstorage, setindexstorage] = useState([0]); 

  // A state variable to store array indexs that has been already chosen while shuffling (randomly generated number)
  const [numbersToExclude, setnumbersToExclude] = useState([0]);

  // A state variable to store the current card index
  const[cardindex, setcardindex]=useState(0);

  // A state variable to store the randomly generated number
  const [randomNum, setrandomNum] = useState(0);  

  // usestates for storing the colour of buttons 
  const [loopbtn, setloopbtn] = useState('white'); 
  const [shufflebtn, setshufflebtn] = useState('white'); 
  
  const sizeofdata = WordAndDef.length;

  useEffect(() => {
    setIsFlipped(false);
    retrievedata(); 
  }, []);

  // A function to handle the flip of the card 
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // A function to generate random numbers for shuffling feature
  const generateNumber = () => {
    let chosenNum = Math.floor(Math.random() * sizeofdata);

    console.log('numbersToExclude', numbersToExclude);
    console.log('sizeofdata', sizeofdata);

    if(numbersToExclude.length!==sizeofdata){
      while (numbersToExclude.includes(chosenNum)) {
        chosenNum = Math.floor(Math.random() * sizeofdata);
        }
    }
    else if (numbersToExclude.length === sizeofdata && loop){
      setnumbersToExclude([]);
    }
    else{
      alert('You have reached the final card');
      return;
    }
    setnumbersToExclude((prevExcludedNumbers) => [...prevExcludedNumbers, chosenNum]);
    setindexstorage((previndex) => [...previndex, chosenNum]);
    console.log('numbersToExclude', numbersToExclude);
    setrandomNum(chosenNum);
  };

// Function to handle displaying the next card data
  const nextNumber = () => {
    setIsFlipped(false);
    if(haveNxtVal){
      let index = numbersToExclude.length-1;
      setrandomNum(numbersToExclude[index]);
      sethaveNxtVal(false);
    }
    else{
      if(shuffle){
        generateNumber();
      }
      else{
        if(cardindex!==(sizeofdata-1)){
          setcardindex(cardindex+1);
        }
        else if (loop){
          setcardindex(0);
        }else{
          alert('You have reached the final card'); 
        }
      }
    }
  };

 // Function to handle displaying the prevous card's word and defintion 
  const previousNumber=()=>{
    setIsFlipped(false);
    if(shuffle){
      if(indexstorage.length <= 1 ){
        alert("There is no previous card");
        return
      }
      else{
        sethaveNxtVal(true);
        let storagelength =indexstorage.length ; 
        const prevNum = indexstorage[storagelength-2];
        setrandomNum(prevNum);
        setindexstorage(indexstorage.slice(0, -1)); 
      }
    }else{
      if(cardindex === 0 &&!loop){
        alert("There is no previous card");
        return
      }
      if(cardindex === 0 && loop){
        setcardindex(4);
      }
      else{
        setcardindex(cardindex-1);
      }
    }
  
  };

// Function to retrieve and display either the word or definition of the current card
  const displaydata = (indicator) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let index=0;
    if(!shuffle){
      index=cardindex;
    }else{
      index=randomNum;
    }
    if (indicator=='word'){
      const word = WordAndDef[index]?.word;
      return word
    }
    else{
      const def = WordAndDef[index]?.definition;
      return def 
    }
  }

  // Function to retrieve data from AsyncStorage
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

  // A function to handle the looping 
  const looping =() =>{
    if (!loop){
      setloopbtn('#C3EB78');
      setlooping(true);
    }else{
      setloopbtn('white'); 
      setlooping(false);
    }
  }

  // A function to handle the shuffling 
  const shuffling=()=>{
    if (!shuffle){
      setshufflebtn('#67cbe2');
      setshuffle(true);
    }else{
      setshufflebtn('white'); 
      setshuffle(false);
    }
  }

// Animated styles for the front card based on flip state
  const frontCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: withTiming(isFlipped ? '180deg' : '0deg') }],
      zIndex: isFlipped ? 0 : 1,
    };
  });

// Animated styles for the back card based on flip state
  const backCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: withTiming(isFlipped ? '0deg' : '180deg') }],
      zIndex: isFlipped ? 1 : 0,
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>

          <TouchableOpacity style={styles.cardContainer} onPress={handleFlip}>
            <Animated.View style={[styles.card, styles.cardFront, frontCardStyle]}>
              <Text style={styles.cardText}>{displaydata('word')}</Text>
            </Animated.View>

            <Animated.View style={[styles.card, styles.cardBack, backCardStyle]}>
              <Text style={styles.cardDefText}>{displaydata('def')}</Text>
            </Animated.View>
          </TouchableOpacity>

        <View style={styles.buttoncontainers}>
          <TouchableOpacity >
            <Icon name="arrow-back" style={styles.arrowbutton} size={50} onPress={previousNumber} />
          </TouchableOpacity>
          
          <TouchableOpacity >
            <Icon name="arrow-forward" style={styles.arrowbutton} size={50} onPress={nextNumber} />
          </TouchableOpacity>
        </View>
                
        <View style={styles.buttoncontainers}>
          <TouchableOpacity  style={styles.iconbutton}>
            <View style={[styles.btnWrapper, { backgroundColor: shufflebtn }]}>
              <Icon name="shuffle" style={{padding:10}} size={20} onPress={shuffling} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconbutton}>
            <View style={[styles.btnWrapper, { backgroundColor: loopbtn }]}>
              <Icon name="repeat" style={{padding:10}} size={20} onPress={looping} />
            </View>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height * 0.7),
    alignItems: 'center',
    marginVertical:10
  },
  card: {
    width: (Dimensions.get('window').width * 0.85),
    height: (Dimensions.get('window').height * 0.7),
    backgroundColor: '#d7fbda',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowOpacity: 0.2,
    shadowRadius:10
  },
  cardFront: {
    zIndex: 1,
    backgroundColor:'#CEE5F2'
  },
  cardBack: {
    zIndex: 0,
    backgroundColor:'#ACCBE1'
  },
  cardText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight:"bold", 
    justifyContent: 'center',
    alignContent:'center'
  },
  cardDefText: {
    fontSize: 30,
    color: '#3f3d3d',
    fontWeight:"bold", 
    justifyContent: 'center',
    alignContent:'center',
    alignItems:'center'
  },
  arrowbutton :{
    color:'black',
    paddingHorizontal:40,
    borderRadius:20,
    borderWidth:5,
    borderColor:'#ACCBE1',
    marginHorizontal:20,
  },
  buttoncontainers:{
    flexDirection:'row',
    backgroundColor:'d7fbda',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center'
  },
  iconbutton:{
    color:'black',
    borderRadius:20,
    borderWidth:5,
    margin:3,
    borderColor:'#ACCBE1',
  },
  btnWrapper: {
    borderRadius: 15,
  },

});

export default Displaypage;
