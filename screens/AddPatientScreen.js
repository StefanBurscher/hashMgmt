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
import Colors from '../constants/Colors';

export default class AddPatientScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            full_name: '',
            patients: []
        };
    }
    static navigationOptions = {
        header: null
    };
    componentDidMount = () => {
        axios.get('https://painpoint.herokuapp.com/api/patients')
            .then((resp) => {
                let patients = [];
                for (let i = 0; i < resp.data.patients.length; i++) {
                    const element = resp.data.patients[i];
                    patients.push({
                        ...element,
                        title: element.id + ' ' + element.full_name,
                        icon: 'face'
                    })
                }
                this.setState({ patients });
            })
            .catch((err) => {
                console.log(err);
            })
    }
    addPatient = async () => {
        const { full_name } = this.state;
        axios.post('https://painpoint.herokuapp.com/api/add-patient', { full_name })
            .then(async (resp) => {
                const userData = await AsyncStorage.getItem('user');
                const user = JSON.parse(userData);
                axios.post('https://painpoint.herokuapp.com/api/assign-patient', { patient_id: resp.data.patient.id, user_id: user.id })
                    .then(async (resp) => {
                        console.log(resp)
                        await AsyncStorage.setItem('patient', JSON.stringify( resp.data.patient));
                        this.props.navigation.navigate('Home');
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
    };
    addSelectedPat = async (patient) => {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        axios.post('https://painpoint.herokuapp.com/api/assign-patient', { patient_id: patient.id, user_id: user.id })
            .then(async (resp) => {
                console.log(resp)
                await AsyncStorage.setItem('patient', JSON.stringify(patient));
                this.props.navigation.navigate('Home');
            })
            .catch((err) => {
                console.log(err);
            })
    }
    setName = (full_name) => {
        this.setState({ full_name })
    }
    render() {
        const list = this.state.patients;
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <Image source={require('../assets/images/icon.png')} style={styles.logo} />
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10 }}
                            onChangeText={this.setName}
                            value={this.state.name}
                            placeholder={"Full name"}
                        />
                    </View>
                    <Button title="Add patient" large backgroundColor={Colors.tintColor} style={{ marginTop: 15 }} borderRadius={30} onPress={this.addPatient} />
                </View>
                <List style={{ flex: 1, width: '100%' }}>
                    {
                        list.map((item) => (
                            <TouchableOpacity key={item.title} onPress={() => this.addSelectedPat(item)}>
                                <ListItem
                                    style={{ flex: 1, width: '100%' }}
                                    title={item.title}
                                    subtitle={item.subtitle}
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
