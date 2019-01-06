import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import logo from '../static/cardiogram.png'
import {
    StackNavigator,
} from 'react-navigation';

import {
    PricingCard,
    ListItem,
    FormLabel,
    FormInput,
    SocialIcon,
    SearchBar,
    Icon,
    Avatar,
    Button,
    FormValidationMessage
} from 'react-native-elements'


export default (props) => {
    return (
        <Wrapper {...props} />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginForm: {
        paddingLeft: 90,
        marginTop: 50
    },
    Avatar: {
        paddingLeft: 100,
        paddingTop: 80
    },
    Button: {
        paddingTop: 40,
        paddingRight: 90,
        paddingLeft: 90
    }
});

class LoginComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
        };
    }

    username = (e) => {
        console.log('e: ', e)
        this.setState({
            username: e
        })
    }

    password = (e) => {
        console.log('e pass: ', e)
        this.setState({
            password: e
        })
    }

    _storage = async (key, value) => {
        try {
            await AsyncStorage.setItem("shinchan", value);
            return true
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }

    onLogin = async () => {
        let {
            username,
            password
        } = this.state
        try {
            if (username === '' || password === '') {
                Alert.alert('Please fill the form')
            } else {
                let input = {
                    username,
                    password
                }

                let login = await this.props.patientLogin(input)
                console.log('login: ', login)

                if (login.data.patientLogin.error === null && login.data.patientLogin.role === 1) {
                    let token = login.data.patientLogin.token
                    console.log('token>>> ', token)
                    await this._storage('authorization', String(token))
                    this.props.navigation.navigate('Home')
                } else {
                    Alert.alert('Wrong Combination, May you check again')
                }
            }
        } catch (err) {
            console.log('err: ', err)
        }
    }

    render() {
        console.log('Props: Login Component: ', this.props)
        const { navigate } = this.props.navigation
        return (
            <ScrollView>
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <View style={styles.container}>
                        <View style={styles.Avatar}>
                            <Avatar
                                xlarge
                                rounded
                                source={logo}
                                activeOpacity={0.7}
                            />
                        </View>
                        <View style={styles.loginForm}>
                            <FormLabel>Username</FormLabel>
                            <FormInput
                                placeholder='type username here . . .'
                                onChangeText={this.username}
                            />
                            <FormLabel>Password</FormLabel>
                            <FormInput
                                secureTextEntry={true}
                                placeholder='type password here . . .'
                                onChangeText={this.password}
                            />
                        </View>
                        <View style={styles.Button}>
                            {/* <TouchableOpacity onPress={this.onLogin}> */}
                            <Button
                                title='LOGIN'
                                onPress={this.onLogin}
                            />
                            {/* </TouchableOpacity> */}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

let Mutations = {
    patientLogin: gql`
        mutation patientLogin(
            $input: patientLogin
        ){
            patientLogin(input: $input){
                token,
                role,
                error
            }
        }
    `
}

let Wrapper = compose(
    graphql(Mutations.patientLogin, {
        props: ({ mutate }) => ({
            patientLogin: (input) => {
                return mutate({
                    variables: {
                        input
                    }
                })
            }
        })
    }),
    withApollo
)(LoginComponent)