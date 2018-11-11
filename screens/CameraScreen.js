import React from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet, AsyncStorage } from 'react-native';
import { FaceDetector, Camera, Permissions, Icon, Constants } from 'expo';
import axios from 'axios';

export default class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    processing: false,
    recording: false,
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
      this.setState({ recording: false, processing: true });
      const type = `video/${codec}`;

      const data = new FormData();
      data.append("video", {
        name: "mobile-video-upload",
        type,
        uri
      });
      axios.post('http://172.20.10.5:5000/', data)
        .then(async (resp) => {
          const patientData = await AsyncStorage.getItem('patient');
          const patient = JSON.parse(patientData);
          console.log({ patient_id: patient.id, scale: resp.data });
          axios.post('https://painpoint.herokuapp.com/api/add-pain', { patient_id: patient.id, scale: resp.data })
        })
        .catch((err) => {
          console.log(err);
        })

      this.setState({ processing: false });
    }
  };

  renderFaces = () =>
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  renderFace(obj) {
    console.log(obj);
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

  // handleFacesDetected = ({ faces }) => {
  //   if (faces.length > 0) {
  //     this.setState({ faces });
  //   }
  // };

  handleFacesDetected = (obj) => {
    if (obj.faces.length > 0) {
      this.setState({ faces: obj.faces });
    }
    console.log(obj)
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
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
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={this.record}>
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
  }
});
