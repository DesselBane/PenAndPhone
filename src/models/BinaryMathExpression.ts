import { jsonReferenceMember } from '@helper/jsonReferenceMember'
import { Composable, CompositionSource } from '@models/Composition'
import { MathOperations } from '@models/MathOperations'
import { ReferenceableBase } from '@models/Reference'
import shortid from 'shortid'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class BinaryMathExpression
  extends ReferenceableBase
  implements CompositionSource<number>, Composable<number>
{
  public get compositionSources(): CompositionSource<number>[] {
    return [this._operand1, this._operand2]
  }

  @jsonReferenceMember
  private readonly _operand2: CompositionSource<number>
  @jsonMember(Number)
  private readonly _operation: MathOperations
  @jsonReferenceMember
  private readonly _operand1: CompositionSource<number>

  public get value(): number {
    switch (this._operation) {
      case MathOperations.plus:
        return this._operand1.value + this._operand2.value
      case MathOperations.minus:
        return this._operand1.value - this._operand2.value
      case MathOperations.multiply:
        return this._operand1.value * this._operand2.value
      case MathOperations.divide:
        return this._operand1.value / this._operand2.value
    }
  }

  constructor(
    operand1: CompositionSource<number>,
    operand2: CompositionSource<number>,
    operation: MathOperations
  ) {
    super()
    this._operand2 = operand2
    this._operation = operation
    this._operand1 = operand1
  }

  public readonly id: string = shortid()
}
