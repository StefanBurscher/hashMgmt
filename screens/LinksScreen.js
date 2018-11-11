import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, View, TouchableOpacity, Platform } from 'react-native';
import { Button, Text, ListItem } from 'react-native-elements';
import StyledText from '../components/StyledText';
import { Icon } from 'expo';
import Colors from '../constants/Colors';

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
    console.log(patient)
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <StyledText style={{ paddingLeft: 10, marginRight: 10, fontSize: 16 }}>Selected user:</StyledText>
          <StyledText style={{ fontSize: 18 }}>{selectPatientData.title}</StyledText>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.goCamera}>
            <View style={{ flex: 1, width: 100, height: 100, flexGrow: 1, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, margin: 10, borderColor: Colors.tintColor }}>
              <Icon.Ionicons
                size={32}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-camera'
                    : 'md-camera'
                }
                color={Colors.tintColor}
                style={{ alignSelf: 'center' }} />
              <StyledText>Camera</StyledText>

            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goTherapy}>
            <View style={{ flex: 1, width: 100, height: 100, flexGrow: 1, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, margin: 10, borderColor: Colors.tintColor }}>
              <Icon.Ionicons
                size={32}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-construct'
                    : 'md-construct'
                }
                color={Colors.tintColor}
                style={{ alignSelf: 'center' }} />
              <StyledText>Therapy</StyledText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goChart}>
            <View style={{ flex: 1, width: 100, height: 100, flexGrow: 1, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, margin: 10, borderColor: Colors.tintColor }}>
              <Icon.Ionicons
                size={32}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-analytics'
                    : 'md-analytics'
                }
                color={Colors.tintColor}
                style={{ alignSelf: 'center' }} />
              <StyledText>Chart</StyledText>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView >
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
