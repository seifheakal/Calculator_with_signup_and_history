export const formatResult = (value: number): string => {
  // Handle special cases
  if (!isFinite(value)) {
    if (isNaN(value)) return 'Invalid Expression';
    return value > 0 ? 'Infinity' : '-Infinity';
  }

  // Round to 7 decimal places to prevent floating point errors
  const rounded = Math.round(value * 10000000) / 10000000;
  
  // Convert to string and remove trailing zeros
  let result = rounded.toString();
  
  // If it's a decimal, remove trailing zeros
  if (result.includes('.')) {
    result = result.replace(/\.?0+$/, '');
  }
  
  return result;
};

export const evaluateExpression = (expression: string): string => {
  let processedExpression = '';
  
  try {
    // Remove spaces and convert display operators to JavaScript operators
    processedExpression = expression
      .replace(/\s/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Handle scientific functions
    processedExpression = processedExpression
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**');

    // Check for balanced parentheses
    const openParens = (processedExpression.match(/\(/g) || []).length;
    const closeParens = (processedExpression.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      return 'Invalid Expression';
    }

    // Validate expression (basic safety check)
    if (!/^[0-9+\-*/.()Math.sincogtaqlr\s^]+$/.test(processedExpression.replace(/Math\./g, ''))) {
      return 'Invalid Expression';
    }

    // Remove leading zeros from numbers (except for decimals like 0.5)
    processedExpression = processedExpression.replace(/\b0+(\d)/g, '$1');

    // Evaluate the expression
    const result = Function(`"use strict"; return (${processedExpression})`)();
    
    if (typeof result !== 'number') {
      return 'Invalid Expression';
    }

    return formatResult(result);
  } catch (error) {
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Division by zero') || 
          processedExpression.includes('/0')) {
        return 'Cannot divide by zero';
      }
    }
    return 'Invalid Expression';
  }
};

export const isOperator = (char: string): boolean => {
  return ['+', '−', '×', '÷'].includes(char);
};

export const isFunction = (str: string): boolean => {
  return ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].some(fn => str.includes(fn));
};

export const getLastChar = (expression: string): string => {
  return expression.slice(-1);
};

export const canAddOperator = (expression: string): boolean => {
  if (expression.length === 0) return false;
  const lastChar = getLastChar(expression);
  return !isOperator(lastChar) && lastChar !== '(';
};

export const canAddDecimal = (expression: string): boolean => {
  // Find the last number in the expression
  const parts = expression.split(/[+−×÷()^]/).filter(Boolean);
  const lastPart = parts[parts.length - 1];
  
  // Check if the last part already contains a decimal
  return lastPart && !lastPart.includes('.');
};

export const getCurrentNumber = (expression: string): string => {
  // Extract the current number being typed
  const match = expression.match(/[+−×÷(^]?([0-9.]+)$/);
  return match ? match[1] : expression;
};