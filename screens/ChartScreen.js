import React from 'react';
import PureChart from 'react-native-pure-chart';
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
import StyledText from '../components/StyledText';

export default class ChartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatient: '',
      painHistory: [],
      therapyHistory: []
    };
  }
  static navigationOptions = {
    title: 'Chart',
  };
  loading = async () => {
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    axios.get('https://painpoint.herokuapp.com/api/pain-history?patient_id=' + patient.id)
      .then((resp) => {
        axios.get('https://painpoint.herokuapp.com/api/therapy-history?patient_id=' + patient.id)
          .then((resp1) => {
            this.setState({ painHistory: resp.data["pain-history"], therapyHistory: resp1.data["therapy-history"], selectedPatient: patient })
          })
      })
  }

  componentDidMount = async () => {
    this.loading();
  }

  render() {
    let data = [];
    const { painHistory } = this.state;
    for (let i = 0; i < painHistory.length; i++) {
      const element = painHistory[i];
      data.push({
        x: element.created_at.split(' ')[0],
        y: Number(element.scale)
      })
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <StyledText style={{ marginLeft: 20, marginRight: 20, fontSize: 18, marginBottom: 10 }}>Pain scale chart</StyledText>
        <PureChart data={data} type='line' />
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
