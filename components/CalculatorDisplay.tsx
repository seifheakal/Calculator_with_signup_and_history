import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  error: string | null;
}

export default function CalculatorDisplay({ 
  expression, 
  result, 
  error 
}: CalculatorDisplayProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.expressionContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expressionContent}
      >
        <Text style={styles.expressionText}>
          {expression || '0'}
        </Text>
      </ScrollView>
      
      <View style={styles.resultContainer}>
        <Text 
          style={[
            styles.resultText, 
            error && styles.errorText
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {error || result}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    margin: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expressionContainer: {
    maxHeight: 60,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  expressionContent: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: '100%',
  },
  expressionText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '400',
    textAlign: 'right',
    minHeight: 24,
  },
  resultContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 20,
  },
});