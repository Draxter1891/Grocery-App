import {FC, ReactNode} from 'react';
import {StyleSheet, ViewStyle, SafeAreaView, View} from 'react-native';
import React from 'react';

interface CustomeSafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomeSafeAreaViewProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.container}>
        <SafeAreaView />
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CustomSafeAreaView;
