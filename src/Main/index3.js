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

import {Font, Size, ColorPalet, FileManagement} from './../Data/Data';
import { Icon, colors } from 'react-native-elements';
import Modal from 'react-native-modal';
import { writeFile, readFile } from 'react-native-fs';
import DatePicker from './../../node_modules/react-native-jalaali-date-picker/src'

// import NoData from './Components/NoData';
// import Loading from './Components/Loading';


let SelectedStatusCode = 0
let SelectedVoucherHeaderId = 0
const VoucherStatusList=[{StatusTitle:'ثبت موقت', StatusCode:1},{StatusTitle:'تأیید نهایی', StatusCode:2}]


const ChoiceInventory = (props) => {


    const [UserList, setUserList]=useState([])
    const [SectionCodeList, setSectionCodeList]=useState([])
    const [CountingHeaderList, setCountingHeaderList]=useState([])
    const [CountingDetailList, setCountingDetailList]=useState([])
    const [StatusTitle, setStatusTitle]=useState('')
    const [StatusCode, setStatusCode] = useState('')
    const [StartDate, setStartDate]=useState('')
    const [GStartDate, setGStartDate]=useState(new Date())
    const [EndDate, setEndDate] = useState('')
    const [GEndDate, setGEndDate] = useState(new Date())
    const [SectionCode, setSectionCode] = useState('')
    const [IsStartDate, setIsStartDate] = useState(false)
    const [HeaderId, setHeaderId] = useState(0)
    const [isVisible, setisVisible] = useState(false)
    const [isVisibleExport, setisVisibleExport] = useState(false)
    const [isVisibleConfirmVoucher, setisVisibleConfirmVoucher] = useState(false)
    const [HeaderLock, setHeaderLock] = useState(false)
    const [isVisibleDate, setisVisibleDate] = useState(false)
    const [emptyData, setEmptyData] = useState(false)
    const [filterDate, setFilterDate] = useState(false)
    const [filterStatus, setFilterStatus] = useState(false)
    const [filterSection, setFilterSection] = useState(false)
    const [DisplaySectionCodeList, setDisplaySectionCodeList] = useState(false)
    const [DateValTemp, setDateValTemp] = useState('')
    const [GDateValTemp, setGDateValTemp] = useState(new Date())
  
  
    const [ShowFilterPanel, setShowFilterPanel] = useState(false)
    const [FilterButtonState, setFilterButtonState] = useState(false)



  return (

    <View style={[styles.Container,{}]}>
        {ShowFilterPanel &&
        <View style={{backgroundColor: 'white', height: hp('25%'), width: wp('100%'), elevation: 2}}>
          
          <View style={{width: '100%', height: '5%'}}></View>

          <View style={{width: '100%', height: '18%', flexDirection: 'row'}}>
            <View style={{width: '18%', height: '100%', paddingRight: '1%', justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableOpacity style={{width: '37%', height: '80%', backgroundColor: StatusTitle==''?'#d9d9d9':'gray', borderRadius: 35, justifyContent: 'center', alignItems: 'center'}} disabled={StatusTitle==''} onPress={()=>{ClearFilterStatus()}}>
                <Icon name = 'close' color='white' type="material" size= {20} />
              </TouchableOpacity>
            </View>
            <View style={{width: '47%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{width: '100%', height: '80%', backgroundColor: '#d9d9d9', borderRadius: 35}} onPress={()=>{SetVoucherStatus(true)
                                FilterStatusSelection()}}>
                <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'center', color: 'black'}}>{StatusTitle}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '20%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{width: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'right', color: 'black'}}>وضعیت سند</Text>
            </View>
            <View style={{width: '10%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>{FilterStatusSelection()}}>
                <View style={{width: 20, height: 20, backgroundColor: filterStatus?ColorPalet._blue:'white', borderColor: ColorPalet._smokey, borderWidth: 2, elevation: 2, borderRadius: 35}}/>
              </TouchableOpacity>
            </View>
          </View>
          
          
          {/* <SearchItem  IconName={'close'} IconType={'material'} IconSize = {20} IsSelect={filterSection} Content={SectionCode} ClearContent = {()=>{ClearFilterSection()}}/> */}
          
          <View style={{width: '100%', height: '18%', flexDirection: 'row'}}>
            <View style={{width: '18%', height: '100%', paddingRight: '1%', justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableOpacity style={{width: '37%', height: '80%', backgroundColor: SectionCode==''?'#d9d9d9':'gray', borderRadius: 35, justifyContent: 'center', alignItems: 'center'}} disabled={SectionCode==''} onPress={()=>{ClearFilterSection()}}>
                <Icon name = 'close' color='white' type="material" size= {20} />
              </TouchableOpacity>
            </View>
            <View style={{width: '47%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{width: '100%', height: '80%', backgroundColor: '#d9d9d9', borderRadius: 35}} onPress={()=>{SetDisplaySectionCodeList()
                                FilterSectionSelection()}}>
              <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'center', color: 'black'}}>{SectionCode}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '20%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{width: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'right', color: 'black'}}>کد بخش</Text>
            </View>
            <View style={{width: '10%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>{FilterSectionSelection()}}>
                <View style={{width: 20, height: 20, backgroundColor: filterSection?ColorPalet._blue:'white', borderColor: ColorPalet._smokey, borderWidth: 2, elevation: 2, borderRadius: 35}}/>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{width: '100%', height: '18%', flexDirection: 'row'}}>
            <View style={{width: '18%', height: '100%', paddingRight: '1%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{width: '37%', height: '80%', backgroundColor: StartDate==''?'#d9d9d9':'gray', borderRadius: 35, justifyContent: 'center', alignItems: 'center'}} disabled={StartDate==''} onPress={()=>{ClearFilterStartDate()}}>
                <Icon name = 'close' color='white' type="material" size= {20} />
              </TouchableOpacity>
            </View>
            <View style={{width: '47%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableOpacity style={{width: '100%', height: '80%', backgroundColor: '#d9d9d9', borderRadius: 35}} onPress={()=>{setIsStartDate(true)
                                setisVisibleDate(true)
                                FilterDateSelection()}}>
              <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'center', color: 'black'}}>{StartDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '20%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{width: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'right', color: 'black'}}>تاریخ سند</Text>
            </View>
            <View style={{width: '10%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={()=>{FilterDateSelection()}}>
                <View style={{width: 20, height: 20, backgroundColor: filterDate?ColorPalet._blue:'white', borderColor: ColorPalet._smokey, borderWidth: 2, elevation: 2, borderRadius: 35}}/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{width: '100%', height: '18%', flexDirection: 'row'}}>
            <View style={{width: '18%', height: '100%', paddingRight: '1%', justifyContent: 'center', alignItems: 'flex-end'}}>
            <TouchableOpacity style={{width: '37%', height: '80%', backgroundColor: EndDate==''?'#d9d9d9':'gray', borderRadius: 35, justifyContent: 'center', alignItems: 'center'}} disabled={EndDate==''} onPress={()=>{ClearFilterEndDate()}}>
                <Icon name = 'close' color='white' type="material" size= {20} />
              </TouchableOpacity>
            </View>
            <View style={{width: '47%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{width: '100%', height: '80%', backgroundColor: '#d9d9d9', borderRadius: 35}} onPress={()=>{setIsStartDate(false)
                                setisVisibleDate(true)
                                FilterDateSelection()}}>
              <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'center', color: 'black'}}>{EndDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '20%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            {/* <Text style={{width: '100%', fontFamily: Font.FontSansR, fontSize: wp('3.2%'), textAlignVertical: 'center', textAlign: 'right', color: 'black'}}>کد بخش</Text> */}
            </View>
            <View style={{width: '10%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            </View>
          </View>
          
          
          <View style={{width: '100%', height: '18%', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{width: '80%', height: '80%', backgroundColor: ColorPalet._blue, justifyContent: 'center', alignItems: 'center', borderRadius: 25}}
                              onPress={()=>{FilterButtonState?RemoveFilter():ApplyFilter()}}>
              <Text style={{fontFamily: Font.FontSansR, fontSize: wp('3.6%'), textAlignVertical: 'center', textAlign: 'center', color: 'white'}}>{FilterButtonState?'حذف فیلتر':'اعمال فیلتر'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', height: '5%'}}></View>

        </View>
        }
        {/* //<ScrollView > */}
          <View style={{backgroundColor: ColorPalet._smokey,
              height: ShowFilterPanel?hp('68%'):hp('100%'), width: wp('100%')}}>
             <View style={{backgroundColor: 'transparent',height:'90%', width: '90%', margin: '5%'}}>
             
            <FlatList
            data={CountingHeaderList}
            // ListEmptyComponent={!emptyData ? <Loading /> : <NoData />}
            renderItem={({item, index})=>(
              
              <View style={{width:'100%',backgroundColor:'white',
                justifyContent: 'space-between', height: hp('22%'),
                marginTop: 3, marginBottom: 3, borderRadius: 10, elevation: 2}}>
                
                <View style={{backgroundColor: 'white', height: '75%', borderTopStartRadius: 10, borderTopEndRadius: 10}}>
                  
                  <View style={{flexDirection: 'row', height: '28%'}}>
                    <TouchableOpacity style={{width: '30%', height: '100%'}} onPress={()=>{GetVoucherChangeStatusConfim(item.CountingHeaderId, item.StatusCode)}}>
                      <Text style={{fontFamily: item.StatusCode==1?Font.FontSansR:Font.FontSansB , fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'center', width: '100%', height: '80%',
                      borderRadius: 10, backgroundColor: item.StatusCode==1?'gray': ColorPalet._blue, color: 'white', margin: 5}}>{item.StatusCode==1?'ثبت موقت':'تأیید نهایی'}</Text>
                    </TouchableOpacity>
                    <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '40%'}}>{item.RegisterDate}</Text>
                    <Text style={{fontFamily: Font.FontSansR, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '30%', paddingRight: 20}}>تاریخ شمارش :</Text>
                  
                  </View>
                  
                  <View style={{borderRadius: 1, borderWidth: 0.75, borderStyle: 'dashed'}}></View>
                  
                  <View style={{flexDirection: 'row', height: '24%'}}>
                    
                    <TouchableOpacity style={{width: '30%', height: '100%'}} disabled = {item.StatusCode==1?true:false} onPress={()=>requestStoragePermission(item.CountingHeaderId)}>
                      <Text style={{fontFamily: item.StatusCode==1?Font.FontSansR:Font.FontSansB , fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'center', width: '100%', height: '90%',
                      borderRadius: 10, backgroundColor: item.StatusCode==1?ColorPalet._smokey: '#4fe35e', color: 'white', margin: 5}} >خروجی اکسل</Text>
                    </TouchableOpacity>
                    <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '50%'}}>{item.PeriodTitle}</Text>
                    <Text style={{fontFamily: Font.FontSansR, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '20%', paddingRight: 20}}>دوره :</Text>
                  
                  </View>
                  
                  <View style={{flexDirection: 'row', height: '24%'}}>
                    
                    <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '80%'}}>{item.StockTitle}</Text>
                    <Text style={{fontFamily: Font.FontSansR, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '20%', paddingRight: 20}}>انبار :</Text>
                  
                  </View>

                  <View style={{flexDirection: 'row', height: '24%'}}>
                    
                    <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '80%'}}>{item.UserTitle}</Text>
                    <Text style={{fontFamily: Font.FontSansR, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'right', width: '20%', paddingRight: 20}}>کاربر :</Text>
                  
                  </View>
                </View>
                
                <View style={{flexDirection: 'row', backgroundColor: 'white', height: '25%', borderBottomStartRadius: 10, borderBottomEndRadius: 10, borderStyle: 'dashed' }}>
                  
                  <View style={{width: '33%', height: '100%'}}>
                  
                  <TouchableOpacity style={{borderBottomLeftRadius: 10, backgroundColor: ColorPalet._blue}} onPress={()=>GoToVoucherList(item.CountingHeaderId, item.StatusCode==1?false:true)}>
                      <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'center', height: '100%', color: 'white'}}>جزئیات</Text>
                      
                    </TouchableOpacity>
                  </View>
                  
                  <View style={{width: '34%', height: '100%', borderRightWidth: 1, borderLeftWidth: 1, borderRightColor: 'white', borderLeftColor: 'white'}}>
                    <TouchableOpacity style={{backgroundColor: item.StatusCode==1?ColorPalet._blue:ColorPalet._smokey2}} onPress={()=>showMessage(item.CountingHeaderId)} disabled = {item.StatusCode==1?false:true}>
                      <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'center', height: '100%', color: 'white'}}>حذف</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={{width: '33%', height: '100%'}}>
                    <TouchableOpacity style={{borderBottomRightRadius: 10, backgroundColor: item.StatusCode==1?ColorPalet._blue:ColorPalet._smokey2}} onPress={()=>{props.navigation.push('Voucher', {_headerId: item.CountingHeaderId, _isContinue: true})}}  disabled = {item.StatusCode==1?false:true}>
                      <Text style={{fontFamily: Font.FontSansB, fontSize: wp('3%'), textAlignVertical: 'center', textAlign: 'center', height: '100%', color: 'white'}}>ویرایش</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              
            </View>
            
            )}
          />
          </View>
  

        </View>
        
        {/* </ScrollView> */}
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{
          props.navigation.push('PartInventory')
        }} style={styles.TouchableOpacityStyle} >
        <Icon name = 'add' color='white' type="material" size= {30} />
       
 </TouchableOpacity>
 <Modal style={{width:wp('80%'),  marginHorizontal: wp('10%')}}
        isVisible={isVisibleExport}
        onBackdropPress={() => setisVisibleExport(false)}>
        <View style={{height: hp('15%'), width:wp('80%'),  backgroundColor:'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: '65%', width:wp('80%'),  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: Font.FontSansB, color: ColorPalet.ModalHeaderText, fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>فایل اکسل خروجی با موفقیت ایجاد شد</Text>
            </View>
            <View style={{height: '35%', width:wp('80%'),  justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: ColorPalet._blue, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
              
                <TouchableOpacity style={{height: '100%', width:'100%', justifyContent: 'center'}} onPress={()=>{setisVisibleExport(false)}}>
                    {/* <Icon name = 'delete' size={wp('5%')} color='white' type="materialicon"/> */}
                    <Text style={{fontFamily: Font.FontSansB, color: 'white', fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>تأیید</Text>
                </TouchableOpacity>
           
            </View>
        </View>
      </Modal>

      <Modal style={{width:wp('80%'),  marginHorizontal: wp('10%')}}
        isVisible={isVisibleConfirmVoucher}
        onBackdropPress={() => setisVisibleConfirmVoucher(false)}>
        <View style={{height: hp('15%'), width:wp('80%'),  backgroundColor:'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: '65%', width:wp('80%'),  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: Font.FontSansB, color: ColorPalet.ModalHeaderText, fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>گزینه مورد نظر را انتخاب نمایید</Text>
            </View>
            <View style={{height: '35%', width:wp('80%'),  justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: ColorPalet._blue, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <TouchableOpacity style={{height: '100%', width:'50%', justifyContent: 'center'}} onPress={()=>{setisVisibleConfirmVoucher(false)}}>
                    {/* <Icon name = 'cancel' size={wp('5%')} color='white' type="materialicon"/> */}
                    <Text style={{fontFamily: Font.FontSansB, color: 'white', fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>انصراف</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={{height: '100%', width:'50%', justifyContent: 'center', borderLeftColor: ColorPalet.MainColor, borderLeftWidth: 1}} onPress={()=>{UpdateVoucherStatus()}}>
                    {/* <Icon name = 'delete' size={wp('5%')} color='white' type="materialicon"/> */}
                    <Text style={{fontFamily: Font.FontSansB, color: 'white', fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>{SelectedStatusCode==1?'تأیید سند':'برگشت از تأیید'}</Text>
                </TouchableOpacity>
          
            </View>
        </View>
      </Modal>

      <Modal style={{borderRadius: 35}}
      isVisible={isVisible}
      onBackdropPress={() => SetVoucherStatus()}>
      
      <View style={{height: 50, width:wp('70%'), marginLeft: wp('10%'), backgroundColor:'white', alignItems: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomColor: 'gray'}}>
      <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansB, color: ColorPalet.ModalHeaderText, fontSize: wp('3.5%'), textAlign: 'center', textAlignVertical: 'center'}}>وضعیت سند</Text>
      </View>
      {/* <View style={{height: 15, width:wp('70%'), marginLeft: wp('10%'), backgroundColor:'white'}}></View> */}
      <View style={{width:wp('70%'), marginLeft: wp('10%'),
        marginLeft: wp('10%'), height:UserList.length>5?300:'auto', backgroundColor:'white',
        justifyContent:'center', alignItems:'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
        <FlatList
          data={VoucherStatusList}
          renderItem={({item})=>(
            <View style={{marginBottom: 5, width:wp('70%')}}>
              <TouchableOpacity style={{width:'95%', height:55, marginLeft:'2.5%', flexDirection: 'row',
                  justifyContent:'center', alignItems:'center', borderBottomWidth:1, 
                  borderBottomColor:'#9A9DA1'}} onPress={()=>{GetSelectedStatus(item.StatusTitle, item.StatusCode)}}>
                <View style={{width: '80%', height: '100%', backgroundColor: 'white'}}>
                  <Text style={{width: '100%', height: '100%', backgroundColor: 'white',fontFamily: Font.FontSansB,
                   fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>{item.StatusTitle}</Text>
                </View>
          
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={{height: 20, width:wp('70%'), backgroundColor:'white', borderBottomRightRadius: 20, borderBottomLeftRadius: 35}}></View>
      </View>
    </Modal>

    <Modal style={{borderRadius: 35}}
      isVisible={DisplaySectionCodeList}
      onBackdropPress={() => setDisplaySectionCodeList(false)}>
      
      <View style={{height: 50, width:wp('70%'), marginLeft: wp('10%'), backgroundColor:'white', alignItems: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomColor: 'gray'}}>
      <Text style={{width: '100%', height: '100%', fontFamily: Font.FontSansB, color: ColorPalet.ModalHeaderText, fontSize: wp('3.5%'), textAlign: 'center', textAlignVertical: 'center'}}>وضعیت سند</Text>
      </View>
  
      <View style={{width:wp('70%'), marginLeft: wp('10%'),
        marginLeft: wp('10%'), height:SectionCodeList.length>5?300:'auto', backgroundColor:'white',
        justifyContent:'center', alignItems:'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
        <FlatList
          data={SectionCodeList}
          renderItem={({item})=>(
            <View style={{marginBottom: 5, width:wp('70%')}}>
              <TouchableOpacity style={{width:'95%', height:55, marginLeft:'2.5%', flexDirection: 'row',
                  justifyContent:'center', alignItems:'center', borderBottomWidth:1, 
                  borderBottomColor:'#9A9DA1'}} onPress={()=>{GetSectionCode(item.SectionCode)}}>
                <View style={{width: '80%', height: '100%', backgroundColor: 'white'}}>
                  <Text style={{width: '100%', height: '100%', backgroundColor: 'white',fontFamily: Font.FontSansB, fontSize: wp('3.2%'), textAlign: 'center', textAlignVertical: 'center'}}>{item.SectionCode}</Text>
                </View>
               
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={{height: 20, width:wp('70%'), backgroundColor:'white', borderBottomRightRadius: 20, borderBottomLeftRadius: 35}}></View>
      </View>
    </Modal>


    <Modal style={{justifyContent: 'center', width:wp('80%'), marginRight: wp('10%'), marginLeft: wp('10%')}}
        isVisible={isVisibleDate}
        onBackdropPress={() => setisVisibleDate(false)}>
        
          <View style={{ backgroundColor:'white', paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          <DatePicker
                showTitleDate={true}
                defDateString={DateValTemp}
                onChangeDate={(date)=>{
                
                setDateValTemp(date.toString('YYYY/MM/DD'))
                setGDateValTemp(new Date(date.toString('YYYY/MM/DD')))
            }}

            />
           </View>
            <View style={{height: hp('10%'), width:wp('80%'),  backgroundColor:'white', justifyContent: 'center', alignItems: 'center',  borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
              <TouchableOpacity style={[styles.ButtonStyle, {}]} onPress={()=>SetFilterDate()}>
                <Text style={[styles.ButtonTextStyle, { color: 'white', marginRight: 0, textAlignVertical: 'center'}]}>تأیید</Text>
              </TouchableOpacity>
            </View>

      </Modal>

        
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
  HeaderTextStyle2: {
    fontFamily: Font.FontSansB,
    fontSize: wp('4.5%'),
    width: '100%',
    color: ColorPalet._HeaderTitle,
    justifyContent: 'center',
    textAlign: 'center'

  },
  TouchableOpacityStyle:{
 
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalet._Header,
    borderRadius: 50,
    right: 30,
    bottom: 30,
    elevation: 3
  },
 
  FloatingButtonStyle: {
 
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  ButtonStyle2: {
    width: '100%',
    height: hp('4.5%'),
    backgroundColor:'#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default ChoiceInventory;