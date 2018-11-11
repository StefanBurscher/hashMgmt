import React from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import { FaceDetector, Camera, Permissions, Icon, Constants } from 'expo';
import axios from 'axios';
import StyledText from '../components/StyledText';
import Colors from '../constants/Colors';

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    processing: false,
    recording: false,
    loading: false,
    faces: []
  };

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  record = async () => {
    if (this.camera) {
      this.setState({ recording: true });
      const { uri, codec = "mp4" } = await this.camera.recordAsync({
        maxDuration: 3
      });
      Alert.alert('Notifications',
        `Your video is processing...`,
        [
          { text: 'Ok' }
        ],
        { cancelable: true }
      )
      this.setState({ recording: false, processing: true, loading: true });
      const type = `video/${codec}`;

      const data = new FormData();
      data.append("video", {
        name: "mobile-video-upload",
        type,
        uri
      });
      axios.post('http://1a98c01b.eu.ngrok.io', data)
        .then(async (resp) => {
          const patientData = await AsyncStorage.getItem('patient');
          const patient = JSON.parse(patientData);
          axios.post('https://painpoint.herokuapp.com/api/add-pain', { patient_id: patient.id, scale: resp.data })
            .then((resp1) => {
              Alert.alert('Pain scale',
                `Patients pain scale is ${resp.data}!`,
                [
                  { text: 'Therapy', onPress: () => this.props.navigation.navigate('Therapy') },
                  { text: 'Chart', onPress: () => this.props.navigation.navigate('Chart') },
                ],
                { cancelable: true }
              )
            })
        })
        .catch((err) => {
          console.log(err);
        })

      this.setState({ processing: false, loading: false });
    }
  };

  renderFaces = () =>
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  renderFace(obj) {
    return (
      <View
        key={obj.faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${obj.rollAngle.toFixed(0)}deg` },
          { rotateY: `${obj.yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...obj.bounds.size,
            left: obj.bounds.origin.x,
            top: obj.bounds.origin.y,
          },
        ]}>
      </View>
    );
  }

  handleFacesDetected = (obj) => {
    if (obj.faces.length > 0) {
      this.setState({ faces: obj.faces });
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <StyledText>No access to camera</StyledText>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => { this.camera = ref; }}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Mode.all,
              runClassifications: FaceDetector.Constants.Mode.none,
            }}
            onFacesDetected={this.handleFacesDetected}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              {this.state.loading &&
                <View style={styles.loading}>
                  <ActivityIndicator size='large' style={{ alignSelf: 'center', justifyContent: 'center' }} color={'red'} />
                </View>
              }
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={this.record}>
                {this.state.loading &&
                  <View style={styles.loading}>
                    <ActivityIndicator size='large' />
                  </View>
                }
                <Icon.Ionicons
                  size={32}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-videocam'
                      : 'md-videocam'
                  }
                  color={"#fff"}
                  style={{ marginBottom: 15 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'flex-start',
                  position: 'absolute'
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Icon.Ionicons
                  size={32}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-reverse-camera'
                      : 'md-reverse-camera'
                  }
                  color={"#fff"}
                  style={{ marginBottom: 15, marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </Camera>
          {this.state.faces.length ? this.renderFaces() : undefined}
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight + 1,
  },
  bottomBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  face: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 1,
    position: 'absolute',
    borderColor: '#808000',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  faceText: {
    color: '#32CD32',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  textcolor: {
    color: '#008080',
  },
  loading: {
    position: 'absolute',
    flex: 1,
    width: 50,
    height: 50,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
