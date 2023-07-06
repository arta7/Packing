
import React,{useEffect} from 'react';
import {TabNavigator, TabBarBottom, createBottomTabNavigator
  ,createAppContainer,createStackNavigator,StackActions ,NavigationActions, createDrawerNavigator } 
from 'react-navigation';

import Dashboard  from './src/Main'
import Login  from './src/Auth/Login'
import Main  from './src/Main/index2'
import ChoiceInventory  from './src/Main/index3'
import PartInventory  from './src/Main/index4'
import PackingInventory  from './src/Main/index5'
import PackingStore from './src/Stores/index'



var AppContainer = createStackNavigator({ 
  PackingStore:{
    screen:PackingStore
  },
  Login:{
    screen:Login
  },
    Dashboard:{
    screen:Dashboard
  },
  Main: {
    screen: Main
  },
  ChoiceInventory: {
    screen: ChoiceInventory
  },    
  PartInventory: {
    screen: PartInventory
  },    
  PackingInventory: {
    screen: PackingInventory
  },    

 },
 {
    headerMode: 'none',
    // initialRouteName: 'ChangePincode'
    initialRouteName: 'Login'
  }
 
 )


 
 export default createAppContainer(AppContainer);



