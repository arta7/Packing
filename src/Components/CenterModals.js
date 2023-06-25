import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, TextInput ,Text,TouchableOpacity, FlatList} from "react-native";

import { Icon }  from "react-native-elements";
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} 
from 'react-native-responsive-screen';


export default CenterModals =(props)=>{
    return ( 
      <>
      {    
         <Modal isVisible={props.showModal} 
         style={[{justifyContent: 'center',
         width:'80%'
         ,marginRight:'10%',marginLeft:'10%'
                        },props.ModalStyle]}
                        onBackdropPress={props.closeModal}>
                         <View style={[{
                         borderRadius: 10,
                         borderColor: 'white',
                         height:'auto',width:'100%',padding:10,backgroundColor:'white'
                         },props.ViewStyle]}>
                <FlatList
               data = {props.dataSource}
               renderItem={({item,index})=>
         
                            <TouchableOpacity style={{justifyContent:'center',
                            alignItems:'center'
                            ,height:60,borderRadius:10,
                            borderWidth:1,marginBottom:5,borderColor:'grey'
                            ,width:'80%',marginHorizontal:'10%',marginTop:10,
                            backgroundColor:item.Id == props.CategorySelectedId 
                   ? 'black' : 'transparent' 
                           }}
                            onPress={()=>{
                              console.log('item id',item.Id)
                              props.setCategorySelectedId(item.Id)
                              props.setCategorySelected(item.Title)
                             props.closeModal()
                             if(props.ReturnFunction !=null)
                             {
                              props.ReturnFunction()
                             }
                           }}
                             
                            >  
                            <Text style={{color: item.Id == props.CategorySelectedId ? 'white' : 'black'
                            ,fontSize:wp('3%')}}>{item.Title}</Text>
                              </TouchableOpacity>  
             }
         />
         </View>
         
         </Modal> 
        


}



</>

    );
  }


