// Regression test for #15: minification mangles class names, breaking sqlNames()
import {
  describe, test, expect,
} from 'vitest';
import {
  transpile,
} from '../src/index';
import {
  CountExpr,
  FloorExpr,
  SumExpr,
  AvgExpr,
  MaxExpr,
  MinExpr,
  AbsExpr,
  RoundExpr,
  CoalesceExpr,
  ConcatExpr,
  UpperExpr,
  LowerExpr,
  LengthExpr,
  CeilExpr,
  TrimExpr,
  LeftExpr,
  RightExpr,
  SubstringExpr,
  ReplaceExpr,
  ReverseExpr,
  RepeatExpr,
  Md5Expr,
  ExpExpr,
  LnExpr,
  LogExpr,
  SqrtExpr,
  StddevExpr,
  VarianceExpr,
  DateAddExpr,
  DateSubExpr,
  DateDiffExpr,
  YearExpr,
  MonthExpr,
  DayExpr,
} from '../src/expressions';

describe('sqlNames() must not depend on minified class names', () => {
  for (const [
    cls,
    name,
  ] of [
      [
        CountExpr,
        'COUNT',
      ],
      [
        FloorExpr,
        'FLOOR',
      ],
      [
        CeilExpr,
        'CEIL',
      ],
      [
        SumExpr,
        'SUM',
      ],
      [
        AvgExpr,
        'AVG',
      ],
      [
        MaxExpr,
        'MAX',
      ],
      [
        MinExpr,
        'MIN',
      ],
      [
        AbsExpr,
        'ABS',
      ],
      [
        RoundExpr,
        'ROUND',
      ],
      [
        CoalesceExpr,
        'COALESCE',
      ],
      [
        ConcatExpr,
        'CONCAT',
      ],
      [
        UpperExpr,
        'UPPER',
      ],
      [
        LowerExpr,
        'LOWER',
      ],
      [
        LengthExpr,
        'LENGTH',
      ],
      [
        TrimExpr,
        'TRIM',
      ],
      [
        LeftExpr,
        'LEFT',
      ],
      [
        RightExpr,
        'RIGHT',
      ],
      [
        SubstringExpr,
        'SUBSTRING',
      ],
      [
        ReplaceExpr,
        'REPLACE',
      ],
      [
        ReverseExpr,
        'REVERSE',
      ],
      [
        RepeatExpr,
        'REPEAT',
      ],
      [
        Md5Expr,
        'MD5',
      ],
      [
        ExpExpr,
        'EXP',
      ],
      [
        LnExpr,
        'LN',
      ],
      [
        LogExpr,
        'LOG',
      ],
      [
        SqrtExpr,
        'SQRT',
      ],
      [
        StddevExpr,
        'STDDEV',
      ],
      [
        VarianceExpr,
        'VARIANCE',
      ],
      [
        DateAddExpr,
        'DATE_ADD',
      ],
      [
        DateSubExpr,
        'DATE_SUB',
      ],
      [
        DateDiffExpr,
        'DATE_DIFF',
      ],
      [
        YearExpr,
        'YEAR',
      ],
      [
        MonthExpr,
        'MONTH',
      ],
      [
        DayExpr,
        'DAY',
      ],
    ] as const) {
    test(`${name}`, () => {
      expect(cls.sqlNames()).toContain(name);
    });
  }
});

describe('function roundtrip through transpile', () => {
  for (const sql of [
    'SELECT COUNT(*) FROM t',
    'SELECT FLOOR(x) FROM t',
    'SELECT CEIL(x) FROM t',
    'SELECT ABS(x) FROM t',
    'SELECT ROUND(x, 2) FROM t',
    'SELECT SUM(x), AVG(x), MAX(x), MIN(x) FROM t',
    'SELECT UPPER(x) FROM t',
    'SELECT LOWER(x) FROM t',
    'SELECT TRIM(x) FROM t',
    'SELECT COALESCE(x, y) FROM t',
    'SELECT LENGTH(x) FROM t',
    'SELECT CONCAT(a, b) FROM t',
    'SELECT LEFT(x, 3) FROM t',
    'SELECT RIGHT(x, 3) FROM t',
    'SELECT SUBSTRING(x, 1, 3) FROM t',
    'SELECT REPLACE(x, \'a\', \'b\') FROM t',
    'SELECT REVERSE(x) FROM t',
    'SELECT REPEAT(x, 3) FROM t',
    'SELECT MD5(x) FROM t',
    'SELECT EXP(x) FROM t',
    'SELECT LN(x) FROM t',
    'SELECT LOG(x) FROM t',
    'SELECT SQRT(x) FROM t',
    'SELECT STDDEV(x) FROM t',
    'SELECT VARIANCE(x) FROM t',
    'SELECT YEAR(x) FROM t',
    'SELECT MONTH(x) FROM t',
    'SELECT DAY(x) FROM t',
  ]) {
    test(`${sql}`, () => {
      expect(transpile(sql, {})[0]).toBe(sql);
    });
  }
});
