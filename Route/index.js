import React, { Component } from 'react'

import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';

import Login from '../screen/Login'
import Home from '../screen/Home'
import BookDetail from '../component/BookDetail'
import DetailProfile from '../component/DetailProfile';

const Navigations = StackNavigator({
    Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
            title: 'Login',
        }),
    },
    Home: TabNavigator({
        Home: StackNavigator({
            Home: {
                screen: Home,
                navigationOptions: ({ navigation }) => ({
                    title: 'Home',
                }),
            },
            BookDetail: {
                screen: BookDetail,
                navigationOptions: ({ navigation }) => ({
                    title: 'Detail',
                }),
            }
        },{
                headerMode: 'none',
                navigationOptions: {
                    headerVisible: false,
                },
                initialRouteName: 'Home'
        }),
        Signout: {
            screen: DetailProfile,
            navigationOptions: ({ navigation }) => ({
                title: 'Sign Out',
            }),
        }
    })
}, {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        initialRouteName: 'Login'
    })

export default Navigations