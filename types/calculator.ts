export interface CalculatorState {
  expression: string;
  result: string;
  hasResult: boolean;
  error: string | null;
}

export type CalculatorOperation = 
  | 'clear' 
  | 'clearAll' 
  | 'backspace' 
  | 'equals'
  | 'number'
  | 'operator'
  | 'function'
  | 'decimal';

export interface CalculatorAction {
  type: CalculatorOperation;
  value?: string;
}

export type ScientificFunction = 
  | 'sin' 
  | 'cos' 
  | 'tan' 
  | 'log' 
  | 'ln' 
  | 'sqrt' 
  | 'pow';