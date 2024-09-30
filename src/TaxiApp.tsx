import {SafeAreaView, StyleSheet, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Intro from './Intro';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import NickNameScreen from './Main_Setting_NickName';
import Server from 'metro/src/Server';
import ServiceIntro from './ServiceIntro';
import React from 'react';

messaging().setBackgroundMessageHandler( async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage)
})

function TaxiApp(): JSX.Element {
  console.log('-- TaxiApp()');

  const Stack = createStackNavigator();

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken()
    await AsyncStorage.setItem("fcmToken", fcmToken)
    console.log(">> fcmToken = " + fcmToken)
  }

  useEffect( ()=> {
    getFcmToken()
    messaging().onMessage( remoteMessage => {
      console.log('[Remote Message]', JSON.stringify(remoteMessage))
      let title=""
      let body=""

      if (remoteMessage.notification && remoteMessage.notification.title) {
        title = remoteMessage.notification.title
      }

      if(remoteMessage.notification && remoteMessage.notification.body){
        body = remoteMessage.notification.body 
      }

      if (remoteMessage) {
        Alert.alert(title, body, [{text:"확인", style:'cancel'}])
      }
    })
  })
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: true, title: '회원가입'}}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NickName"
          component={NickNameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceIntro"
          component={ServiceIntro}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default TaxiApp;
