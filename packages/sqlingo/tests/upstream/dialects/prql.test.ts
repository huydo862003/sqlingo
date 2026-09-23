import {
  describe, test,
} from 'vitest';
import {
  Validator,
} from './validator';

class TestPRQL extends Validator {
  override dialect = 'prql' as const;

  testPrql () {
    this.validateAll(
      'from x',
      { write: { '': 'SELECT * FROM x' } },
    );
    this.validateAll(
      'from x derive a + 1',
      { write: { '': 'SELECT *, a + 1 FROM x' } },
    );
    this.validateAll(
      'from x derive x = a + 1',
      { write: { '': 'SELECT *, a + 1 AS x FROM x' } },
    );
    this.validateAll(
      'from x derive {a + 1}',
      { write: { '': 'SELECT *, a + 1 FROM x' } },
    );
    this.validateAll(
      'from x derive {x = a + 1, b}',
      { write: { '': 'SELECT *, a + 1 AS x, b FROM x' } },
    );
    this.validateAll(
      'from x derive {x = a + 1, b} select {y = x, 2}',
      { write: { '': 'SELECT a + 1 AS y, 2 FROM x' } },
    );
    this.validateAll(
      'from x take 10',
      { write: { '': 'SELECT * FROM x LIMIT 10' } },
    );
    this.validateAll(
      'from x take 10 take 5',
      { write: { '': 'SELECT * FROM x LIMIT 5' } },
    );
    this.validateAll(
      'from x filter age > 25',
      { write: { '': 'SELECT * FROM x WHERE age > 25' } },
    );
    this.validateAll(
      'from x derive {x = a + 1, b} filter age > 25',
      { write: { '': 'SELECT *, a + 1 AS x, b FROM x WHERE age > 25' } },
    );
    this.validateAll(
      "from x filter dept != 'IT'",
      { write: { '': "SELECT * FROM x WHERE dept <> 'IT'" } },
    );
    this.validateAll(
      "from x filter p == 'product' select { a, b }",
      { write: { '': "SELECT a, b FROM x WHERE p = 'product'" } },
    );
    this.validateAll(
      'from x filter age > 25 filter age < 27',
      { write: { '': 'SELECT * FROM x WHERE age > 25 AND age < 27' } },
    );
    this.validateAll(
      'from x filter (age > 25 && age < 27)',
      { write: { '': 'SELECT * FROM x WHERE (age > 25 AND age < 27)' } },
    );
    this.validateAll(
      'from x filter (age > 25 || age < 27)',
      { write: { '': 'SELECT * FROM x WHERE (age > 25 OR age < 27)' } },
    );
    this.validateAll(
      'from x filter (age > 25 || age < 22) filter age > 26 filter age < 27',
      { write: { '': 'SELECT * FROM x WHERE ((age > 25 OR age < 22) AND age > 26) AND age < 27' } },
    );
    this.validateAll(
      'from x sort age',
      { write: { '': 'SELECT * FROM x ORDER BY age' } },
    );
    this.validateAll(
      'from x sort {-age}',
      { write: { '': 'SELECT * FROM x ORDER BY age DESC' } },
    );
    this.validateAll(
      'from x sort {age, name}',
      { write: { '': 'SELECT * FROM x ORDER BY age, name' } },
    );
    this.validateAll(
      'from x sort {-age, +name}',
      { write: { '': 'SELECT * FROM x ORDER BY age DESC, name' } },
    );
    this.validateAll(
      'from x append y',
      { write: { '': 'SELECT * FROM x UNION ALL SELECT * FROM y' } },
    );
    this.validateAll(
      'from x remove y',
      { write: { '': 'SELECT * FROM x EXCEPT ALL SELECT * FROM y' } },
    );
    this.validateAll(
      'from x intersect y',
      { write: { '': 'SELECT * FROM x INTERSECT ALL SELECT * FROM y' } },
    );
    this.validateAll(
      'from x filter a == null filter null != b',
      { write: { '': 'SELECT * FROM x WHERE a IS NULL AND NOT b IS NULL' } },
    );
    this.validateAll(
      'from x filter (a > 1 || null != b || c != null)',
      { write: { '': 'SELECT * FROM x WHERE (a > 1 OR NOT b IS NULL OR NOT c IS NULL)' } },
    );
    this.validateAll(
      'from a aggregate { average x }',
      { write: { '': 'SELECT AVG(x) FROM a' } },
    );
    this.validateAll(
      'from a aggregate { average x, min y, ct = sum z }',
      { write: { '': 'SELECT AVG(x), MIN(y), COALESCE(SUM(z), 0) AS ct FROM a' } },
    );
    this.validateAll(
      'from a aggregate { average x, min y, sum z }',
      { write: { '': 'SELECT AVG(x), MIN(y), COALESCE(SUM(z), 0) FROM a' } },
    );
    this.validateAll(
      'from a aggregate { min y, b = stddev x, max z }',
      { write: { '': 'SELECT MIN(y), STDDEV(x) AS b, MAX(z) FROM a' } },
    );
  }
}

const t = new TestPRQL();

describe('TestPRQL', () => {
  test('prql', () => t.testPrql());
});
