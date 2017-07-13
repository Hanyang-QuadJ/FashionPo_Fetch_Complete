/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    Text,
    View,
    Button,
    TextInput,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    StatusBar,
    AsyncStorage
} from 'react-native';
import {StackNavigator} from 'react-navigation';

class ChatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: ""
        };
    }

    static navigationOptions = {
        title: 'Chat with Lucy',
    };

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            fetch('http://54.162.160.91/api/user/authed', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': value
                },
            })
                .then((response) => response.json())
                .then(responseData => {
                    this.setState({
                        user: responseData.user[0]
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        })


    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    render() {
        return (
            <View>
                <Text>메일 : {this.state.user.email}</Text>
                <Text>이름 : {this.state.user.username}</Text>
                <Text>비번 : {this.state.user.password}</Text>
                <Text>했다 시발</Text>
            </View>
        );
    }
}

class HomeScreen extends React.Component {
    static navigationOptions = {};




    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            errors:'',
            showProgress:false,
        };
    }

    storeToken(responseData){
        AsyncStorage.setItem("token", responseData, (err)=> {
            if(err){
                console.log("an error");
                throw err;
            }
            console.log("success");
        })
            .then(this.props.navigation.navigate('Chat'))
            .catch((err)=> {
            console.log("error is: " + err);
        });
    }

    async onLoginPressed() {
        this.setState({showProgress: true})
        try {
            let response = await fetch('http://54.162.160.91/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                        email: this.state.email,
                        password: this.state.password,

                })
            });
            let res = await response.json();
            if (response.status >= 200 && response.status < 300) {
                //Handle success
                let accessToken = res.token;
                console.log(accessToken);
                //On success we will store the access_token in the AsyncStorage
                this.storeToken(accessToken);

            } else {

                let error = res;
                throw error;
            }
        } catch(error) {
            this.setState({error: error});
            console.log("error " + error);
            this.setState({showProgress: false});
        }
    }

    render() {


        const { navigate } = this.props.navigation;
        return(

            <KeyboardAvoidingView behavior="padding" style={styles.container}>

                <StatusBar barStyle="dark-content"/>



                <View style={styles.middle}>

                    <Text style={ styles.textHead }>User Email</Text>
                    <TextInput style={ styles.textInput }
                               onChangeText={ (val) => this.setState({email: val}) }
                               value={ this.state.email }
                               placeholder="sample@fit.edu"
                               placeholderTextColor='#a7a7a7'
                               autoCorrect={ false }
                               autoCapitalize='none'
                               keyboardType='email-address'
                               onSubmitEditing={ () => this.passwordInput.focus() }
                               returnKeyType='next'/>
                    <Text>{this.state.email}</Text>
                    <View style={styles.hairline}/>


                    <Text style={ styles.textHead }>Password</Text>
                    <TextInput style={ styles.textInput }
                               onChangeText={ (val) => this.setState({password: val}) }
                               value={ this.state.password }
                               secureTextEntry={ true }
                               autoCorrect={ false }
                               returnKeyType='next'/>
                    <View style={styles.hairline}/>

                </View>
                <Button
                    title="Sign in"
                    onPress={() => this.onLoginPressed()}
                    containerStyle={{padding:20, overflow:'hidden', borderRadius:5, backgroundColor: '#FFC305', marginLeft:25, marginRight:25,}}
                    style={{fontSize: 15, color: 'black', fontWeight:'100', letterSpacing:3 }}>

                    SIGN IN
                </Button>



            </KeyboardAvoidingView>

        );

    }
}

const styles = StyleSheet.create({
    textInput:{
        marginTop: 7,
        height:30,
        fontSize: 18,
        textAlign: 'center',
        paddingBottom:5
    },
    textHead:{
        textAlign: 'center',
        marginTop: 35,
        color: 'black',
    },
    container:{
        flex:1,
    },
    hairline:{
        borderBottomColor: '#c1c1c1',
        borderBottomWidth: .5,
        marginLeft:30,
        marginRight:30,
        marginTop:8,
    },
    button:{
        marginTop:40,
        backgroundColor:'#FFC305',
    },
    logo:{
        flex: .25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middle:{
        flex: .35,
        backgroundColor: 'white',

    }
});



const AwsomeProject5 = StackNavigator({
    Home: {screen: HomeScreen},
    Chat: {screen: ChatScreen},

});




AppRegistry.registerComponent('AwsomeProject5', () => AwsomeProject5);
