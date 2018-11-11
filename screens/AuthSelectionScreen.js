import React, { Component } from 'react';
import {
  AppRegistry,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';

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
        <View style={styles.innerContainer}>
          <View style={styles.topView}>
            <Image source={require('../assets/images/icon.png')} style={styles.logo} />
          </View>
          <View style={styles.bottomView}>
            <Button title="SIGN IN" large backgroundColor={Colors.tintColor} style={{ marginBottom: 10 }} borderRadius={30} onPress={this.login} />
            <Button title="SIGN UP" large backgroundColor={Colors.tintColor} style={{ marginBottom: 10 }} borderRadius={30} onPress={this.register} />
          </View>
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
  topView: {
    flex: 1,
  },
  bottomView: {
    flex: 1,
  },
  logo: {
    paddingTop: 10,
    paddingBottom: 20,
    alignSelf: 'center'
  }
});
