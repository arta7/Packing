/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState,useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Image, ImageBackground, TextInput, TouchableOpacity, Alert,FlatList, ActivityIndicator,NativeModules, Platform 
} from 'react-native';
import { Icon, colors } from 'react-native-elements';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Font, ColorPalet, CurrentUser, UnitData} from './../Data/Data';

import MSSQL from 'react-native-mssql';
import {config } from './../Database/SQLDatabse';
import AsyncStorage from '@react-native-community/async-storage';

const Login = (props) => {

    const ref_input1 = useRef();
    const ref_input2 = useRef();
  const [Password, setPassword] = useState('')
  const [UserName, setUserName] = useState('')
  const  EncryptionKey = "Hoo496Man1672Jams101Hidi";

  let GetUsername=async()=>{
    var value = await AsyncStorage.getItem('Username');
      console.log('value',value)
       if (value != '' && value!=null)
       {
          setUserName(value)
       }
       else
       {
        setUserName('')
         ref_input1.current.focus()
       }
  }


  useEffect(()=>{
   
      
    GetUsername()
      
      

    
  },[])

  //const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length)


 
  

  


  let CheckUser=()=>{
    if(UserName != "" )
    {
    MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
    then(exec=>{
      MSSQL.executeQuery(
         'UserLogin '+UserName.toString()
        ).then(result =>{
            if(result.length>0)
            {
              AsyncStorage.setItem("Username",UserName)
              console.log('result[0].Id',result[0].Id)
                UnitData.UserId = result[0].Id;
                
                props.navigation.replace('Dashboard')
            }
            else
            {
                Alert.alert('نام کاربری اشتباه می باشد.')
                setUserName('')
                setPassword('')
                ref_input1.current.focus()
            }
        })
    }) .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
        }   
        else
        {
            Alert.alert('لطفا ابتدا همه فیلدها را وارد کنید')
        }  
  }














  return (
    <View style={[styles.Container,{}]}>
          <View 
      style={{width: wp('100%'), height: hp('30%'), backgroundColor: ColorPalet._blue, justifyContent: 'center', alignItems: 'center', elevation: 5}}
      >
        <Image source = { require('./../Image/Header.png')} style={{width: '100%', height: '100%', opacity: 0.8}} resizeMode='stretch'/>
      </View>
      {/* <View style={{backgroundColor: ColorPalet.MainColor, bottom: 0, height: hp('6%'), width: wp('100%')}}></View> */}
    
      <View style={{backgroundColor: ColorPalet.MainColor, bottom: 0, height: hp('10%'), width: wp('100%'), justifyContent: 'center'}}>
        <Text style={[styles.TitleText,{}]}>ورود</Text>
      </View>
              <View style={{  alignItems: 'flex-end',justifyContent: 'center',marginTop:20}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('5%'), fontFamily: Font.FontSansB,color:'black'}}>نام کاربری</Text>
                </View>
          
                <TextInput style={{width: '85%', height: hp('9%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={UserName} 
                  textAlign='center'
                  color='black'
                  showSoftInputOnFocus={false}
                  ref={ref_input1}
                  onChangeText={(v)=>{
                    setUserName(v)
                  }}
                  onSubmitEditing={()=>{


                  }}
                  />

      <View style={{backgroundColor: ColorPalet.MainColor, bottom: 0, height: hp('5%'), width: wp('100%'), justifyContent: 'center'}}>
        <View style={{bottom: 0, height: '15%', width: wp('100%')}}></View>
        <View style={{backgroundColor: ColorPalet.MainColor, bottom: 0, height: '15%', width: wp('100%')}}></View>
      </View> 
      {/* <View style={{  alignItems: 'flex-end',justifyContent: 'center',marginTop:20}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('5%'), fontFamily: Font.FontSansB}}>رمز عبور</Text>
                </View>
          
                <TextInput style={{width: '85%', height: hp('9%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={Password} 
                  textAlign='center'
                  secureTextEntry={true}
                  showSoftInputOnFocus={false}
                  color='black'
                  ref={ref_input2}
                  onChangeText={(v)=>{
                    setPassword(v)
                  }}
                  onSubmitEditing={()=>{

                  }}
                  /> */}


        <TouchableOpacity style={{width: '60%', alignSelf: 'center', justifyContent: 'center',marginTop:hp(5)}}
        onPress={()=>{ 
          CheckUser()
      }}
        >
                <TextInput style={{width: '85%', height: hp('7%'), fontSize: wp('5%'), paddingVertical: 0,
                 backgroundColor: ColorPalet._blue2, borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={'ورود'} 
                 
                  editable={false}
                  color='white'
                  />
            </TouchableOpacity>




  </View>
  );
};

const styles = StyleSheet.create({
  Container:{
    flex: 1, // maximiz
    // backgroundColor: '#f2f2f2'
  },
  TextStyle: {
    fontFamily: Font.FontSansR, 
    fontSize: wp('4%'), 
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#737373'
  },
  NumberButtonSyle: {
    backgroundColor: '#FFF', 
    width: '25%', 
    height: '80%', 
    marginHorizontal: 5,
    borderRadius: 5,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  NumberTextStyle: {
    fontFamily: Font.FontSansB, 
    fontSize: wp('6%'), 
    color: '#737373',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  TextInputStyle: {
    width: wp('80%'), 
    height: hp('6%'),
    marginLeft: wp('10%'), 
    marginRight: wp('10%'), 
    backgroundColor:'#d9d9d9', 
    borderRadius: 30,
    textAlign: 'center',
    fontSize: wp('3.2%'),
    elevation: 1
  },
  TextInputStyle2: {
    width: '100%', 
    height: hp('6%'),
    backgroundColor:'#d9d9d9', 
    borderRadius: 30,
    textAlign: 'center',
    fontSize: wp('3.2%'),
    elevation: 1
  },
  TitleText: {
    fontFamily: Font.FontSansB, 
    fontSize: wp('9%'), 
    marginRight: 30,
    color: '#2196F3'
  },
  ButtonStyle: {
    width: wp('80%'), 
    height: hp('6%'),
    marginLeft: wp('10%'), 
    marginRight: wp('10%'), 
    backgroundColor:'#f56c6c', 
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ButtonTextStyle: {
    fontFamily: Font.FontSansR, 
    fontSize: wp('4%'), 
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    elevation: 1
  }
});

export default Login;
