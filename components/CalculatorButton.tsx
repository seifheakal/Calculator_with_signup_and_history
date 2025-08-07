import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Platform 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface CalculatorButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'default' | 'operator' | 'equals' | 'clear' | 'function';
  style?: ViewStyle;
  textStyle?: TextStyle;
  span?: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CalculatorButton({
  onPress,
  title,
  variant = 'default',
  style,
  textStyle,
  span = 1,
}: CalculatorButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95, { duration: 100 });
      opacity.value = withSpring(0.8, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { duration: 150 });
      opacity.value = withSpring(1, { duration: 150 });
      runOnJS(onPress)();
    });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button];
    
    switch (variant) {
      case 'operator':
        return [...baseStyle, styles.operatorButton, style];
      case 'equals':
        return [...baseStyle, styles.equalsButton, style];
      case 'clear':
        return [...baseStyle, styles.clearButton, style];
      case 'function':
        return [...baseStyle, styles.functionButton, style];
      default:
        return [...baseStyle, style];
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'operator':
      case 'equals':
        return [...baseStyle, styles.operatorText, textStyle];
      case 'clear':
        return [...baseStyle, styles.clearText, textStyle];
      case 'function':
        return [...baseStyle, styles.functionText, textStyle];
      default:
        return [...baseStyle, textStyle];
    }
  };

  const buttonStyle = {
    ...StyleSheet.flatten(getButtonStyle()),
    ...(span > 1 && { gridColumnStart: 'span ' + span }),
  };

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedTouchableOpacity
        style={[buttonStyle, animatedStyle]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </AnimatedTouchableOpacity>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  operatorButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  operatorText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  equalsButton: {
    backgroundColor: '#14B8A6',
    borderColor: '#0D9488',
  },
  clearButton: {
    backgroundColor: '#f15b5c',
    borderColor: '#DC2626',
  },
  clearText: {
    color: '#FFFFFF',
  },
  functionButton: {
    backgroundColor: '#6366F1',
    borderColor: '#4F46E5',
  },
  functionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});