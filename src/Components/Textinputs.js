import React, { Component } from "react";
import { StyleSheet, View, TextInput ,Text,TouchableOpacity} from "react-native";
import { Icon }  from "react-native-elements";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';
export default  TextInputs =(props)=> {

    return (
     
      <View style={[styles.root,props.style]}>
         <Text style={[{color:'black',fontFamily:'Digikala',fontSize:wp('4%')},props.TitleStyle]}>{props.Title}</Text>
         <TouchableOpacity onPress={props.TextPress}
          disabled={props.Edit}
         style={[{height:55},props.TouchStyle]}
         >
         <TextInput placeholder={props.placeHolder} 
         style={[styles.inputStyle,props.TextStyle]}
         
          onChangeText={props.changeText}
          placeholderTextColor={props.placeHolderColor}
           value={props.values}
           secureTextEntry={props.secure}
           editable={props.Edit}
            keyboardType = {props.keyboardtype}
            multiline={props.multiline}
          />
          </TouchableOpacity>
        { 
           <Text style={[{color:'red'
           ,fontSize:wp('2.5%'),marginBottom:2},props.ErrorTitleStyle]}>{props.ErrorTitle}</Text>
        }
      </View>
    
    );
  }


const styles = StyleSheet.create({
  root: {
  //  flex: 1,
    // backgroundColor: "white",
    // flexDirection: "row-reverse",
   

  },
  iconStyle: {
   
    paddingRight: 10
  },
  inputStyle: {
    flex: 1, 
    textAlign:'right',
    color:'white',
    borderColor: "white",
    borderWidth: 1,
    borderRadius:5,marginBottom:5,marginTop:5
    ,fontFamily:'Yekan',fontSize:wp('4.5%')
    ,textAlignVertical:'center'
   
  }
});
