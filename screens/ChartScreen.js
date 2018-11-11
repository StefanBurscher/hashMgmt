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
      search: '',
      drugList: [],
      timer: null
    };
    this.timeout = null;
  }
  componentDidMount = () => {
    axios.get('https://painpoint.herokuapp.com/api/medicines')
      .then((resp) => {
        let drugList = [];
        for (let i = 0; i < resp.data.medicines.length; i++) {
          const element = resp.data.medicines[i];
          drugList.push({
            ...element,
            title: element.id + ' ' + element.full_name,
            icon: 'face'
          })
        }
        this.setState({ drugList });
      })
      .catch((err) => {
        console.log(err);
      })
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  search = (query) => {
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        console.log(query)
        axios.get('https://painpoint.herokuapp.com/api/medicines?search=' + query)
          .then((resp) => {
            let drugList = [];
            for (let i = 0; i < resp.data.medicines.length; i++) {
              const element = resp.data.medicines[i];
              drugList.push({
                ...element,
                icon: 'face'
              })
            }
            this.setState({ drugList });
          })
          .catch((err) => {
            console.log(err);
          })
      }, 500)
    });
  }
  addPatient = async () => {
    const { full_name } = this.state;
    axios.post('https://painpoint.herokuapp.com/api/add-patient', { full_name })
      .then(async (resp) => {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        axios.post('https://painpoint.herokuapp.com/api/assign-patient', { patient_id: resp.data.patient.id, user_id: user.id })
          .then((resp) => {
            this.props.navigation.navigate('Home');
          })
          .catch((err) => {
            console.log(err);
          })
      })
  };
  selectDrug = async (drug) => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);
    const patientData = await AsyncStorage.getItem('patient');
    const patient = JSON.parse(patientData);
    console.log({ patient_id: patient.id, medicine_id: drug.id })
    axios.post('https://painpoint.herokuapp.com/api/add-therapy', { patient_id: patient.id, medicine_id: drug.id })
      .then((resp) => {

      })
      .catch((err) => {

      })
    this.props.navigation.navigate('Home');
  }
  render() {
    const list = this.state.drugList;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={this.search}
            value={this.state.name}
            placeholder={"Full name"}
          />
        </View>
        <List style={{ flex: 1, width: '100%' }}>
          {
            list.map((item) => (
              <TouchableOpacity key={item.title} onPress={() => this.selectDrug(item)}>
                <ListItem
                  style={{ flex: 1, width: '100%' }}
                  title={item.registered_name}
                  subtitle={item.license_holder}
                  leftIcon={{ name: item.icon }}
                />
              </TouchableOpacity>
            ))
          }
        </List>
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
