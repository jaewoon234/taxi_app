import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // 내비게이션 사용을 위해 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
const serviceMessages = [
  '편리한 호출 시스템',
  '안전한 탑승 경험',
  '빠르고 정확한 서비스',
  '저렴한 요금제 제공',
];

function ServiceIntro(): JSX.Element {
  const navigation = useNavigation(); // 내비게이션 훅 사용
  const [messageIndex, setMessageIndex] = useState(0);
  const [greeting, setGreeting] = useState(
    '택시 서비스에 오신 것을 환영합니다!',
  );

  useEffect(() => {
    AsyncStorage.getItem('userId').then(userId => {
      if (userId) {
        setGreeting(`${userId}님 환영합니다.`);
      }
    });
  }, []);

  useEffect(() => {
    if (messageIndex < serviceMessages.length) {
      const interval = setInterval(() => {
        setMessageIndex(prevIndex => prevIndex + 1);
      }, 1000); // 1초마다 문구 변경
      return () => clearInterval(interval);
    } else {
      // 모든 문구를 다 보여준 후 로그인 화면으로 이동
      navigation.navigate('Login');
    }
  }, [messageIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{greeting}</Text>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {serviceMessages[messageIndex] ||
            serviceMessages[serviceMessages.length - 1]}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  messageContainer: {
    marginTop: 20,
  },
  messageText: {
    fontSize: 24,
    color: '#3498db',
  },
});

export default ServiceIntro;
