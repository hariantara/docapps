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
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import logo from '../static/cardiogram.png'
import {
    StackNavigator,
} from 'react-navigation';

import {
    Card,
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

import moment from 'moment'

export default (props) => {
    return (
        <Wrapper {...props} />
    )
}

class BookDetail extends Component {
    constructor(props){
        super(props)
        this.state = {
            detail: []
        }
    }

    componentDidMount() {
        if (!this.props.data.loading) {
            let { data } = this.props
            if (data) {
                let { getDetailBookApp } = data
                if (getDetailBookApp) {
                    let { booking } = getDetailBookApp
                    if (booking) {
                        // let detaiData = []
                        // detailData.push(booking)
                        this.setState({
                            detail: [booking]
                        })
                    }
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.data.loading) {
            let { data } = nextProps
            if (data) {
                let { getDetailBookApp } = data
                if (getDetailBookApp) {
                    let { booking } = getDetailBookApp
                    if (booking) {
                        // let detaiData = []
                        // detailData.push(booking)
                        this.setState({
                            detail: [booking]
                        })
                    }
                }
            }
        }
    }

    accept = async () => {
        let book_id = parseInt(this.props.navigation.state.params.params)
        let resp = "accept"
        let response = await this.props.doctorResponseBooking(book_id, resp)
        console.log('response: ', response)
        if(response.data.doctorResponseBooking.error == null){
            this.props.navigation.navigate('Home')
            Alert.alert('Response Successfuly Sent')
            // let {client} = this.props
            // let refetchQueries = await client.query({
            //     query: Queries.getDetailBookApp,
            //     fetchPolicy: "network-only",
            //     ssr: false
            // })
            // console.log('refetchQueries: ', refetchQueries)
            // let updatedData = response.data.doctorResponseBooking.booking
            // this.setState({
            //     detail: updatedData
            // })
            
        }else{
            Alert.alert('Failed to response')
        }
    }

    decline = async () => {
        let book_id = parseInt(this.props.navigation.state.params.params)
        let resp = "decline"
        let response = await this.props.doctorResponseBooking(book_id, resp)
        console.log('response: ', response)
        if (response.data.doctorResponseBooking.error == null) {
            this.props.navigation.navigate('Home')
            Alert.alert('Response Successfuly Sent')
            // let refetchQueries = await client.query({
            //     query: Queries.getDetailBookApp,
            //     fetchPolicy: "network-only",
            //     ssr: false
            // })
            // console.log('refetchQueries: ', refetchQueries)
            // let updatedData = response.data.doctorResponseBooking.booking
            // this.setState({
            //     detail: updatedData
            // })
            
        } else{
            Alert.alert('Failed to response')
        }
    }

    render(){
        console.log('Book Detail props: ', this.props)
        console.log('Book Detail state: ', this.state)
        if (this.props.data.loading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#00000f"></ActivityIndicator>
                </View>
            )
        }
        return(
            <View>
                {
                    this.state.detail.map(data=>{
                        return(
                            <View key={String(data.id)}>
                                <Card>
                                    <Text style={{fontSize: 30, textAlign: 'center'}}>Booking Detail</Text>
                                    <Text style={{marginTop: 40}}>{`Book ID: ${data.book_id}`}</Text>
                                    <Text style={{ marginTop: 10 }}>{`Patient Name: ${data.patient_name}`}</Text>
                                    <Text style={{ marginTop: 10 }}>{`Appointment Time: ${moment(data.time).format('HH:mm DDD/MMM/YYYY')}`}</Text>
                                    <Text style={{ marginTop: 10 }}>{`Symptom: ${data.symptom}`}</Text>
                                </Card>
                            </View>
                        )
                    })
                }
                <View>
                    {
                        this.state.detail.map(data => {
                            return(
                                <View key={String(data.id)}>
                                    {
                                        data.status === "request" ?
                                        <View>
                                                <View style={{ marginTop: 30 }}>
                                                    <Button
                                                        backgroundColor="green"
                                                        title="Accept"
                                                        onPress={this.accept}
                                                    />
                                                </View>
                                                <View style={{ marginTop: 30 }}>
                                                    <Button
                                                        backgroundColor="red"
                                                        title="Decline"
                                                        onPress={this.decline}
                                                    />
                                                </View>
                                        </View> : 
                                        <View>
                                                <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>{`You Already Responsed with ${data.status}`}</Text>
                                                <View style={{ marginTop: 30 }}>
                                                    <Button
                                                        disabled
                                                        backgroundColor="green"
                                                        title="Accept"
                                                    />
                                                </View>
                                                <View style={{ marginTop: 30 }}>
                                                    <Button
                                                        disabled
                                                        backgroundColor="red"
                                                        title="Decline"
                                                    />
                                                </View>
                                        </View>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

let Queries = {
    getDetailBookApp: gql`
        query getDetailBookApp (
            $book_id: Int
        ){
            getDetailBookApp(book_id: $book_id){
                booking{
                    id, 
                    book_id
                    clinic_id
                    patient_id
                    patient_name
                    patient_photo
                    doctor_id
                    doctor_name
                    doctor_photo
                    symptom
                    time
                    status
                    created_at
                    updated_at
                    deleted_at
                },
                    error
            }
        }
    `
}

let Mutations = {
    doctorResponseBooking: gql`
        mutation doctorResponseBooking (
            $book_id: Int
            $response: String
        ){
            doctorResponseBooking(book_id: $book_id, response: $response){
                booking{
                    id,
                    book_id,
                    clinic_id,
                    patient_id,
                    doctor_id,
                    symptom,
                    time,
                    status,
                    created_at,
                    updated_at,
                    deleted_at
                },
                error
            }
        }
    `
}

let Wrapper = compose(
    graphql(Queries.getDetailBookApp, {
        options: props => {
            return {
                variables: { book_id: parseInt(props.navigation.state.params.params) },
                fetchPolicy: "cache-and-network",
                ssr: false
            }
        }
    }),
    graphql(Mutations.doctorResponseBooking,{
        props: ({mutate}) => ({
            doctorResponseBooking: (book_id, response) => {
                return mutate({
                    variables: {
                        book_id,
                        response
                    },
                    refetchQueries:[{
                        query: Queries.getDetailBookApp
                    }]
                })
            }
        })
    }),
    withApollo
)(BookDetail)