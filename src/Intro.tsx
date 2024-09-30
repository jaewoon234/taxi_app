import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Intro(): JSX.Element {
  console.log('-- Intro()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [message, setMessage] = useState<string>('서비스 준비 중...');

  // 서비스 소개 문구 리스트
  const serviceMessages = [
    '안전한 서비스 제공을 약속드립니다.',
    '편리한 예약 시스템을 이용해보세요!',
    '친절한 기사님과 함께하는 여행.',
    '신속하고 정확한 차량 배차 서비스.',
    '24시간 언제든지 이용 가능한 서비스!',
  ];

  useFocusEffect(
    React.useCallback(() => {
      // 1초마다 랜덤 문구 업데이트
      const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * serviceMessages.length);
        setMessage(serviceMessages[randomIndex]);
      }, 1000);

      // 5초 후 자동 로그인 여부 확인 및 화면 이동
      const timeoutId = setTimeout(async () => {
        let userId = await AsyncStorage.getItem('userId');
        let isAutoLogin = userId ? true : false;

        if (isAutoLogin) {
          navigation.push('Main');
        } else {
          navigation.push('Login');
        }
        clearInterval(intervalId); // 타이머 클리어
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="taxi" size={100} color={'#3498db'} />
      </View>
      {/* 문구를 화면 하단에 위치 */}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // 아이콘과 문구를 위아래로 배치
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center', // 아이콘을 중앙에 배치
  },
  messageContainer: {
    paddingBottom: 20, // 하단 여백 추가
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});

export default Intro;
