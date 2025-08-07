import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CalculatorDisplay from '@/components/CalculatorDisplay';
import CalculatorButton from '@/components/CalculatorButton';
import HistoryDrawer from '@/components/HistoryDrawer';
import CalculatorHistory from '@/components/CalculatorHistory';
import AuthForm from '@/components/AuthForm';
import UserProfile from '@/components/UserProfile';
import { History } from 'lucide-react-native';
import { useCalculator } from '@/hooks/useCalculator';
import { useAuth } from '@/hooks/useAuth';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

export default function NormalCalculator() {
  const { user, loading: authLoading } = useAuth();
  const [isHistoryDrawerVisible, setIsHistoryDrawerVisible] = useState(false);
  const { saveCalculation } = useCalculatorHistory(user?.id);
  
  // Enhanced calculator with history saving
  const { state, dispatch } = useCalculator({
    onCalculationComplete: (expression: string, result: string) => {
      // Save calculation to history when user is authenticated
      if (user?.id) {
        saveCalculation(expression, result);
      }
    },
  });

  const handleHistoryItemPress = (expression: string) => {
    // Load expression from history into calculator
    dispatch({ type: 'clearAll' });
    // Add each character of the expression
    for (const char of expression) {
      if (/[0-9.]/.test(char)) {
        dispatch({ type: 'number', value: char });
      } else if (['+', '−', '×', '÷'].includes(char)) {
        dispatch({ type: 'operator', value: char });
      } else if (char === '(') {
        dispatch({ type: 'number', value: '(' });
      } else if (char === ')') {
        dispatch({ type: 'number', value: ')' });
      }
    }
  };
  const handleNumberPress = (value: string) => {
    dispatch({ type: 'number', value });
  };

  const handleOperatorPress = (value: string) => {
    dispatch({ type: 'operator', value });
  };

  const handleFunctionPress = (value: string) => {
    if (value === '(' || value === ')') {
      dispatch({ type: 'number', value });
    } else {
      dispatch({ type: 'function', value });
    }
  };

  const handleEquals = () => {
    dispatch({ type: 'equals' });
  };

  const handleClear = () => {
    dispatch({ type: 'clear' });
  };

  const handleClearAll = () => {
    dispatch({ type: 'clearAll' });
  };

  const handleBackspace = () => {
    dispatch({ type: 'backspace' });
  };

  const handleDecimal = () => {
    dispatch({ type: 'decimal' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* User Profile Section */}
        {user && <UserProfile />}
        
        {/* History Button */}
        {user && (
          <View style={styles.historyButtonContainer}>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setIsHistoryDrawerVisible(true)}
            >
              <History size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Calculator Display */}
        <CalculatorDisplay
          expression={state.expression}
          result={state.result}
          error={state.error}
        />

        {/* Calculator Buttons */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.buttonContainer}>
            {/* Row 1 */}
            <CalculatorButton
              title="AC"
              onPress={handleClearAll}
              variant="clear"
            />
            <CalculatorButton
              title="C"
              onPress={handleClear}
              variant="clear"
            />
            <CalculatorButton
              title="⌫"
              onPress={handleBackspace}
              variant="clear"
            />
            <CalculatorButton
              title="÷"
              onPress={() => handleOperatorPress('÷')}
              variant="operator"
            />

            {/* Row 2 */}
            <CalculatorButton
              title="7"
              onPress={() => handleNumberPress('7')}
            />
            <CalculatorButton
              title="8"
              onPress={() => handleNumberPress('8')}
            />
            <CalculatorButton
              title="9"
              onPress={() => handleNumberPress('9')}
            />
            <CalculatorButton
              title="×"
              onPress={() => handleOperatorPress('×')}
              variant="operator"
            />

            {/* Row 3 */}
            <CalculatorButton
              title="4"
              onPress={() => handleNumberPress('4')}
            />
            <CalculatorButton
              title="5"
              onPress={() => handleNumberPress('5')}
            />
            <CalculatorButton
              title="6"
              onPress={() => handleNumberPress('6')}
            />
            <CalculatorButton
              title="−"
              onPress={() => handleOperatorPress('−')}
              variant="operator"
            />

            {/* Row 4 */}
            <CalculatorButton
              title="1"
              onPress={() => handleNumberPress('1')}
            />
            <CalculatorButton
              title="2"
              onPress={() => handleNumberPress('2')}
            />
            <CalculatorButton
              title="3"
              onPress={() => handleNumberPress('3')}
            />
            <CalculatorButton
              title="+"
              onPress={() => handleOperatorPress('+')}
              variant="operator"
            />

            {/* Row 5 */}
            <CalculatorButton
              title="("
              onPress={() => handleFunctionPress('(')}
            />
            <CalculatorButton
              title="0"
              onPress={() => handleNumberPress('0')}
            />
            <CalculatorButton
              title=")"
              onPress={() => handleFunctionPress(')')}
            />
            <CalculatorButton
              title="."
              onPress={handleDecimal}
            />

            {/* Row 6 */}
            <CalculatorButton
              title="="
              onPress={handleEquals}
              variant="equals"
              style={styles.equalsButton}
            />
          </View>
        </ScrollView>

        {/* Authentication Form */}
        {!user && <AuthForm />}

        {/* History Drawer */}
        {user && (
          <HistoryDrawer
            isVisible={isHistoryDrawerVisible}
            onClose={() => setIsHistoryDrawerVisible(false)}
          >
            <CalculatorHistory 
              userId={user.id}
              onHistoryItemPress={(expression) => {
                handleHistoryItemPress(expression);
                setIsHistoryDrawerVisible(false);
              }}
            />
          </HistoryDrawer>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridGap: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 32,
  },
  equalsButton: {
    gridColumnStart: 'span 4',
  },
  historyButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  historyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});