import React from 'react';
import {
  AppRegistry,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage
} from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import Colors from '../constants/Colors';

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
  }
  static navigationOptions = {
    header: null
  };
  register = async () => {
    const { name, email, password } = this.state;
    const data = { name, email, password };
    axios.post('https://painpoint.herokuapp.com/api/register', data)
      .then(async (resp) => {
        await AsyncStorage.setItem('user', JSON.stringify(resp.data.user));
        this.props.navigation.navigate('Main');
      })
  };
  setName = (name) => {
    this.setState({ name })
  }
  setEmail = (email) => {
    this.setState({ email })
  }
  setPassword = (password) => {
    this.setState({ password })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
            onChangeText={this.setName}
            value={this.state.name}
            placeholder={"Full name"}
          />
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
            onChangeText={this.setEmail}
            value={this.state.email}
            placeholder={"Email"}
          />
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
            onChangeText={this.setPassword}
            value={this.state.password}
            placeholder={"Password"}
            secureTextEntry={true}
          />
          <Button title="SIGN UP" large backgroundColor={Colors.tintColor} style={{ marginBottom: 10 }} borderRadius={30} onPress={this.register} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  innerContainer: {
    width: 300,
    flex: 1,
    alignSelf: 'center'
  },
  logo: {
    paddingTop: 10,
    alignSelf: 'center'
  }
});
