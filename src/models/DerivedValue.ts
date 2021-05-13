import { BinaryMathExpression } from '@models/BinaryMathExpression'
import { CompositionSource } from '@models/composable'
import { Displayable } from '@models/Displayable'
import { MathOperations } from '@models/MathOperations'

export class DerivedValue extends BinaryMathExpression implements Displayable {
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
