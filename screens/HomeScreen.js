import React from 'react';
import { List, ListItem, Button } from 'react-native-elements'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { WebBrowser, Icon } from 'expo';

import StyledText from '../components/StyledText';
import axios from 'axios';
import Colors from '../constants/Colors';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      patients: []
    };
  }

  static navigationOptions = {
    title: 'Patients list',
  };

  componentDidMount = async () => {
    this.loadPatients();
  }

  componentDidUpdate = async (prevProps, prevState) => {
    this.loadPatients();
  }

  loadPatients = async () => {
    const userData = await AsyncStorage.getItem('user');
    axios.get('https://painpoint.herokuapp.com/api/patients?user_id=' + JSON.parse(userData).id)
      .then((resp) => {
        let patients = [];
        for (let i = 0; i < resp.data.patients.length; i++) {
          const element = resp.data.patients[i];
          patients.push({
            ...element,
            title: element.id + ' - ' + element.full_name,
            icon: 'face'
          })
        }
        this.setState({ patients });
      })
      .catch((err) => {
        console.log(err);
      })
  }

  goAddPatient = () => {
    this.props.navigation.navigate('AddPatient');
  }

  selectPatient = async (patient) => {
    await AsyncStorage.setItem('patient', JSON.stringify(patient));
    this.loadPatients()
    Alert.alert(`Patient - ${patient.full_name} selected.`);
    this.props.navigation.navigate('Links');
  }

  render() {
    const list = this.state.patients;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <List style={{ flex: 1, width: '100%' }}>
          {
            list.map((item) => (
              <TouchableOpacity key={item.title} onPress={() => this.selectPatient(item)}>
                <ListItem
                  style={{ flex: 1, width: '100%' }}
                  title={item.title}
                  subtitle={item.subtitle}
                  leftIcon={{ name: item.icon }}
                />
              </TouchableOpacity>
            ))
          }
        </List>
        <View style={{ height: 20 }}></View>
        <Button title="Add patient" large backgroundColor={Colors.tintColor} style={{ marginBottom: 10 }} borderRadius={30} onPress={this.goAddPatient} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
