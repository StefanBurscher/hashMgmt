import React from 'react';
import { List, ListItem } from 'react-native-elements'
import {
  AppRegistry,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';

export default class ChartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatient: '',
      painHistory: [],
      therapyHistory: []
    };
    this.timeout = null;
  }
  loading = async (prevState) => {
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    if (patient.id !== prevState.selectedPatient.id) {
      this.setState({ selectedPatient: JSON.parse(patientData) });
    }
    console.log(this.state.selectedPatient)
    axios.get('https://painpoint.herokuapp.com/api/pain-history?patient_id=' + this.state.selectedPatient.id)
      .then((resp) => {
        this.setState({ painHistory: resp.data["pain-history"] })
      })
    axios.get('https://painpoint.herokuapp.com/api/therapy-history?patient_id=' + this.state.selectedPatient.id)
      .then((resp) => {
        this.setState({ therapyHistory: resp.data["therapy-history"] })
      })
  }

  componentDidMount = async () => {
    this.loading(this.state);
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.state.selectedPatient.id !== prevState.selectedPatient.id) {
      this.loading(prevState);
    }
  }

  render() {
    console.log(this.state)
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  logo: {
    paddingTop: 10,
    alignSelf: 'center'
  }
});
