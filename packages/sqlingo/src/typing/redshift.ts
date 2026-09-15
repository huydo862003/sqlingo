import {
  StrToTimeExpr,
} from '../expressions/expressions';
import {
  DataTypeExprKind,
} from '../expressions/types';
import type {
  ExpressionMetadata,
} from './dialect';
import {
  DialectTyping,
} from './dialect';

export class RedshiftTyping {
  static get EXPRESSION_METADATA (): ExpressionMetadata {
    const map: ExpressionMetadata = new Map(DialectTyping.EXPRESSION_METADATA);

    // Redshift's TO_TIMESTAMP returns TIMESTAMPTZ, not TIMESTAMP
    // https://docs.aws.amazon.com/redshift/latest/dg/r_TO_TIMESTAMP.html
    map.set(StrToTimeExpr, {
      returns: DataTypeExprKind.TIMESTAMPTZ,
    });

    return map;
  }
}
