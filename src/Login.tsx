import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Server from 'metro/src/Server';
import api from './API';

function Login(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [disable, setDisable] = useState(true);
  const [secureText, setSecureText] = useState(true);
  const [icon, setIcon] = useState('eye-slash');

  const onIdChange = (newId: string) => {
    newId && userPw ? setDisable(false) : setDisable(true);
    setUserId(newId);
  };

  const onPwChange = (newPw: string) => {
    newPw && userId ? setDisable(false) : setDisable(true);
    setUserPw(newPw);
  };

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
    setIcon(secureText ? 'eye' : 'eye-slash');
  };

  const gotoRegister = () => {
    navigation.push('Register');
  };

  const gotoMain = () => {
    AsyncStorage.setItem('userId', userId).then(() => {
      navigation.push('Main');
    });
  };

  const gotoServiceIntro = () => {
    AsyncStorage.setItem('userId', userId).then(() => {
      navigation.push('ServiceIntro');
    });
  };

  const onLogin = async () => {
    let fcmToken = (await AsyncStorage.getItem('fcmToken')) || '';
    api
      .login(userId, userPw, `${fcmToken}`)
      .then(response => {
        console.log('API login / data = ' + JSON.stringify(response.data[0]));
        let {code, message} = response.data[0];
        console.log('API login / code = ' + code + ', message = ' + message);

        if (code == 0) {
          gotoMain();
        } else {
          Alert.alert('오류', message, [
            {
              text: '확인',
              onPress: () => console.log('cancel pressed'),
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity onPress={gotoServiceIntro}>
          <Icon name="taxi" size={80} color={'#3498db'} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={'아이디'}
          onChangeText={onIdChange}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder={'패스워드'}
            secureTextEntry={secureText}
            onChangeText={onPwChange}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon name={icon} size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          disabled={disable}
          onPress={onLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginTop: 5}]}
          onPress={gotoRegister}>
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
    flexDirection: 'row',
    width: '70%',
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  inputPassword: {
    flex: 1,
    height: 40,
  },
});

export default Login;
