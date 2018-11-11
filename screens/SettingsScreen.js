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
    title: 'Profile',
  };

  componentDidMount = async () => {
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    this.setState({ patient });
    axios.get('https://painpoint.herokuapp.com/api/pain-history?patient_id=' + patient.id)
      .then((resp) => {
        let pains = [];
        for (let i = 0; i < resp.data["pain-history"].length; i++) {
          const element = resp.data["pain-history"][i];
          pains.push({
            ...element,
            title: element.created_at + ' Pain level: ' + element.scale,
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
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 3, borderWidth: 1, borderRadius: 10, marginRight: 10, paddingTop: 10, backgroundColor: Colors.tintColor }}>
              <Icon.Ionicons
                size={50}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-contact'
                    : 'md-contact'
                }
                color={"#fff"}
                style={{ textAlign: 'center' }} />
              <Text style={{ marginBottom: 10, textAlign: 'center', color: '#fff' }}>
                {patient.full_name}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', alignSelf: 'flex-end' }}>
              <TouchableOpacity onPress={this._signOutAsync} style={{ borderWidth: 1, flex: 1, borderRadius: 10, padding: 10, width: 80, backgroundColor: '#dc3939' }}>
                <Icon.Ionicons
                  size={50}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-power'
                      : 'md-power'
                  }
                  color={"#000"}
                  style={{ textAlign: 'center' }} />
                <Text style={{ textAlign: 'center' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
        <ScrollView style={styles.container}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
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
                <StyledText style={{ color: '#fff' }}>Pain Activity</StyledText>
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
                <StyledText>Medic Activity</StyledText>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView >

        <List style={{ flex: 1, width: '100%' }}>
          {
            pains.map((item) => (
              <ListItem
                key={item.title}
                style={{ flex: 1, width: '100%' }}
                title={item.title}
                subtitle={item.subtitle}
                leftIcon={{ name: item.icon }}
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