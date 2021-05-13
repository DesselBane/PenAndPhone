import { Composable, CompositionSource } from '@models/composable'
import { MathOperations } from '@models/MathOperations'
import shortid from 'shortid'

export class BinaryMathExpression implements CompositionSource, Composable {
  public get compositionSources(): CompositionSource[] {
    return [this._operand1, this._operand2]
  }
  private readonly _operand2: CompositionSource
  private readonly _operation: MathOperations
  private readonly _operand1: CompositionSource

  public get currentValue(): number {
    switch (this._operation) {
      case MathOperations.plus:
        return this._operand1.currentValue + this._operand2.currentValue
      case MathOperations.minus:
        return this._operand1.currentValue - this._operand2.currentValue
      case MathOperations.multiply:
        return this._operand1.currentValue * this._operand2.currentValue
      case MathOperations.divide:
        return this._operand1.currentValue / this._operand2.currentValue
    }
  }

  constructor(
    operand1: CompositionSource,
    operand2: CompositionSource,
    operation: MathOperations
  ) {
    this._operand2 = operand2
    this._operation = operation
    this._operand1 = operand1
  }

  public readonly id: string = shortid()
}
