/**
 * Created by jeonghyunlee on 2017. 7. 13..
 */
import React, {Component} from 'react';
import Button from 'react-native-button';


import {
    Text,
    TextInput,
    AppRegistry,
    View,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    StatusBar,
    AsyncStorage
} from 'react-native';


import main from '../main'


const ACCESS_TOKEN = 'access_token';



export default class Login extends Component {


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
        AsyncStorage.setItem(ACCESS_TOKEN, responseData, (err)=> {
            if(err){
                console.log("an error");
                throw err;
            }
            console.log("success");
        }).catch((err)=> {
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
                    session:{
                        email: this.state.email,
                        password: this.state.password,
                    }
                })
            });
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                //Handle success
                let accessToken = res;
                console.log(accessToken);
                //On success we will store the access_token in the AsyncStorage
                this.storeToken(accessToken);

            } else {
                //Handle error
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
                    onPress={ this._navigateToMain}
                    containerStyle={{padding:20, overflow:'hidden', borderRadius:5, backgroundColor: '#FFC305', marginLeft:25, marginRight:25,}}
                    style={{fontSize: 15, color: 'black', fontWeight:'100', letterSpacing:3 }}>

                    SIGN IN
                </Button>

                <Button
                    onPress={() => navigate('Register')}
                    style={{fontSize: 10, color: 'black', padding: 20, letterSpacing: 3}}>
                    SIGN UP
                </Button>
                <Button

                    style={{fontSize: 10, color: 'black', padding:20, letterSpacing:3}}
                    styleDisabled={{color: 'red'}}>
                    FORGOT YOUR PASSWORD?
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