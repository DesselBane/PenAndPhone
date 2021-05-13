import { jsonReferenceMember } from '@helper/jsonReferenceMember'
import { Composable, CompositionSource } from '@models/Composition'
import { MathOperations } from '@models/MathOperations'
import { ReferenceableBase } from '@models/Reference'
import shortid from 'shortid'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class BinaryMathExpression
  extends ReferenceableBase
  implements CompositionSource, Composable
{
  public get compositionSources(): CompositionSource[] {
    return [this._operand1, this._operand2]
  }

  @jsonReferenceMember
  private readonly _operand2: CompositionSource
  @jsonMember(Number)
  private readonly _operation: MathOperations
  @jsonReferenceMember
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
    super()
    this._operand2 = operand2
    this._operation = operation
    this._operand1 = operand1
  }

  public readonly id: string = shortid()
}
