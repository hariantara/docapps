import React, {Component} from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import LoginComponent from '../component/LoginComponent'

export default (props) => {
    return (
        <Wrapper {...props} />
    )
}

class Login extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log('props: Screen', this.props)
        return (
            <View>
                <LoginComponent navigation={this.props.navigation}/>
            </View>
        )
    }
}

let Wrapper = compose(
    withApollo
)(Login)