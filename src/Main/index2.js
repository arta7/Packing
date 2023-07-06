import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, Image, ImageBackground, TextInput, TouchableOpacity, Alert, FlatList, PermissionsAndroid, BackHandler 
} from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {Font, Size, ColorPalet} from '../Data/Data';
import { Icon, colors } from 'react-native-elements';


const Main = (props) => {

  return (

    <View style={[styles.Container,{}]}>



      <View style={{width: wp('100%'), height: hp('100%'), backgroundColor: ColorPalet._smokey}}>   
        <View style={{width: wp('90%'), height: hp('51%'), margin: wp('5%'), backgroundColor: 'transparent'}}>
          <View style={{width: '100%', height: '50%', flexDirection: 'row'}}>
          <TouchableOpacity style={{width: wp('43%'), height: wp('43%')
          , backgroundColor: '#f0f0f0', margin: wp('1%'), borderRadius: 10, elevation: 5,opacity:0.5}}
                              onPress={()=>{}}
                              disabled={true}
                              >
              <View style={{width: '100%', height: '10%'}}></View>
              <View style={{width: '100%', height: '45%', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name = 'list' color='#2196F3' type="font-awesome" size= {70} />
              </View>
              <View style={{width: '100%', height: '35%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ButtonTextStyle}>تنظیمات</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity style={{width: wp('43%'), height: wp('43%'), backgroundColor: '#f0f0f0', margin: wp('1%'), borderRadius: 10, elevation: 5}}
                              onPress={()=>{
                                props.navigation.push('PartInventory')
                               // props.navigation.push('ChoiceInventory')
                                }}>
              <View style={{width: '100%', height: '10%'}}></View>
              <View style={{width: '100%', height: '45%', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name = 'bar-chart' color='#2196F3' type="font-awesome" size= {70} />
              </View>
              <View style={{width: '100%', height: '35%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ButtonTextStyle}>بسته بندی</Text>
              </View>

            </TouchableOpacity>
           
          </View>
          <View style={{width: '100%', height: '50%', flexDirection: 'row'}}>

          </View>
        </View>
      </View>
        
    </View>
  );
};






const styles = StyleSheet.create({
  Container:{
    flex: 1, // maximiz
    backgroundColor: ColorPalet.MainColor
  },
  TextStyle: {
    fontFamily: Font.FontSansR,
    fontSize: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: '#737373'
  },
  HeaderTextStyle: {
    fontFamily: Font.FontSansR,
    fontSize: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  TextInputStyle: {
    width: '85%',
    height: hp('4.5%'),
    backgroundColor:'#d9d9d9',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    textAlign: 'center',
    fontSize: wp('3%'),
    elevation: 1,
    borderRightWidth: 5,
    borderRightColor: 'gray'
  },
  TextInputStyle2: {
    width: '100%',
    height: hp('4.5%'),
    backgroundColor:'#d9d9d9',
    textAlign: 'center',
    fontSize: wp('3%'),
    elevation: 1
  },
  TitleText: {
    fontFamily: Font.FontSansB,
    fontSize: wp('9%'),
    color: ColorPalet._blue
  },
  ButtonStyle: {
    width: wp('40%'),
    height: hp('4.5%'),
    marginLeft: wp('30%'),
    marginRight: wp('30%'),
    backgroundColor:'#2196F3',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ButtonTextStyle: {
    fontFamily: Font.FontSansB,
    fontSize: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: '#575957',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  ButtonTextStyle3: {
    fontFamily: Font.FontSansR,
    fontSize: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  ButtonTextStyle2: {
    fontFamily: Font.FontSansR,
    fontSize: wp('3.5%'),
    width: '70%',
    height: hp('4.5%'),
    backgroundColor:'#d9d9d9',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 1,
    borderLeftWidth: 5,
    borderLeftColor: 'gray'

  },
  HeaderTextStyle2: {
    fontFamily: Font.FontSansB,
    fontSize: wp('4.5%'),
    width: '100%',
    color: ColorPalet._HeaderTitle,
    justifyContent: 'center',
    textAlign: 'center'

  },
  ButtonStyle2: {
    width: '100%',
    height: hp('4.5%'),
    backgroundColor:'#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Main;