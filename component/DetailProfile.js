import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    FlatList,
    TouchableHighlight
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
    List,
    FormLabel,
    FormInput,
    SocialIcon,
    SearchBar,
    Icon,
    Avatar,
    Button,
    FormValidationMessage
} from 'react-native-elements'

const list = [
    {
        id: 2,
        name: 'Sign Out',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman'
    },
]


export default (props) => {
    return (
        <Wrapper {...props} />
    )
}

class ProfileComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    removeItemValue = async () => {
        try {
            await AsyncStorage.removeItem('token');
            return true

        }
        catch (exception) {
            return false;
        }
    }

    detailProfile = (e) => {
        console.log('e >>> ', e)
        try {
            if (e === 'Detail Profile') {
                this.props.navigation.navigate('DetailProfile')
            } else {
                this.removeItemValue()
                this.props.navigation.navigate('Login')
            }
        } catch (err) {
            console.log(err)
        }
    }
    render() {
        console.log('Props Profile Component: ', this.props)
        return (
            <View>
                <FlatList
                    data={list}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => {
                        return (
                            <TouchableHighlight onPress={() => this.detailProfile(item.name)}>
                                <View>
                                    <ListItem
                                        title={item.name}
                                    />
                                </View>
                            </TouchableHighlight>
                        )
                    }}
                />
            </View>
        )
    }
}

let Wrapper = compose(
    withApollo
)(ProfileComponent)