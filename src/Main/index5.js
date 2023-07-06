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

const PackingInventory = (props) => {


  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();



          const [ProductStyles,setProductStyles] = useStateCallbackWrapper([], callBack);

          const [dtProduct,setdtProduct] = useStateCallbackWrapper([], callBack);
          const [SelectedProducts,setSelectedProducts] = useStateCallbackWrapper('', callBack);
          //  const [SelectedProductsId,setSelectedProductsId] = useStateCallbackWrapper('', callBack);




          const [torchMode, setTorchMode] = useStateCallbackWrapper('off', callBack);
          const [FirstItemActive, setFirstItemActive] = useState(true)
          const [SecondItemActive, setSecondItemActive] = useState(false)
          const [ThirdItemActive, setThirdItemActive] = useState(false)

          const [showNotifProducts, setshowNotifProducts] = useState(false)

          const [FirstItemText, setFirstItemText] = useState('')
          const [SecondItemText, setSecondItemText] = useState('')
          const [ThirdItemText, setThirdItemText] = useState('')

          const [CurrentStep, setCurrentStep] = useState(0)
          const [ControlId, setControlId] = useState(1)
          const [LastBarcode, setLastBarcode] = useState('')
          const [PackHeaderReturnId, setPackHeaderReturnId] = useState('')
          const [HeaderReturnId, setHeaderReturnId] = useState('')

          const [showFirstItemKeyboard,setshowFirstItemKeyboard] = useState(false)
          const [showSecondItemKeyboard,setshowSecondItemKeyboard] = useState(false)
          const [showThirdItemKeyboard,setshowThirdItemKeyboard] = useState(false)



     let UpdateFirstItem=()=>{

      setFirstItemText('')
      ref_input1.current.focus()
      setCurrentStep(0)
      
     }



      let GetPackingInformation=(selectedStyleId)=>{
        console.log('selectedStyleId',selectedStyleId)
        MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery('GetPackingInformation ' + selectedStyleId).then(result =>{
            console.log('result styles : ',result)
            setProductStyles(result)
            if(result.length>0)
            setSelectedProducts(result[0])
            //console.log('rs 0 ',result)
            
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
       }


       let GetProducts=(proudctId)=>{
        MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery('GetProduct @Id=' + proudctId).then(result =>{
            console.log('result Products : ',result) 
            setdtProduct(result)
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
       }

       let InsertPackHeader=async(Barcode,TypeId,Status,StationId)=>{
        MSSQL.connect(config).then(result1 => {console.log('result1 insert',result1)}).
        then(exec=>{
          MSSQL.executeQuery(
            ' DECLARE @Id INT; EXEC InsertPackHeader @Barcode = ' + Barcode + ',@TypeId =' +TypeId +',@Status = ' + Status +',@StationId = '+StationId+
            ',  @Id =@Id  OUTPUT;SELECT	@Id as Id'
          
          ).then(result =>{
           console.log('InsertPackHeader : ',result)
           setFirstItemActive(false)
           setHeaderReturnId(result[0].Id)
           ref_input2.current.focus()
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
        setFirstItemText('')
        ref_input1.current.focus()
      });
       }



         let CheckControlId1FirstBarcode=()=>{

          if(FirstItemText.substring(0,1).toUpperCase() == SelectedProducts?.Symble.toUpperCase())
          {


          //  console.log('dtProduct[0][0]',FirstItemText.substring(4+dtProduct[0].SSPP.length,(dtProduct[0].SSPP.length+4+1)),'dtProduct[0].YearSymble.length',dtProduct[0].SSPP.length )
              if(FirstItemText.substring
                (4+dtProduct[0].SSPP.length,dtProduct[0].SSPP.length+4+1).toUpperCase() 
              == dtProduct[0].YearSymble.toUpperCase() 
              &&
              FirstItemText.substring(4,4+dtProduct[0].SSPP.length).toUpperCase()
               == dtProduct[0].SSPP.toUpperCase()
              )
              {
                
                MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
                then(exec=>{
                  MSSQL.executeQuery('GetPackHeaderForBarcode ' + FirstItemText).then(result =>{
                   console.log('GetPackHeaderForBarcode : ',result)
                      if(result.length>0)
                      {
                        setHeaderReturnId(result[0].Id)
                        {
                          
                   MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
                then(exec=>{
                  MSSQL.executeQuery('GetChildBarcode ' + result[0].Id).then(result =>{      
                            setCurrentStep(result.length) 

                            if(SelectedProducts?.LevelPriority.toString() == '1')
                            {

                              if(result.length>0)
                              {
                                if(result.length < SelectedProducts?.PackQty)
                                {
                                setLastBarcode(result[result.length-1].Barcode)
                              
                                setFirstItemActive(false)
                                setSecondItemText('')
                                setSecondItemActive(true)
                                ref_input2.current.focus()
                                }
                                else
                                {
                                  setLastBarcode(result[result.length-1].Barcode)
                                  
                                  setSecondItemActive(false)
                                  setFirstItemActive(false)
                                  setThirdItemActive(true)
                                  setThirdItemText('')
                                  ref_input3.current.focus()
                                }

                              } 
                              else
                              {
                                
                                setFirstItemActive(false)
                                setSecondItemText('')
                                setSecondItemActive(true)
                                ref_input2.current.focus()
                              }   
                            }
                            else   if(SelectedProducts?.LevelPriority.toString() == '2')
                            {

                              if(result.length>0)
                              {
                                if(result.length < SelectedProducts?.PackQty)
                                {
                                  setLastBarcode(result[result.length-1].Barcode)
                                 
                                  setFirstItemActive(false)
                                  setSecondItemText('')
                                  setSecondItemActive(true)
                                   ref_input2.current.focus()
                                
                                }
                                else
                                {
                                  setLastBarcode(result[result.length-1].Barcode)
                                  
                                  setSecondItemActive(false)
                                  setFirstItemActive(false)
                                  setThirdItemActive(true)
                                  setThirdItemText('')
                                  ref_input3.current.focus()
                                }
                               
                              } 
                              else
                              {
                                
                                setFirstItemActive(false)
                                setSecondItemText('')
                                setSecondItemActive(true)
                                 ref_input2.current.focus()
                              
                              } 




                            }
                            else   if(SelectedProducts?.LevelPriority.toString() == '3')
                            {
                              if(result.length>0)
                              {
                                if(result.length < SelectedProducts?.PackQty)
                                {
                                setLastBarcode(result[result.length-1].Barcode)
                               
                                setFirstItemActive(false)
                                setSecondItemText('')
                                setSecondItemActive(true)
                                 ref_input2.current.focus()
                                }
                                else
                                {
                                  setLastBarcode(result[result.length-1].Barcode)
                                  
                                  setSecondItemActive(false)
                                  setFirstItemActive(false)
                                  setThirdItemActive(true)
                                  setThirdItemText('')
                                  ref_input3.current.focus()
                                }
                              } 
                              else
                              {
                                
                                setFirstItemActive(false)
                                setSecondItemText('')
                                setSecondItemActive(true)
                                ref_input2.current.focus()
                              }   
                            }
                              
                  })
                })
                .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
                setFirstItemActive(true)
                setFirstItemText('')
                ref_input1.current.focus()
              })
                      //GetChildBarcode
                        }

                      }
                     
                  })
                })
                .catch(error => {
                  Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
                  setFirstItemActive(true)
                  setFirstItemText('')
                  ref_input1.current.focus()
                });

              }
              else
              {
                Alert.alert('بارکد وارد شده برای بسته مورد نظر نمی باشد')
                UpdateFirstItem()
              }
          }
          else
          {
            Alert.alert('نوع بسته بندی انتخاب شده اشتباه می باشد')
            UpdateFirstItem()
          }
         }



      



          let SelectBarcode=(barcode)=>{
            MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery(
             ' DECLARE @ReturnId INT; EXEC SelectBarcode @Barcode = ' + barcode + ', @ReturnId =@ReturnId  OUTPUT;SELECT	@ReturnId as ReturnId'
            ).then(result =>{
            console.log('SelectBarcode : ',result) 
            if(result[0].ReturnId.toString() == "0")
            {



              {

                let Startindex= parseInt((dtProduct[0].StartCode) , 10 )-1;
                let EndIndex = ((dtProduct[0].CodeSSPP.toString() + dtProduct[0].Serial.toString()).length);
                var  Code = (dtProduct[0].CodeSSPP.toString() + dtProduct[0].Serial.toString())

                

                if(Code.toUpperCase() == SecondItemText.substring(Startindex,EndIndex).toUpperCase() )
                {
                 
                  MSSQL.connect(config).then(result1 => {console.log('result1 insert',result1)}).
                  then(exec=>{
                    MSSQL.executeUpdate(
                      'InsertBarcode @Barcode = ' + SecondItemText + ',@State =' +6 +',@Registered = ' + 1 +',@StationId = '+StationId
                    ).then(() =>{

                        //InsertPackengTemp

                        MSSQL.connect(config).then(result2 => {console.log('result1 insert',result2)}).
                        then(exec=>{
                          MSSQL.executeUpdate(
                            'InsertTempPacking @Barcode = ' + SecondItemText  +',@PackHeader = ' + HeaderReturnId +',@StationId = '+StationId          
                          ).then(() =>{


                            InsertPackDetails(5)
                            setCurrentStep(CurrentStep+1)
                            setSecondItemText('')
                            if((CurrentStep+1)>=SelectedProducts?.PackQty)
                            {
                              setSecondItemActive(false)
                              setThirdItemActive(true)
                              ref_input3.current.focus()

                            }
                            else
                            {
                               
                               setSecondItemActive(true)
                                ref_input2.current.focus()
                             
                            }



                          })
                        })
                        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})




                    // InsertPackingTemp
                      
                    })
                  })
                  .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})



                }
                else
                {
                  Alert.alert('بارکد وارد شده برای بسته مورد نظر نمی باشد')
                  setSecondItemActive(true)
                  setSecondItemText('')
                  ref_input2.current.focus()
                }


                //console.log('parseInt((dtProduct[0].StartCode) , 10 ) + 1',((dtProduct[0].CodeSSPP.toString() + dtProduct[0].Serial.toString()).length+((dtProduct[0].StartCode) , 10 ) + 1-1))
                // console.log('Code SSPP :',SecondItemText.substring(parseInt((dtProduct[0].StartCode) , 10 ) + 1-1
                // ,((dtProduct[0].CodeSSPP.toString() + dtProduct[0].Serial.toString()).length)))

                
              }


              setSecondItemActive(true)
              setSecondItemText('')
              ref_input2.current.focus()
            } 
            else
            {
              Alert.alert('بارکد مورد نظر تکراری می باشد')
              setSecondItemActive(true)
              setSecondItemText('')
              ref_input2.current.focus()

            }
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
      }

        let InsertPackDetails=(StationId)=>{
          MSSQL.connect(config).then(result2 => {console.log('result1 insert',result2)}).
          then(exec=>{
            MSSQL.executeUpdate(
              'SelectPackDetail @Id = '+StationId             
            ).then(() =>{
              console.log('set SelectPackDetail')
              MSSQL.connect(config).then(result3 => {console.log('result1 insert',result3)}).
              then(exec=>{
                console.log('set DeleteTempPacking')
                MSSQL.executeUpdate(
                  'DeleteTempPacking @Id = '+StationId             
                ).then(() =>{
                  console.log('set InsertLog')
                  MSSQL.connect(config).then(result4 => {console.log('result1 insert',result4)}).
                  then(exec=>{
                    MSSQL.executeUpdate(

                      'InsertLog @UserId = '+ UnitData.UserId +',@PackHeaderId = '+HeaderReturnId +',@Status ='+6+',@Station = '+StationId             
                    ).then(() =>{
                      setLastBarcode(SecondItemText)
                      console.log('set InsertLog Complete')
                            //InsertLog last update
        
                    })
                  })
                  .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})
    
                })
              })
              .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})

            })
          })
          .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})
        }




         
    let CheckControlId1SecondBarcode=()=>{

      if(SelectedProducts?.LevelPriority.toString() == '1')
      {

        SelectBarcode(SecondItemText)
      }
      else
      {


       MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery('DECLARE @ReturnId INT; EXEC GetPackHeaderBarcode @Barcode = ' + SecondItemText + ', @ReturnId =@ReturnId  OUTPUT;SELECT	@ReturnId as ReturnId')
          .then(result =>{
            console.log('result Products : ',result) 

            if(result[0].ReturnId.toString() == '6' || result[0].ReturnId.toString() == '1')
            {

              MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
              then(exec=>{
                MSSQL.executeQuery(
                   ' DECLARE @ReturnId INT; EXEC SelectBarcode @Barcode = ' + SecondItemText + ', @ReturnId =@ReturnId  OUTPUT;SELECT	@ReturnId as ReturnId'
                  ).then(result =>{
                  console.log('SelectBarcode : ',result) 
                  if(result[0].ReturnId.toString() == "0")
                  {
                    console.log('SecondItemText.substring(4,2).toUpperCase()',SecondItemText.substring(4,2).toUpperCase(),FirstItemText.substring(4,2).toUpperCase())
                     if(SecondItemText.substring(4,2).toUpperCase() == FirstItemText.substring(4,2).toUpperCase() && SecondItemText != FirstItemText)
                     {
                      let Counter=0;


                      MSSQL.connect(config).then(result1 => {console.log('result1 insert',result1)}).
                  then(exec=>{
                    MSSQL.executeUpdate(
                      'InsertBarcode @Barcode = ' + SecondItemText + ',@State =' +6 +',@Registered = ' + 1 +',@StationId = '+StationId
                    
                    ).then(() =>{

                        //InsertPackengTemp

                        MSSQL.connect(config).then(result2 => {console.log('result1 insert',result2)}).
                        then(exec=>{
                          MSSQL.executeUpdate(
                            'InsertTempPacking @Barcode = ' + SecondItemText  +',@PackHeader = ' + HeaderReturnId +',@StationId = '+StationId            
                          ).then(() =>{


                            InsertPackDetails(5)
                            setCurrentStep(CurrentStep+1)
                            setSecondItemText('')
                            if((CurrentStep+1)>=SelectedProducts?.PackQty)
                            {

                              setSecondItemActive(false)
                              setThirdItemActive(true)
                              ref_input3.current.focus()

                            }
                            else
                            {

                                ref_input2.current.focus()
                             
                            }



                          })
                        })
                        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
                        ref_input2.current.focus()
                        setSecondItemText('')
                      })




                    // InsertPackingTemp
                      
                    })
                  })
                  .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
                  ref_input2.current.focus()
                  setSecondItemText('')
                })
                     }
                     else
                     {
                      Alert.alert('بارکد وارد شده برای محصول دیگری است')
                      ref_input2.current.focus()
                      setSecondItemText('')
                     }
                  }
                  else
                  {
                    Alert.alert('بارکد قبلا ثبت شده است')
                    ref_input2.current.focus()
                      setSecondItemText('')
                  }
                  })
                
                })
               .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
               ref_input2.current.focus()
               setSecondItemText('')
              })
            }
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')
      
        ref_input2.current.focus()
        setSecondItemText('')
      });


         


      }

    }




       let GetPackHeaderBarcode=async(barcode)=>{
        MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery(
             ' DECLARE @ReturnId INT; EXEC GetPackHeaderBarcode @Barcode = ' + barcode + ', @ReturnId =@ReturnId  OUTPUT;SELECT	@ReturnId as ReturnId'
            ).then(result =>{
            console.log('result PackHeader : ',result) 
            setLastBarcode('_')
            setPackHeaderReturnId(result[0].ReturnId) 
              if(result[0].ReturnId.toString() == '6')
              {
               
                 
                  CheckControlId1FirstBarcode()
                
              
              }
              else  if(result[0].ReturnId.toString() == '0')
              {

                  //InsertPackHeader
              

                  if(FirstItemText.substring(0,1).toUpperCase() == SelectedProducts?.Symble.toUpperCase())
                  {

                 
                      if(FirstItemText.substring
                        (4+dtProduct[0].SSPP.length,dtProduct[0].SSPP.length+4+1).toUpperCase() 
                      == dtProduct[0].YearSymble.toUpperCase() 
                      &&
                      FirstItemText.substring(4,4+dtProduct[0].SSPP.length).toUpperCase()
                       == dtProduct[0].SSPP.toUpperCase()
                      )
                      {
                        Alert.alert('test')
                        // console.log('Datet time',new Date('2017-08-15'),'(SelectedProducts?.PtId) : ',(SelectedProducts?.PtId))
                        InsertPackHeader(FirstItemText,(SelectedProducts?.PtId),6,StationId)
                     
                         setFirstItemActive(false)
                         setSecondItemActive(true)
                         setSecondItemText('')
                         setCurrentStep(0)
                         ref_input2.current.focus()


                      }
                      else
                      {
                        Alert.alert('بارکد وارد شده برای بسته مورد نظر نمی باشد')
                        UpdateFirstItem()
                      }

                     }     
                 else
                  {
                    Alert.alert('نوع بسته بندی انتخاب شده اشتباه می باشد')
                    UpdateFirstItem()
                  }

              
  
              }
            else  if(result[0].ReturnId.toString() == '1')
            {
              Alert.alert('بارکد مورد نظر تکراری می باشد')
              UpdateFirstItem()

            }
          })
        })
        .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
       }






  useEffect(()=>{
   
    console.log('UnitData.ProductId',UnitData.ProductId)
    
    ref_input1.current.focus()
    GetPackingInformation(UnitData.ProductStyles)
    setTimeout(() => {
      GetProducts(UnitData.ProductId)
      console.log('UnitData.ProductId',UnitData.ProductId)
    }, 500);

    setTimeout(() => {
      DeviceInfo.getMacAddress().then((host) => {

        MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
        then(exec=>{
          MSSQL.executeQuery(
             'SelectStation '
            ).then(result =>{
              if(result.length>0)
              {
                 if(result.filter((a)=>a.HostName == host).length>0)
                 {
                  // Alert.alert (result.filter((a)=>a.HostName == host)[0].Id.toString())
                  UnitData.StationId = result.filter((a)=>a.HostName == host)[0].Id;
                  StationId = result.filter((a)=>a.HostName == host)[0].Id
                 }
                 else
                 {
                  props.navigation.goBack()
                  Alert.alert('این سیستم تعریف نشده است.لطفا با ادمین تماس بگیرید.')
                 
                 }
              }
              else
              {
                props.navigation.goBack()
                  Alert.alert('این سیستم تعریف نشده است.لطفا با ادمین تماس بگیرید.')
                  
              }
            })
          })
            .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')});
  
        
        
      });
    }, 1000);

    const backHandler =  BackHandler.addEventListener('hardwareBackPress', () => {
     return true
    }
      )
      return () => backHandler.remove()

    
    // GetProducts(UnitData.ProductId)
    //GetPackHeaderBarcode("P120042N050002")
  },[])



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
            <Text style={styles.HeaderTextStyle2}>بسته بندی محصول</Text>
            </View>
            <View style={{width: wp('15%'), alignItems: 'center', justifyContent: 'center'}}>
            {/* <TouchableOpacity onPress={()=>{RefreshForm()}}>   
                <Icon name = 'refresh' color='white' type="materialicon" size={30}/>
            </TouchableOpacity>  */}
            </View>
            <View style={{width: wp('10%')}}>
            
            </View>
        </View>

        <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent', borderWidth: 1,padding:10, borderRadius: 15, marginTop: wp('2%')}}>
         
         <View style={{flexDirection:'row',marginTop:10,width:'95%',justifyContent:'flex-end',alignItems:'center'}}>
                   
                <Text style={{ fontSize: wp('3.5%'), fontFamily: Font.FontSansB}}>{UnitData.UnitName}</Text>
                <Text style={{paddingLeft: wp('5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB,textAlign:'right'}}>واحد تولیدی : </Text>
                
          </View>

         <View style={{flexDirection:'row',marginTop:10,width:'95%',justifyContent:'flex-end',alignItems:'center'}}>
                   
                <Text style={{ fontSize: wp('3.5%'), fontFamily: Font.FontSansB}}>{UnitData.ProductName}</Text>
                <Text style={{paddingLeft: wp('5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB,textAlign:'right'}}>نام محصول : </Text>
                
          </View>

          <View style={{flexDirection:'row-reverse',marginTop:20,width:'95%',justifyContent:'flex-start',alignItems:'center'}}>
          <Text style={{paddingLeft: wp('1%'), fontSize: wp('4%'), fontFamily: Font.FontSansB,textAlign:'right'}}> نوع بسته بندی : </Text>
                   { ProductStyles.map((item)=>
          <TouchableOpacity style={{width: 'auto', alignSelf: 'center', justifyContent: 'center'}}
            onPress={()=>{

              setSelectedProducts(item)
              setFirstItemActive(true)
              setSecondItemActive(false)
              setThirdItemActive(false)
              setThirdItemText('')
              setFirstItemText('')
              setSecondItemText('')
              setLastBarcode('_')
              ref_input1.current.focus()
             }}
            >
                <TextInput style={{width: '85%', height: hp('4.5%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: SelectedProducts?.Symble == item.Symble ? 'green': ColorPalet._blue2, borderRadius: 10, marginHorizontal: '4.5%', textAlign: 'center'}} 
                 value={item.Title}
                  editable={false}
                  color='white'
                  />
            </TouchableOpacity>
            )
                    }
          
                
                   
             </View>

        
        </View>


        <View style={{backgroundColor: 'white', width : wp('95%'),  
        marginHorizontal: wp('2.5%'), elevation: 5, borderColor: 'transparent', borderWidth: 1,padding:10, borderRadius: 15, marginTop: wp('2%')}}>

          <View style={{  alignItems: 'center',justifyContent: 'space-between',marginTop:10,flexDirection:'row'}}>
                   
          <TouchableOpacity style={{width: 'auto', alignSelf: 'center', justifyContent: 'center'}}
            onPress={()=>{ }}
            disabled={true}
            >
                {/* <TextInput style={{width: '85%', height: hp('4.5%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: ColorPalet._blue2, borderRadius: 10, marginHorizontal: '4.5%', textAlign: 'center'}} 
                 value='ویرایش'
                  editable={false}
                  color='white'
                  /> */}
            </TouchableOpacity>


                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('5%'), fontFamily: Font.FontSansB,color:ColorPalet._blue}}> {CurrentStep} / {SelectedProducts?.PackQty}</Text>

                    
                </View>

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
                    //console.log('FirstItemText',v)
                    setFirstItemText(v)
                    // if(v.length ==14)
                    // {
                    //   GetPackHeaderBarcode(v)
                    // }
                  }}
                  onSubmitEditing={()=>{
                    
                    GetPackHeaderBarcode(FirstItemText)
                  
                  }}
                  />
                    {
                  <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:20}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>بارکد  محصول</Text>
                </View>

                    }
                    {
          
                <TextInput style={{width: '85%', height: hp('9%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={SecondItemText} 
                  editable={SecondItemActive}
                  showSoftInputOnFocus={showSecondItemKeyboard}
                  textAlign='center'
                  color='black'
                  ref={ref_input2}
                  onChangeText={(v)=>{
                    setSecondItemText(v)
                  }}
                  onSubmitEditing={()=>{
                    CheckControlId1SecondBarcode(SecondItemText)
                    // GetPackHeaderBarcode(FirstItemText)
                  }}
                  />
                  }

          <View style={{marginTop:20,justifyContent:'center',alignItems:'center'}}>
                   
                   <Text style={{ fontSize: wp('5%'), fontFamily: Font.FontSansB,color:ColorPalet._blue}}> آخرین بارکد محصول </Text>
                   <Text style={{fontSize: wp('4.5%'), fontFamily: Font.FontSansB,color:'red'}}> {LastBarcode}  </Text>
                   
             </View>


             <View style={{  alignItems: 'center',justifyContent: 'center',marginTop:20}}>
                    <Text style={{paddingRight: wp('7.5%'), fontSize: wp('4%'), fontFamily: Font.FontSansB}}>بارکد بسته بندی</Text>
                </View>
          
                <TextInput style={{width: '85%', height: hp('9%'), fontSize: wp('4%'), paddingVertical: 0,
                 backgroundColor: '#d9d9d9', borderRadius: 10, marginHorizontal: '7.5%', textAlign: 'center'}} value={ThirdItemText} 
                  editable={ThirdItemActive}
                  showSoftInputOnFocus={showThirdItemKeyboard}
                  textAlign='center'
                  color='black'
                  ref={ref_input3}
                  onChangeText={(v)=>{
                    setThirdItemText(v)
                  }}
                  onSubmitEditing={()=>{
                    if(FirstItemText == ThirdItemText)
                    {

                      MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
                      then(exec=>{
                        MSSQL.executeUpdate(
                           'SelectPackDetail @Id = ' + StationId 
                          ).then(result =>{


                          //Update Pack Header

                          MSSQL.connect(config).then(result1 => {console.log('result1',result1)}).
                          then(exec=>{
                            MSSQL.executeUpdate(
                               'UpdatePackHeader @Id = ' + HeaderReturnId +',@FullWeight = '+0
                              ).then(() =>{                         
                                  setThirdItemActive(false)
                                  setThirdItemText('')
                                  setFirstItemActive(true)
                                  setCurrentStep(0)
                                  setLastBarcode('_')
                                  setFirstItemText('')
                                  ref_input1.current.focus()
                              })
    
                          })
                          .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})



                          })

                      })
                      .catch(error => {Alert.alert('لطفا از اتصال به شبکه مطمئن شوید.')})






                    }
                    else
                    {
                      Alert.alert('بارکد بسته بندی مشابه نمی باشد.')
                      setThirdItemText('')
                      ref_input3.current.focus()
                    }

                  }}
                  />

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
  
  export default PackingInventory;
