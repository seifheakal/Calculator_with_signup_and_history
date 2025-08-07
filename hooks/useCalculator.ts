import { useReducer, useEffect } from 'react';
import { CalculatorState, CalculatorAction } from '@/types/calculator';
import { 
  evaluateExpression, 
  isOperator, 
  getLastChar, 
  canAddOperator, 
  canAddDecimal 
} from '@/utils/calculator';

interface UseCalculatorOptions {
  onCalculationComplete?: (expression: string, result: string) => void;
}

const initialState: CalculatorState = {
  expression: '',
  result: '0',
  hasResult: false,
  error: null,
};

const createCalculatorReducer = (onCalculationComplete?: (expression: string, result: string) => void) => 
  (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'number':
      if (state.hasResult && !isOperator(getLastChar(state.expression))) {
        // If we have a result and the last char isn't an operator, start fresh
        return {
          ...initialState,
          expression: action.value || '',
          result: action.value || '0',
        };
      }
      
      const newExpression = state.expression + action.value;
      return {
        ...state,
        expression: newExpression,
        result: newExpression,
        hasResult: false,
        error: null,
      };

    case 'operator':
      if (!action.value) return state;
      
      // If we have a result and no expression, use the result
      if (state.hasResult) {
        // Start fresh with just the result and new operator
        return {
          ...state,
          expression: state.result + action.value,
          hasResult: false,
          error: null,
        };
      }
      
      let expression = state.expression;
      
      // Check if we can add an operator
      if (!canAddOperator(expression)) {
        // If the last character is an operator, replace it
        if (expression.length > 0 && isOperator(getLastChar(expression))) {
          expression = expression.slice(0, -1);
        } else {
          return state; // Can't add operator
        }
      }
      
      return {
        ...state,
        expression: expression + action.value,
        hasResult: false,
        error: null,
      };

    case 'function':
      if (!action.value) return state;
      
      let funcExpression = state.expression;
      
      // If we have a result and no expression, use the result
      if (state.hasResult && !funcExpression && state.result !== '0') {
        return {
          ...state,
          expression: state.result + action.value + (action.value !== '(' && action.value !== ')' ? '(' : ''),
          hasResult: false,
          error: null,
        };
      }
      
      // Add opening parenthesis for functions
      const functionCall = action.value + '(';
      
      return {
        ...state,
        expression: funcExpression + functionCall,
        hasResult: false,
        error: null,
      };

    case 'decimal':
      if (!canAddDecimal(state.expression)) {
        return state;
      }
      
      const newDecimalExpression = state.expression + '.';
      return {
        ...state,
        expression: newDecimalExpression,
        result: newDecimalExpression,
        hasResult: false,
        error: null,
      };

    case 'equals':
      if (!state.expression) return state;
      
      const result = evaluateExpression(state.expression);
      
      // Check if it's an error message
      if (result.includes('Invalid') || result.includes('Cannot') || result.includes('Error')) {
        return {
          ...state,
          error: result,
          hasResult: false,
        };
      }
      
      // Call the callback with the successful calculation
      if (onCalculationComplete && state.expression && result !== '0') {
        onCalculationComplete(state.expression, result);
      }
      
      return {
        ...state,
        result,
        hasResult: true,
        error: null,
      };

    case 'backspace':
      if (state.hasResult) {
        return initialState;
      }
      
      const newExpr = state.expression.slice(0, -1);
      return {
        ...state,
        expression: newExpr,
        result: newExpr || '0',
        error: null,
      };

    case 'clear':
      // Clear only the current number being typed
      if (state.expression) {
        // Find the last complete number or operator
        const match = state.expression.match(/.*[+−×÷(]/);
        const baseExpression = match ? match[0] : '';
        
        return {
          ...state,
          expression: baseExpression,
          result: baseExpression || '0',
          error: null,
        };
      }
      return {
        ...state,
        expression: '',
        result: '0',
        hasResult: false,
        error: null,
      };

    case 'clearAll':
      return initialState;

    default:
      return state;
  }
};

export const useCalculator = (options?: UseCalculatorOptions) => {
  const [state, dispatch] = useReducer(
    createCalculatorReducer(options?.onCalculationComplete), 
    initialState
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      // Prevent default for calculator keys
      if (/[0-9+\-*/().=]/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Delete' || key === 'Escape') {
        event.preventDefault();
      }

      // Numbers
      if (/[0-9]/.test(key)) {
        dispatch({ type: 'number', value: key });
      }
      
      // Operators
      else if (key === '+') {
        dispatch({ type: 'operator', value: '+' });
      }
      else if (key === '-') {
        dispatch({ type: 'operator', value: '−' });
      }
      else if (key === '*') {
        dispatch({ type: 'operator', value: '×' });
      }
      else if (key === '/') {
        dispatch({ type: 'operator', value: '÷' });
      }
      
      // Functions and special characters
      else if (key === '(') {
        dispatch({ type: 'number', value: '(' });
      }
      else if (key === ')') {
        dispatch({ type: 'number', value: ')' });
      }
      else if (key === '.') {
        dispatch({ type: 'decimal' });
      }
      
      // Actions
      else if (key === 'Enter' || key === '=') {
        dispatch({ type: 'equals' });
      }
      else if (key === 'Backspace' || key === 'Delete') {
        dispatch({ type: 'backspace' });
      }
      else if (key === 'Escape') {
        dispatch({ type: 'clearAll' });
      }
    };

    // Only add event listener on web platform
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  return { state, dispatch };
};