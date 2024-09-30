import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import api from './API';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Register(): JSX.Element {
  console.log('-- Register()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userPw2, setUserPw2] = useState('');
  const [secureTextPw, setSecureTextPw] = useState(true); // 첫 번째 비밀번호 가리기 상태
  const [secureTextPw2, setSecureTextPw2] = useState(true); // 두 번째 비밀번호 가리기 상태
  const [iconPw, setIconPw] = useState('eye-slash'); // 첫 번째 비밀번호 눈 아이콘 상태
  const [iconPw2, setIconPw2] = useState('eye-slash'); // 두 번째 비밀번호 눈 아이콘 상태

  const onRegister = async () => {
    let fcmToken = (await AsyncStorage.getItem('fcmToken')) || "";
    api
      .register(userId, userPw, `${fcmToken}`)
      .then(response => {
        let {code, message} = response.data[0];
        let title = '알림';
        if (code == 0) {
          navigation.pop();
        } else {
          title = '오류 ';
        }

        Alert.alert(title, message, [
          {
            text: '확인',
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
        ]);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  const isDisable = () => {
    if (userId && userPw && userPw2 && userPw == userPw2) {
      return false;
    } else {
      return true;
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextPw(!secureTextPw);
    setIconPw(secureTextPw ? 'eye' : 'eye-slash');
  };

  const togglePasswordVisibility2 = () => {
    setSecureTextPw2(!secureTextPw2);
    setIconPw2(secureTextPw2 ? 'eye' : 'eye-slash');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, {justifyContent: 'flex-end'}]}>
        <Icon name="taxi" size={80} color={'#3498db'} />
      </View>
      <View style={[styles.container, {flex: 2}]}>
        <TextInput
          style={styles.input}
          placeholder={'아이디'}
          onChangeText={newId => setUserId(newId)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder={'패스워드'}
            secureTextEntry={secureTextPw}
            onChangeText={newPw => setUserPw(newPw)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon name={iconPw} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder={'패스워드 확인'}
            secureTextEntry={secureTextPw2}
            onChangeText={newPw2 => setUserPw2(newPw2)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility2}>
            <Icon name={iconPw2} size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <TouchableOpacity
          disabled={isDisable()}
          onPress={onRegister}
          style={isDisable() ? styles.buttonDisable : styles.button}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row', // 비밀번호 입력창과 아이콘을 가로로 배치
    width: '70%',
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  inputPassword: {
    flex: 1, // 입력 필드가 가로 공간을 차지하도록 설정
    height: 40,
  },
});

export default Register;
