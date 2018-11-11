import React, { Component } from 'react';
import {
  AppRegistry,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  Image
} from 'react-native';

export default class AuthSelectionsScreen extends Component {
  static navigationOptions = {
    header: null
  };
  login = () => {
    this.props.navigation.navigate('SignIn');
  };
  register = () => {
    this.props.navigation.navigate('SignUp');
  };
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Button title="Show me more of the app" onPress={this.login} />
        <Button title="Actually, sign me out :)" onPress={this.register} />
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
  logo: {
    paddingTop: 10,
    alignSelf: 'center'
  }
});
