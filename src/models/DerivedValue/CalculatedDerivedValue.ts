import { BinaryMathExpression } from '@models/BinaryMathExpression'
import { CompositionSource } from '@models/Composition'
import { DerivedValue } from '@models/DerivedValue/DerivedValue'
import { MathOperations } from '@models/MathOperations'
import { ReferenceableBase } from '@models/Reference'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class CalculatedDerivedValue
  extends BinaryMathExpression
  implements DerivedValue
{
  @jsonMember(String)
  public readonly label: string

  constructor(
    label: string,
    operand1: CompositionSource,
    operand2: CompositionSource,
    operation: MathOperations
  ) {
    super(operand1, operand2, operation)
    this.label = label
  }
}
