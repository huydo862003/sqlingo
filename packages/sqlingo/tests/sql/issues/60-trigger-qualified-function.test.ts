// #60: Postgres CREATE TRIGGER with schema-qualified function name fails to parse
// Forward-port of upstream sqlglot 8e5e2557c (closes sqlglot#7527)
import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../../src/index';
import {
  Postgres,
} from '../../../src/dialects/postgres';

function roundtrip (sql: string): string {
  return parseOne(sql, {
    read: Postgres,
  }).sql({
    dialect: Postgres,
  });
}

describe('#60: CREATE TRIGGER with qualified function name', () => {
  test('unqualified function name', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION f()',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION F()',
    );
  });

  test('unqualified function with args', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION f(\'a\', 1)',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION F(\'a\', 1)',
    );
  });

  test('qualified table name', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON public.s FOR EACH ROW EXECUTE FUNCTION f()',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON public.s FOR EACH ROW EXECUTE FUNCTION F()',
    );
  });

  test('schema-qualified function name', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION public.f()',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION public.f()',
    );
  });

  test('schema-qualified PROCEDURE normalizes to FUNCTION', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE PROCEDURE public.f()',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION public.f()',
    );
  });

  test('quoted schema-qualified function name', () => {
    expect(roundtrip(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION "public"."f"()',
    )).toBe(
      'CREATE TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION "public"."f"()',
    );
  });

  test('CREATE CONSTRAINT TRIGGER with qualified function', () => {
    expect(roundtrip(
      'CREATE CONSTRAINT TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION public.f()',
    )).toBe(
      'CREATE CONSTRAINT TRIGGER t AFTER INSERT ON s FOR EACH ROW EXECUTE FUNCTION public.f()',
    );
  });

  test('catalog.schema.function qualified name', () => {
    expect(roundtrip(
      'CREATE TRIGGER t BEFORE UPDATE ON bar.bat FOR EACH ROW EXECUTE FUNCTION c.s.f(\'x\', 1)',
    )).toBe(
      'CREATE TRIGGER t BEFORE UPDATE ON bar.bat FOR EACH ROW EXECUTE FUNCTION c.s.f(\'x\', 1)',
    );
  });
});
