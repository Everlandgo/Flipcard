import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/AntDesign';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export function Homepage({ navigation, ...props }) {
// A state variable to store project data (title, category) 
const [projects, setProjects] = useState([]);

// A state variable to handle the modal visibility of a title input modal (1.)
const [titlemodal, settitlemodal] = useState(false);

// A state variable to track the flip state
const [isFlipped, setIsFlipped] = useState(false);

// A state variable to handle the modal visibility of a page option modal (2.)
const [pageopionmodal, setpageopionmodal] = useState(false);

// A state variable to store the inputted title of new project
const [title, settitle] = React.useState('');

// A state variable to store ID of the currently selected project
const [selectedProjectId, setSelectedProjectId] = useState('');

// Retrieving project word and definition from the route for word of the day feature
const { word, definition } = props;

//A state variable to store  word or definition for word of the day 
const [wordofday, setwordofday] = useState('');

// The state variable to store the current category being displayed 
const [category, setcategory] = useState('studying');

// The state variable for opacity value for the "Studying" category button
const [studybtn, setstudybtn] = useState(1);

// The state variable for opacity value for the "Done Studying" category button
const [comepeletebtn, setcomepeletebtn] = useState(0.5);

// A reference to the notification listener
const notificationListener = useRef();

// A reference to the notification response listener
const responseListener = useRef();


  useEffect(() => {
    loadProjects();
    setwordofday(word);
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [word]);

  //The function handles the text that is displayed on the 'word of the day' card depending on the flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (wordofday === word) {
      setwordofday(definition);
    } else if (wordofday === definition) {
      setwordofday(word);
    }
  };

  // Function to fetch saved project data (title, category) from AsyncStorage
  const loadProjects = async () => {
    try {
      const projecttitle = await AsyncStorage.getItem('projects');
      if (projecttitle) {
        setProjects(JSON.parse(projecttitle));
      }
    } catch (error) {
      console.log('Error loading projects:', error);
    }
  };

  // Function to save project data (title, category) to AsyncStorage
  const saveNewProject = async (projecTitleToSave) => {
    setProjects(projecTitleToSave);
    try {
      const titles = JSON.stringify(projecTitleToSave);
      await AsyncStorage.setItem('projects', titles);
    } catch (error) {
      console.log('Error saving projects:', error);
    }
  };

  // Function to delete project data from AsyncStorage
  const deleteProject = async (projectId) => {
    try {
      console.log('delete button pressed', projectId);
      const updatedProjects = projects.filter(
        (project) => project.id !== projectId
      );
      setProjects(updatedProjects);
      try {
        const titles = JSON.stringify(updatedProjects);
        await AsyncStorage.setItem('projects', titles);
      } catch (error) {
        console.log('Error saving projects:', error);
      }
    } catch (error) {
      console.log('Error deleting project:', error);
    }
  };

  // Function to change the category of projects to 'completed'
  const finishStudying = async () => {
    let id = selectedProjectId;
    const updatedProjectCat = projects.map((project) =>
      project.id === id ? { ...project, category: 'completed' } : project
    );
    console.log('updatedProjectCat', updatedProjectCat);

    try {
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjectCat));
      const finished = await AsyncStorage.getItem('projects');
      loadProjects();
      console.log('finished', finished);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to save a new project (title and category)
  const saveProject = (inputText) => {
    const removechar = inputText.replace(/[^A-Z0-9]+/i, '');
    const inputtedtitle = removechar.trim();
    console.log('projects',projects);
    if (inputtedtitle !== '') {
      const existingProject = projects.find((project) => project.id === inputtedtitle);
      if (existingProject) {
        alert('This title is already taken');
        settitlemodal(true);
      } else {
        const newProject = {
          id: inputtedtitle,
          category: category,
        };
        saveNewProject([...projects, newProject]);
        settitlemodal(false);
        navigation.navigate('Inputpage', { projectId: inputtedtitle });
        console.log('project added');
        settitle('');
      }
    } else {
      alert('Title is required');
      settitlemodal(true);
    }
  };

  // Function to render project buttons based on category
  const renderProjectButtons = () => {
    const projectsFound = [];

    for (const project of projects) {
      if (project.category === category) {
        projectsFound.push(project);
      }
    }
    return projectsFound.map((project) => (
      <TouchableOpacity
        style={styles.project}
        key={project.id}
        onPress={() => {
          setpageopionmodal(true);
          setSelectedProjectId(project.id);
        }}>
        <Text style={{ fontSize: 20, color: 'black' }}>{project.id}</Text>
      </TouchableOpacity>
    ));
  };

  //function to return plus icon button, but only when chosen category is 'studying'
  const generatePlusbtn = () => {
    if (category === 'studying') {
      return (
        <TouchableOpacity
          onPress={async () => {
            settitlemodal(true);
            await schedulePushNotification();
          }}>
          <Icon
            name="plussquareo"
            style={styles.plusicon}
            size={90}
            color="#77B6EA"
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  //function to handle the closing of modal
  const closemodal = () => {
    settitle('');
    settitlemodal(false);
    setpageopionmodal(false);
  };

  //function for animation
  const animation = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: withTiming(isFlipped ? '360deg' : '0deg') }],
      zIndex: isFlipped ? 0 : 1,
    };
  });

  //function that clears out all the project in the asynstorage
  const deletealldata = async () => {
    try {
      await AsyncStorage.clear();
      setProjects([]);
    } catch (error) {
      console.log(error);
    }
  };

  //function to show alert message as clearing of the project cannot be undone
  const showAlert = () => {
    Alert.alert(
      'Are you sure you want to delete all the projects?',
      'This action cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => {
            deletealldata();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* 1. modal for title input */}
          <Modal animationType="slide" transparent={true} visible={titlemodal}>
            <View style={styles.modal1}>
              <View style={styles.modalContent1}>
                <TextInput
                  placeholder="Enter project title"
                  label="title"
                  style={styles.titleinput}
                  maxLength={40}
                  value={title}
                  onChangeText={(title) => settitle(title)}
                />
                <Button
                  title="Save"
                  style={{ maring: 5 }}
                  onPress={() => saveProject(title)}></Button>
                <Button
                  title="Cancel"
                  style={{ maring: 5 }}
                  onPress={closemodal}></Button>
              </View>
            </View>
          </Modal>

          {/* 2. modal to choose the page to navigate to */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={pageopionmodal}>
            <View style={styles.modal2}>
              <View style={styles.modalContent2}>
                <SafeAreaView>
                  <View style={styles.direction}>
                    <TouchableOpacity
                      style={styles.pagebutton}
                      onPress={() => {
                        navigation.navigate('Editpage', {
                          projectId: selectedProjectId,
                        });
                        setSelectedProjectId('');
                        setpageopionmodal(false);
                      }}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.pagebutton}
                      onPress={() => {
                        navigation.navigate('Displaypage', {
                          projectId: selectedProjectId,
                        });
                        setSelectedProjectId('');
                        setpageopionmodal(false);
                      }}>
                      <Text style={styles.buttonText}>Study</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.direction}>
                    <TouchableOpacity
                      style={styles.pagebutton}
                      onPress={() => {
                        finishStudying();
                        setSelectedProjectId('');
                        setpageopionmodal(false);
                      }}>
                      <Text style={styles.buttonText}>Completed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.pagebutton}
                      onPress={() => {
                        deleteProject(selectedProjectId);
                        setSelectedProjectId('');
                        setpageopionmodal(false);
                      }}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ margin: 20 }}>
                    <Button
                      title="Close"
                      style={styles.buttonText}
                      onPress={closemodal}></Button>
                  </View>
                </SafeAreaView>
              </View>
            </View>
          </Modal>

          <View style={styles.homepageContainer}>
            <View style={styles.wordbox}>
              <View style={styles.wordContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settingpage')}>
                  <View style={styles.tosettingpage}>
                    <FontAwesome
                      name="user-circle"
                      style={styles.plusicon}
                      size={30}
                      color="#eaeded"
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.wordofdayHeading}>Word of the day </Text>
                <IoniconsIcon
                  name="sunny"
                  style={{ paddingTop: 2, marginBottom: 0 }}
                  size={30}
                  color="#FF6666"
                />
              </View>

              <TouchableOpacity style={styles.card} onPress={handleFlip}>
                <Animated.View
                  style={[
                    styles.card,
                    { borderWidth: 5, borderColor: '#D5EEFF' },
                    styles.cardFront,
                    animation,
                  ]}>
                  <Text style={styles.wordText}>{wordofday}</Text>
                  <Text style={styles.clickmeText}>click me!</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.headingcon}>
              <Text style={styles.headingssty}>Projects</Text>
              <IoniconsIcon
                name="documents"
                style={{ paddingTop: 2, marginBottom: 0 }}
                size={30}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.projectarea}>
              <View
                style={[styles.direction, { width: '100%', borderRadius: 15 }]}>
                <TouchableOpacity
                  style={[
                    styles.categorysty,
                    { marginRight: 5, opacity: studybtn },
                  ]}
                  onPress={() => {
                    setcategory('studying'),
                      setstudybtn(1),
                      setcomepeletebtn(0.5);
                  }}>
                  <Text>Studying</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categorysty, { opacity: comepeletebtn }]}
                  onPress={() => {
                    setcategory('completed'),
                      setstudybtn(0.5),
                      setcomepeletebtn(1);
                  }}>
                  <Text>Done Studying</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  borderBottomColor: '#b8cfe3',
                  borderBottomWidth: 5,
                }}
              />

              {/* fetching the projects */}
              {renderProjectButtons()}

              {/* fetching plus button */}
              {generatePlusbtn()}
            </View>
            <Button title="Clear" color="#73aede" onPress={showAlert} />
          </View>
        </View>
      </ScrollView>
      <FAB
        style={styles.floatingbutton1}
        icon={() => <IoniconsIcon name="search" size={26} color="black" />}
        onPress={()=>navigation.navigate('Dictionarypage')}
      />
      <FAB
        style={styles.floatingbutton2}
        icon={() => (
          <FontAwesome name="sticky-note-o" size={26} color="black" />
        )}
        onPress={()=>navigation.navigate('Notepage')}
      />
    </SafeAreaView>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've created your first project!",
      body: 'Label your project',
    },
    trigger: { seconds: 2 },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Now, Try adding the words and definition ',
      body: 'If you have any further edits to make proceed to editpage',
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1615157b',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: '46a8a57d-2ca5-4471-ab3d-a6d6e8534d3b',
      })
    ).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingBottom: 30,
  },
  homepageContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  wordbox: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F0F8FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#77B6EA',
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  wordofdayHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 100,
    color: '#000000',
    paddingVertical: 10,
    backgroundColor: '#77B6EA',
  },
  card: {
    width: Dimensions.get('window').width * 0.8,
    flex: 1,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  clickmeText: {
    fontSize: 12,
    color: '#9e9999',
  },
  headingcon: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#77B6EA',
    borderRadius: 1,
    alignItems: 'center',
    borderRadius: 5,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingssty: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  categorysty: {
    padding: 10,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderColor: '#b8cfe3',
    marginTop: 5,
    borderTopLeftRadius: 20,
    marginHorizontal: 1,
    width: (Dimensions.get('window').width * 0.8) / 2.5,
  },
  projectarea: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.95,
    borderRadius: 10,
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#D6EEFF',
    margin: 5,
  },
  cardFront: {
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  project: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: (Dimensions.get('window').width * 0.8) / 4,
    height: (Dimensions.get('window').width * 0.8) / 4,
    backgroundColor: '#77B6EA',
    borderRadius: 10,
    margin: 5,
  },
  plusicon: {
    width: (Dimensions.get('window').width * 0.9) / 4,
    height: (Dimensions.get('window').width * 0.95) / 4,
    shadowOpacity: 0.1,
    marginLeft: 5,
    marginTop: 3,
  },

  titleinput: {
    margin: 10,
    borderWidth: 4,
    borderColor: '#4392F1',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 20,
  },

  modal1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  modal2: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  modalContent1: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalContent2: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2.5,
    borderRadius: 20,
    borderColor: '#BEBEBE',
    shadowOpacity: 0.3,
  },

  direction: {
    flexDirection: 'row',
  },
  pagebutton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: 20,
    borderColor: '#1E96FC',
    margin: 10,
    width: (Dimensions.get('window').width * 0.8) / 2,
    height: (Dimensions.get('window').height * 0.5) / 4,
    shadowOpacity: 0.2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  floatingbutton1: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#F5FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    right: 20,
    marginBottom: 10,
    top: Dimensions.get('window').height * 0.75,
    position: 'absolute',
    backgroundColor: '#F5FFFA',
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
  floatingbutton2: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#FFFFE0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    right: 20,
    position: 'absolute',
    backgroundColor: '#FFFFE0',
    marginTop: Dimensions.get('window').height * 0.85,
    borderRadius: 100,
    shadowOpacity: 0.1,
  },
  tosettingpage: {
    right: 0,
    height: 35,
    width: 40,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default Homepage;

