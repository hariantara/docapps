/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
import env from './shared/environment'

import { AsyncStorage } from "react-native"
import { ApolloProvider } from 'react-apollo'
import { HttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split, from, concat } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// const httpLink = createHttpLink({ uri: "http://localhost:3000/api/graphql" });
const httpLink = new HttpLink({ uri: env.graphqlURL });

// const authMiddleware = new ApolloLink((operation, forward) => {
//   operation.setContext(({headers}) => {
//     console.log("Headers >>>> ", headers)
//   });
//   return forward(operation);
// })

const authMiddleware = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('shinchan')
  console.log('FUCK: ', token)
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : null,
      authorization: token || null,
    }
  }
})


const wsLink = new WebSocketLink({
  uri: env.graphqlSubs,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: AsyncStorage.getItem('authorization'),
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authMiddleware.concat(httpLink)
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

// import Login from '../doctor/screen/Login'

import Navigations from './Route'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notification: {}
    }
  }

  async componentDidMount() {
    console.log('PROPS APP DID MOUNT: ', this.props)
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification: Notification = notificationOpen.notification;
      console.log('notification: --->>>', notification)
      var seen = [];
      alert(JSON.stringify(notification.data, function (key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
    }
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      // Process your notification as required
      notification
        .android.setChannelId('test-channel')
        .android.setSmallIcon('ic_launcher');
      firebase.notifications()
        .displayNotification(notification);

    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      this.setState({ notification: notification.data })
      var seen = [];
      // alert(JSON.stringify(notification.data, function (key, val) {
      //   if (val != null && typeof val == "object") {
      //     if (seen.indexOf(val) >= 0) {
      //       return;
      //     }
      //     seen.push(val);
      //   }
      //   return val;
      // }));
      firebase.notifications().removeDeliveredNotification(notification.notificationId);

    });
  }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    console.log('this.props >>>>', this.props)
    console.log('state app: ', this.state)
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Navigations />
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export default App
