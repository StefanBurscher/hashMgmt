import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { Button, Text, ListItem } from 'react-native-elements';

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatient: {}
    };
  }

  static navigationOptions = {
    title: 'Actions',
  };

  loading = async (prevState) => {
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    if (patient.id !== prevState.selectedPatient.id) {
      this.setState({ selectedPatient: JSON.parse(patientData) });
    }
  }

  componentDidMount = async () => {
    this.loading(this.state);
  }

  componentDidUpdate = async (prevProps, prevState) => {
    this.loading(prevState);
  }


  goCamera = () => {
    this.props.navigation.navigate('Camera');
  }

  goTherapy = () => {
    this.props.navigation.navigate('Therapy');
  }

  goChart = () => {
    this.props.navigation.navigate('Chart');
  }

  render() {
    const selectPatientData = this.state.selectedPatient;
    return (
      <ScrollView style={styles.container}>
        <Text>Selected user:</Text>
        <Text>{selectPatientData.title}</Text>
        <Button title="Camera" onPress={this.goCamera} />
        <Button title="Therapy" onPress={this.goTherapy} />
        <Button title="Chart" onPress={this.goChart} />
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
});
