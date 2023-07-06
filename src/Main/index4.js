import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  
  StatusBar, Image, ImageBackground, TextInput, TouchableOpacity, Alert,FlatList, ActivityIndicator, PermissionsAndroid
} from 'react-native';

import { Icon, colors, Header } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Font, Size, ColorPalet, CurrentUser} from './../Data/Data';
import {config } from './../Database/SQLDatabse';
// import BarcodeScanner from 'react-native-barcodescanner';
import Modal from 'react-native-modal';
import MSSQL from 'react-native-mssql';
import CenterModals from '../Components/CenterModals';
import {UnitData} from './../Data/Data'



const useStateCallbackWrapper = (initilValue, callBack) => {
    const [state, setState] = useState(initilValue);
    useEffect(() => callBack(state), [state]);
    return [state, setState];
  };

  const callBack = (state) => {
   console.log("test ", state);
  
  };

const PartInventory = (props) => {

const [PartCode, setPartCode] = useState('')
const [PartDetails, setPartDetails]=useState([])
const [isVisibleScanner, setisVisibleScanner] = useState(false)
const [TorchState, setTorchState] = useState(false)

 const [Units,setUnits] = useStateCallbackWrapper([], callBack);
 const [SelectedUnits,setSelectedUnits] = useStateCallbackWrapper('', callBack);
 const [SelectedUnitsId,setSelectedUnitsId] = useStateCallbackWrapper('', callBack);


 const [Products,setProducts] = useStateCallbackWrapper([], callBack);
 const [SelectedProducts,setSelectedProducts] = useStateCallbackWrapper('', callBack);
 const [SelectedProductsId,setSelectedProductsId] = useStateCallbackWrapper('', callBack);

 const [ProductStyles,setProductStyles] = useStateCallbackWrapper([], callBack);
 const [SelectedStyles,setSelectedStyles] = useStateCallbackWrapper('', callBack);
 const [SelectedStylesId,setSelectedStylesId] = useStateCallbackWrapper('', callBack);


const [torchMode, setTorchMode] = useStateCallbackWrapper('off', callBack);
const [showNotifUnits, setshowNotifUnits] = useState(false)
const [showNotifProducts, setshowNotifProducts] = useState(false)

const [showNotifStyle, setshowNotifStyle] = useState(false)




  let GetUnits=()=>{
      MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
      then(exec=>{
        MSSQL.executeQuery('GetPart  ' + UnitData.UserId).then(result =>{
          console.log('result : ',result)
            setUnits(result)
           
          
        })
      })
      .catch(error => {console.log('Error',error)});
  }

  let GetProducts=(selectedUnitId)=>{
    MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
    then(exec=>{
      MSSQL.executeQuery('GetProductPart ' + selectedUnitId).then(result =>{
        console.log('result : ',result)

            var data= [];
              for(let i=0;i<result.length;i++)
              {
                data.push({Id:result[i].Id,Title:result[i].PName})
              }
          setProducts(data)
          setshowNotifProducts(true)
        
      })
    })
    .catch(error => {console.log('Error',error)});
}


let GetProductStyle=(SelectedProductId)=>{

  MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
  then(exec=>{
    MSSQL.executeQuery('GetPackingStyleWithProduct ' + SelectedProductId).then(result =>{
      console.log('result style : ',result)
        setProductStyles(result)
        setshowNotifStyle(true)
      
    })
  })
  .catch(error => {console.log('Error',error)});
}

  

  
   let refreshScreen=()=>{
    GetUnits() ;
    setSelectedUnits('')
    setSelectedUnitsId('')
    setSelectedStylesId('')
    setSelectedStyles('')
    setSelectedProducts('')
    setSelectedProductsId('')

   }

  
  useEffect(()=>{
   
    GetUnits() 
  },[])




    return (
        <View style={styles.Container}>
    

       
    <CenterModals showModal={showNotifUnits} closeModal={()=>{
        setshowNotifUnits(false)}} 
        dataSource={Units}
        setCategorySelectedId={setSelectedUnitsId}
        setCategorySelected={setSelectedUnits}
        CategorySelectedId={SelectedUnitsId}
        ReturnFunction={()=>{
          setSelectedProductsId('')
          setSelectedProducts('')
          setProducts([])
        }}
        />


      <CenterModals showModal={showNotifProducts} closeModal={()=>{
        setshowNotifProducts(false)}} 
        dataSource={Products}
        setCategorySelectedId={setSelectedProductsId}
        setCategorySelected={setSelectedProducts}
        CategorySelectedId={SelectedProductsId}
        ReturnFunction={()=>{
          setSelectedStylesId('')
          setSelectedStyles('')
          setProductStyles([])
        }}

        />

<CenterModals showModal={showNotifStyle} closeModal={()=>{
        setshowNotifStyle(false)}} 
        dataSource={ProductStyles}
        setCategorySelectedId={setSelectedStylesId}
        setCategorySelected={setSelectedStyles}
        CategorySelectedId={SelectedStylesId}
        />


        
        <View style={{flexDirection: 'row', backgroundColor: ColorPalet._Header, elevation: 6, height: hp('7%'), width: wp('100%')}}>
            <View style={{width: wp('15%'), alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>{props.navigation.goBack()}}>
                <Icon name = 'arrow-back' color='white' type="materialicon" size={30}/>
            </TouchableOpacity>
            </View>
            <View style={{width: wp('70%'), justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.HeaderTextStyle2}>انتخاب محصول</Text>
            </View>
            <View style={{width: wp('15%'), alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>{refreshScreen()}}>   
                <Icon name = 'refresh' color='white' type="materialicon" size={30}/>
            </TouchableOpacity> 
            </View>
            <View style={{width: wp('10%')}}>
            
            </View>
        </View>

        <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent', borderWidth: 1,padding:10, borderRadius: 15, marginTop: wp('2%')}}>
         
         <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:10}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>واحد تولیدی</Text>
                </View>
            <TouchableOpacity style={{width: '100%', alignSelf: 'center', justifyContent: 'center',marginTop:10}}
            onPress={()=>{ 
              setshowNotifUnits(true)
            
            }}
            >
                <TextInput style={{width: '85%', height: hp('7%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={SelectedUnits} 
                  editable={false}
                  textAlign='center'
                  color='black'
                  />
            </TouchableOpacity>



            {/* <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:10}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>دسته محصول</Text>
                </View>
            <TouchableOpacity style={{width: '100%', alignSelf: 'center', justifyContent: 'center',marginTop:10}}>
                <TextInput style={{width: '85%', height: hp('4.5%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={PartCode} 
                  onChangeText={(v)=>{setPartCode(v)}}
                  editable={false}
                  />
            </TouchableOpacity> */}

            <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:10}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>نام محصول</Text>
                </View>
            <TouchableOpacity style={{width: '100%', alignSelf: 'center', justifyContent: 'center',marginTop:10}}
             onPress={()=>{ 
              if(SelectedUnitsId != '')
              {
                GetProducts(SelectedUnitsId)
               
              }
              else
              {
                 Alert.alert('لطفا یک واحد را انتخاب کنید.')
              }
             
            
            }}
            >
                <TextInput style={{width: '85%', height: hp('7%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={SelectedProducts} 
                  editable={false}
                  textAlign='center'
                  color='black'
                  />
            </TouchableOpacity>

            <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:10}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>روش بسته بندی</Text>
                </View>
            <TouchableOpacity style={{width: '100%', alignSelf: 'center', justifyContent: 'center',marginTop:10}}
             onPress={()=>{ 
              if(SelectedProductsId != '')
              {
                GetProductStyle(SelectedProductsId)
               
              }
              else
              {
                 Alert.alert('لطفا یک محصول را انتخاب کنید.')
              }
             
            
            }}
            >
                <TextInput style={{width: '85%', height: hp('7%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={SelectedStyles} 
                  editable={false}
                  textAlign='center'
                  color='black'
                  />
            </TouchableOpacity>

            
        <TouchableOpacity style={{width: '60%', alignSelf: 'center', justifyContent: 'center',marginTop:hp(5)}}
        onPress={()=>{ 
          
          UnitData.UnitId=SelectedUnitsId;
          UnitData.ProductId=SelectedProductsId;
          UnitData.ProductStyles = SelectedStylesId;

            UnitData.UnitName= SelectedUnits;
            UnitData.ProductName = SelectedProducts;

          props.navigation.push('PackingInventory')
            
      }}
        >
                <TextInput style={{width: '85%', height: hp('7%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: ColorPalet._blue2, borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={'ثبت'} 
                 
                  editable={false}
                  color='white'
                  />
            </TouchableOpacity>
        
        </View>


       

        {/* <View style={{backgroundColor: ColorPalet._smokey2, width : wp('95%'), height: hp('55%'), marginHorizontal: wp('2.5%'), borderColor: ColorPalet._blue2, borderWidth: 2, borderStyle: 'dashed', borderRadius: 15, marginTop: hp('1%')}}>
            <View style={{width: '100%', flex: 0.03, flexDirection: 'row'}}></View>
            
            <View style={{width: '100%', flex: 0.1, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '90%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P0:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>کد کالا</Text>
                </View>
            </View>

            <View style={{width: '100%', flex: 0.2, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '95%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('4%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P1:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>عنوان کالا</Text>
                </View>
            </View>
            
            <View style={{width: '100%', flex: 0.24, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '95%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('10%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P2:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>موجودی</Text>
                </View>
            </View>
            
            <View style={{width: '100%', flex: 0.1, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '90%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P3:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>واحد سنجش</Text>
                </View>
            </View>
            
            <View style={{width: '100%', flex: 0.1, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '90%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P4:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>مشخصه فنی</Text>
                </View>
            </View>
            
            <View style={{width: '100%', flex: 0.1, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '90%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P5:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>کد بخش</Text>
                </View>
            </View>
            
            <View style={{width: '100%', flex: 0.1, flexDirection: 'row', flexDirection: 'row'}}>
                <View style={{width: '70%', height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <View style={{width: '95%', height: '90%', flexDirection: 'row', backgroundColor: ColorPalet._smokey3, borderRadius: 20}}>
                        <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'center', textAlignVertical: 'center', width: '100%', height: '100%'}}>{PartDetails.length>0?PartDetails[0].P6:'-'}</Text>
                    </View>
                </View>
                <View style={{width: '30%', height: '100%', flexDirection: 'row'}}>
                    <Text style={{fontSize: wp('3.5%'), fontFamily: Font.FontSansB, color: 'black', textAlign: 'right', textAlignVertical: 'center', width: '100%', height: '100%', paddingRight: 20}}>عنوان بخش</Text>                        
                </View>
            </View>

            <View style={{width: '100%', flex: 0.03, flexDirection: 'row'}}></View>
        </View> */}

   


        </View>
    )

}


const styles = StyleSheet.create({
    Container:{
      flex: 1, // maximiz
      backgroundColor: ColorPalet._smokey2
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
      borderRightColor: 'gray',
      paddingVertical: 0
    },
    TextInputStyle2: {
      fontFamily: Font.FontSansR,
      width: '100%',
      backgroundColor: '#d9d9d9',
      textAlign: 'center',
      height: hp('4.5%'),
      fontSize: wp('3.5%'),
      paddingVertical: 0,
      color: 'black'
    },
    TextInputStyle3: {
      fontFamily: Font.FontSansR,
      width: '100%',
      textAlignVertical: 'top',
      textAlign: 'right',
      backgroundColor: '#d9d9d9',
      height: hp('9%'),
      fontSize: wp('3.5%'),
      paddingVertical: 0
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
      fontFamily: Font.FontSansR,
      fontSize: wp('4%'),
      marginRight: 30,
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      elevation: 1,
      width: '100%',
      height: '100%',
      textAlign: 'center'
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
    ButtonTextStyle3: {
      fontFamily: Font.FontSansR,
      fontSize: wp('3.5%'),
      width: '70%',
      height: hp('9%'),
      backgroundColor:'#d9d9d9',
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
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
    ButtonStyle3: {
      width: '100%',
      height: hp('9%'),
      backgroundColor:'#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
  
  export default PartInventory;
