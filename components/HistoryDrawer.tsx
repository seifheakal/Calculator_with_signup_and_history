import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface HistoryDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(screenWidth * 0.85, 400);

export default function HistoryDrawer({ 
  isVisible, 
  onClose, 
  children 
}: HistoryDrawerProps) {
  const translateX = useSharedValue(DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateX.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateX.value = withTiming(DRAWER_WIDTH, { duration: 300 });
      overlayOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, DRAWER_WIDTH);
      }
    })
    .onEnd((event) => {
      if (event.translationX > DRAWER_WIDTH * 0.3 || event.velocityX > 500) {
        translateX.value = withTiming(DRAWER_WIDTH, { duration: 200 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        overlayOpacity.value = withTiming(0.5, { duration: 200 });
      }
    });

  if (!isVisible && translateX.value === DRAWER_WIDTH) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents={isVisible ? 'auto' : 'none'}>
      {/* Overlay */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
      </TouchableOpacity>

      {/* Drawer */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '-2px 0 10px rgba(0,0,0,0.25)',
      },
    }),
  },
});