import {Image, StyleSheet, Text, View} from 'react-native';
import React, { FC, useEffect } from 'react';
import {Colors} from '@utils/Constants';
import Logo from '@assets/images/logo.jpeg'
import { screenHeight, screenWidth } from '@utils/Scaling';
import { navigate } from '@utils/NavigationUtils';

const SplashScreen:FC = () => {
    
    useEffect(()=>{
        const navigateUser = async()=>{
            try {
                navigate('CustomerLogin')
            } catch (error) {
                console.log("Navigation error from SplashScreen")
            }
        }

        const timeoutId = setTimeout(navigateUser,1000)
        return ()=>clearTimeout(timeoutId)
    },[])
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage}/>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center'
    ,alignItems: 'center'
  },
  logoImage:{
    height: screenHeight * 0.4,
    width: screenWidth *0.4,
    resizeMode: 'contain'
  }
});
