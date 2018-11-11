import React from 'react';
import { List, ListItem, Card, Text } from 'react-native-elements'
import {
  ActivityIndicator,
  AsyncStorage,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button
} from 'react-native';
import axios from 'axios';
import { Icon } from 'expo';
import StyledText from '../components/StyledText';
import Colors from '../constants/Colors';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patient: { full_name: '', icon: 'face' },
      pains: []
    }
  }
  static navigationOptions = {
    title: 'Profile - Medic',
  };

  componentDidMount = async () => {
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    this.setState({ patient });
    axios.get('https://painpoint.herokuapp.com/api/therapy-history?patient_id=' + patient.id)
      .then((resp) => {
        let pains = [];
        for (let i = 0; i < resp.data["therapy-history"].length; i++) {
          const element = resp.data["therapy-history"][i];
          pains.push({
            ...element,
            icon: 'face'
          })
        }
        this.setState({ patient, pains });
      })
      .catch((err) => {
        console.log(err);
      })
  }


  render() {
    const { patient, pains } = this.state;
    console.log(pains)
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card style={{ flexDirection: 'column' }}>
          <View style={{ flex: 1 }}>
            <Icon.Ionicons
              size={50}
              name={
                Platform.OS === 'ios'
                  ? 'ios-contact'
                  : 'md-contact'
              }
              color={"#000"}
              style={{ marginBottom: 15, marginLeft: 15 }} />
            <Text style={{ marginBottom: 10 }}>
              {patient.full_name}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={this._signOutAsync} style={{ borderWidth: 1, flex: 1 }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </Card>
        <ScrollView style={styles.container}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
              <View style={{ flex: 1, width: 100, height: 100, flexGrow: 1, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, margin: 10, borderColor: Colors.tintColor }}>
                <Icon.Ionicons
                  size={32}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-list'
                      : 'md-list'
                  }
                  color={Colors.tintColor}
                  style={{ alignSelf: 'center' }} />
                <StyledText>Pain Activity</StyledText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings1')}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings2')}>
              <View style={{ flex: 1, width: 100, height: 100, flexGrow: 1, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, margin: 10, borderColor: Colors.tintColor, backgroundColor: Colors.tintColor }}>
                <Icon.Ionicons
                  size={32}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-list'
                      : 'md-list'
                  }
                  color={'#fff'}
                  style={{ alignSelf: 'center' }} />
                <StyledText style={{ color: '#fff' }}>Medic Activity</StyledText>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView >

        <List style={{ flex: 1, width: '100%' }}>
          {
            pains.map((item) => (
              <ListItem
                key={item.medicine.registered_name}
                style={{ flex: 1, width: '100%' }}
                title={item.medicine.registered_name}
                subtitle={item.medicine.license_holder}
              />
            ))
          }
        </List>
      </ScrollView >
    );
  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 30
  }
})