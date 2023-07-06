import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  
  StatusBar, Image, ImageBackground, TextInput, TouchableOpacity, Alert,FlatList, BackHandler, PermissionsAndroid
} from 'react-native';

import { Icon, colors, Header } from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Font, Size, ColorPalet, CurrentUser, UnitData} from './../Data/Data';
import {config } from './../Database/SQLDatabse';
// import BarcodeScanner from 'react-native-barcodescanner';
import Modal from 'react-native-modal';
import MSSQL from 'react-native-mssql';
import CenterModals from '../Components/CenterModals';
import moment from"moment";
import DeviceInfo from 'react-native-device-info';


import XLSX from 'xlsx';
import RNFetchBlob from 'rn-fetch-blob'

let i=0;
let Data=[];
let Data1=[];
let x = "_";

const useStateCallbackWrapper = (initilValue, callBack) => {
    const [state, setState] = useState(initilValue);


    
    useEffect(() => callBack(state), [state]);



    return [state, setState];
  };

  const callBack = (state) => {
   console.log("test ", state);
  
  };
  let promise;
  let StationId =5;

const PackingStore = (props) => {


  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();



          const [ProductStyles,setProductStyles] = useStateCallbackWrapper([], callBack);

          const [dtProduct,setdtProduct] = useStateCallbackWrapper([], callBack);
          const [SelectedProducts,setSelectedProducts] = useStateCallbackWrapper('', callBack);
          //  const [SelectedProductsId,setSelectedProductsId] = useStateCallbackWrapper('', callBack);




          const [DataBarcode, setDataBarcode] = useState([]);
          const [FirstItemActive, setFirstItemActive] = useState(true)
          const [SecondItemActive, setSecondItemActive] = useState(false)
          const [ThirdItemActive, setThirdItemActive] = useState(false)

          const [showNotifProducts, setshowNotifProducts] = useState(false)

          const [FirstItemText, setFirstItemText] = useState('')
          const [SecondItemText, setSecondItemText] = useState('_')
          const [ThirdItemText, setThirdItemText] = useState('')

          const [CurrentStep, setCurrentStep] = useState(0)
          const [ControlId, setControlId] = useState(1)
          const [LastBarcode, setLastBarcode] = useState('')
          const [PackHeaderReturnId, setPackHeaderReturnId] = useState('')
          const [HeaderReturnId, setHeaderReturnId] = useState('')

          const [showFirstItemKeyboard,setshowFirstItemKeyboard] = useState(false)
          const [showSecondItemKeyboard,setshowSecondItemKeyboard] = useState(false)
          const [showThirdItemKeyboard,setshowThirdItemKeyboard] = useState(false)



  



   


      

      



  useEffect(()=>{
   
  },[])




    let CheckSecondBarcode=(_id)=>{
    
    }


     let GetBarcode2=async(barcode)=>{
    
     }


        let GetBarcode=async(_barcode)=>{


          MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery(
             ' SelectPackHeader '+ _barcode
            ).then(result =>{
              console.log('result barcode 1',result.length)
              if(result.length>0)
              {
                
                  for(let j=0;j<result.length;j++)
                  Data.push({Code:result[j].Barcode})
                
                  
                   for(let k=0;k<Data.length;k++)
                   {
                  //  GetBarcode(Data[k].Code)
                  console.log('Data '+k,Data[k])
                 
                  // MSSQL
                  // .connect(config).then(result1 => {console.log('result1',result1)}).
                  // then(exec=>{
                    MSSQL.executeQuery(
                       ' SelectPackHeader '+ Data[k].Code
                       
                      ).then(result1 =>{
                        console.log('result 1',result1 )
                        if(result1.length > 0)
                        {
                        console.log('result barcode 2',result1)
                        for(let P=0;P<result1.length;P++)
                        {
                        Data1.push({Code:result1[P].Barcode})

                        }
                        setDataBarcode(Data1)
                         x = FirstItemText;
                         console.log('x',x)
                        setSecondItemText(x)
                        setFirstItemText('')
                        ref_input1.current.focus();
                       }
                      else
                      { 
                          console.log('data without')
                         setDataBarcode(Data)
                          x = FirstItemText;
                         setSecondItemText(x)
                         setFirstItemText('')
                        ref_input1.current.focus();
                      }
            
                      })
                      .catch(error => {

                        console.log('error',error)

                        if(error == "Error: The executeQuery method must return a result set.")
                        {
                          setDataBarcode(Data)
                          x = FirstItemText;
                          setSecondItemText(x)
                          setFirstItemText('')
                        ref_input1.current.focus();
                        }

                      });
                   // })
                    // GetBarcode2(Data[k].Code)
              
                    
                   }

                   console.log('Data1 ', Data1)

                 
                
              
              }
              else
              {
                
                Alert.alert('بارکد مورد نظر پیدا  نشد')
              }

            })
          }) 
          .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
        }



   let handleHardWare=async()=>{
       
      Alert.alert('خروج', 'آیا از بازگشت به صفحه قبل مطمئن هستید؟', [
        {
          text: 'خیر',
          onPress: () => {return true}
          // style: 'cancel',
        },
        {text: 'بله', onPress: () => {return false}},
      ])
    }


    return (
        <View style={styles.Container}>
          <ScrollView>
    

       
    {/* <CenterModals showModal={showNotifUnits} closeModal={()=>{
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
        /> */}



        
        <View style={{flexDirection: 'row', backgroundColor: ColorPalet._Header, elevation: 6, height: hp('7%'), width: wp('100%')}}>
            <View style={{width: wp('15%'), alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>{
              Alert.alert('خروج', 'آیا از بازگشت به صفحه قبل مطمئن هستید؟', [
                {
                  text: 'خیر',
                  onPress: () => console.log('Cancel Pressed')
                  // style: 'cancel',
                },
                {text: 'بله', onPress: () => props.navigation.goBack()},
              ])
                

            }}>
                <Icon name = 'arrow-back' color='white' type="materialicon" size={30}/>
            </TouchableOpacity>
            </View>
            <View style={{width: wp('70%'), justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.HeaderTextStyle2}>بررسی بارکد </Text>
            </View>
            <View style={{width: wp('15%'), alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>{
              
            }}>   
                <Icon name = 'file-excel-o' color='white' type="font-awesome" size={20}/>
            </TouchableOpacity> 
            </View>
            <View style={{width: wp('10%')}}>
            
            </View>
        </View>

        {/* <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent', borderWidth: 1,padding:10, borderRadius: 15, marginTop: wp('2%')}}>

        </View> */}


        <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent',
        height:hp(26), borderWidth: 1,padding:10, borderRadius: 15, marginTop: wp('2%')}}>

    

                      <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:20}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>بارکد بسته بندی</Text>
                </View>
          
                <TextInput style={{width: '85%', height: hp('9%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={FirstItemText} 
                  editable={FirstItemActive}
                  showSoftInputOnFocus={showFirstItemKeyboard}
                  textAlign='center'
                  color='black'
                  ref={ref_input1}
                  onChangeText={(v)=>{
                    setFirstItemText(v)
                  }}
                  onSubmitEditing={()=>{
                      if(FirstItemText != '')
                      {
                        i=0;
                        Data=[];
                        Data1=[];
                        setDataBarcode([])
                      GetBarcode(FirstItemText)
                      }
                    else
                    {
                    Alert.alert('لطفا یک بارکد وارد کنید')
                    }
                  
                  }}
                  />
                  
                  {
                     <View style={{flexDirection:'row-reverse',marginTop:20,width:'95%',justifyContent:'flex-start',alignItems:'center'}}>
                     <Text style={{paddingLeft: wp('1%'), fontSize: wp('4%'), fontFamily: Font.FontSansB,textAlign:'right'}}> آخرین بارکد خوانده شده :  </Text>
                              
                     <Text style={{paddingLeft: wp('1%'),color:'red', fontSize: wp('4%'), 
                     fontFamily: Font.FontSansB,textAlign:'right'}}>{SecondItemText}</Text>
                           {/* <TextInput style={{width: '85%', height: hp('4.5%'), fontSize: wp('4%'), paddingVertical: 0,
                            backgroundColor:  ColorPalet._blue2, borderRadius: 10, marginHorizontal: '4.5%', textAlign: 'center'}} 
                            value={SecondItemText}
                             editable={false}
                             color='red'
                             /> */}
                      
                       
                               
                     
                           
                              
                        </View>

                  }

                  

                   

                      </View>

                      <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent', borderWidth: 1,padding:10,height:hp(58), borderRadius: 15, marginTop: wp('2%')}}>

              <View style={{flexDirection:'row-reverse',width:'90%',marginHorizontal:'5%',height:hp(5),borderWidth:1,borderRadius:10}}>
                  <View style={{width:'30%',geight:'100%',backgroundColor:'yellow',elevation:1,borderLeftWidth:1}}>
                      <Text style={{textAlign:'center'}}>ردیف</Text>
                  </View>

                  <View style={{width:'70%',geight:'100%',backgroundColor:'yellow',elevation:1}}>
                      <Text style={{textAlign:'center'}}>بارکد</Text>
                  </View>

              </View>


                    <FlatList 
                    data={DataBarcode}
                    renderItem={({item, index})=>(
                      
              <View style={{flexDirection:'row-reverse',width:'90%',marginHorizontal:'5%',height:hp(5),borderWidth:1}}>
              <View style={{width:'30%',geight:'100%',backgroundColor:'#b6f542',elevation:1}}>
                  <Text style={{textAlign:'center'}}>{index+1}</Text>
              </View>

              <View style={{width:'70%',geight:'100%',backgroundColor:'#42c8f5',elevation:1,}}>
                  <Text style={{textAlign:'center'}}>{item.Code}</Text>
              </View>

          </View>

                    )}
                    />

                  

        </View>





   

</ScrollView>
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
  
  export default PackingStore;
