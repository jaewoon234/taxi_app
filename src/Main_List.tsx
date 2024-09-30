import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from './API';
import messaging from '@react-native-firebase/messaging';

function Main_List(): JSX.Element {
  const [callList, setCallList] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      requestCallList();
    }, []),
  );

  const requestCallList = async () => {
    setLoading(true);
    let userId = (await AsyncStorage.getItem('userId')) || '';

    api
      .list(userId)
      .then(response => {
        let {code, message, data} = response.data[0];
        if (code == 0) {
          setCallList(data);
        } else {
          Alert.alert('오류', message, [
            {
              text: '확인',
              onPress: () => console.log('cancel pressed'),
              style: 'cancel',
            },
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        setLoading(false);
      });
  };

  // const loadNewCall = async () => {
  //   setLoading(true);
  //   try {
  //     const storedCallInfo = await AsyncStorage.getItem('callInfo');
  //     if (storedCallInfo !== null) {
  //       const {departure, destination} = JSON.parse(storedCallInfo);
  //       const newCall = {
  //         id: callList.length, // 새로운 ID 생성
  //         start_addr: departure,
  //         end_addr: destination,
  //         call_state: 'REG',
  //       };

  //       // 이전 리스트에 새로운 호출 추가
  //       setCallList(prevList => [...prevList, newCall]);

  //       // 데이터가 추가된 후 AsyncStorage에서 항목 삭제
  //       await AsyncStorage.removeItem('callInfo');
  //     }
  //   } catch (error) {
  //     console.error('Error loading data from AsyncStorage:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.headerText, {width: wp(80)}]}>
          출발지 / 도착지
        </Text>
        <Text style={[styles.headerText, {width: wp(20)}]}>상태</Text>
      </View>
    );
  };

  const ListItem = (row: any) => {
    console.log('row = ' + JSON.stringify(row));

    return (
      <View style={{flexDirection: 'row', marginBottom: 5, width: wp(100)}}>
        <View style={{width: wp(80)}}>
          <Text style={styles.textForm}>{row.item.start_addr}</Text>
          <Text style={[styles.textForm, {borderTopWidth: 0}]}>
            {row.item.end_addr}
          </Text>
          <Text style={styles.textForm}>{row.item.formatted_time}</Text>
        </View>
        <View
          style={{
            width: wp(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {row.item.call_state == 'RES' ? (
            <Text style={{color: 'blue'}}>{row.item.call_state}</Text>
          ) : (
            <Text style={{color: 'gray'}}>{row.item.call_state}</Text>
          )}
          <Text>{row.call_state}</Text>
        </View>
      </View>
    );
  };
  useEffect(() => {
    const message = messaging().onMessage(remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
      requestCallList();
    });

    return message;
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{flex: 1}}
        data={callList}
        ListHeaderComponent={Header}
        renderItem={ListItem}
        keyExtractor={(item: any) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={requestCallList} />
        }
      />

      <Modal transparent={true} visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="spinner" size={50} color={'#3498db'} />
          <Text style={{color: 'black'}}>Loading...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 5,
    backgroundColor: '#3498db',
    color: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  textForm: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498db',
    height: hp(5),
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default Main_List;
