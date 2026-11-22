// #61: Export optimizer rules so optimize({ rules }) can run a subset
import {
  describe, it, expect,
} from 'vitest';
import {
  parseOne, optimize, MappingSchema,
} from '../../../src/index';
import {
  RULES, qualify, qualifyColumns, qualifyTables,
  Scope, traverseScope, buildScope,
  annotateTypes,
  pushdownPredicates,
  simplify,
} from '../../../src/optimizer';
import {
  Postgres,
} from '../../../src/dialects/postgres';

const schema = new MappingSchema({
  doc: { id: 'INT', is_folder: 'BOOLEAN' },
  new: { id: 'INT', doc_id: 'INT' },
});

describe('#61: optimizer rule exports', () => {
  it('RULES is an array of functions', () => {
    expect(Array.isArray(RULES)).toBe(true);
    expect(RULES.length).toBeGreaterThan(0);

    for (const rule of RULES) {
      expect(rule).toBeTypeOf('function');
    }
  });

  it('qualify is exported and callable as a standalone rule', () => {
    expect(qualify).toBeTypeOf('function');
  });

  it('qualifyColumns and qualifyTables are exported', () => {
    expect(qualifyColumns).toBeTypeOf('function');
    expect(qualifyTables).toBeTypeOf('function');
  });

  it('scope API is exported', () => {
    expect(Scope).toBeTypeOf('function');
    expect(traverseScope).toBeTypeOf('function');
    expect(buildScope).toBeTypeOf('function');
  });

  it('individual rules are exported', () => {
    expect(annotateTypes).toBeTypeOf('function');
    expect(pushdownPredicates).toBeTypeOf('function');
    expect(simplify).toBeTypeOf('function');
  });

  it('qualify alone qualifies columns but preserves subquery shape', () => {
    const ast = parseOne(
      "SELECT (SELECT is_folder FROM doc WHERE id = new.doc_id) = TRUE FROM new",
      { read: Postgres },
    );

    const sql = optimize(ast, {
      schema,
      dialect: Postgres,
      rules: [qualify],
    }).sql({ dialect: Postgres });

    expect(sql).toBe(
      'SELECT (SELECT doc.is_folder AS is_folder FROM doc AS doc WHERE doc.id = new.doc_id) = TRUE AS _col_0 FROM new AS new',
    );
  });

  it('qualify + simplify expands star and removes dead conditions', () => {
    const sql = optimize(
      parseOne('SELECT * FROM doc WHERE 1 = 1 AND id > 2', { read: Postgres }),
      { schema, dialect: Postgres, rules: [qualify, simplify] },
    ).sql({ dialect: Postgres });

    expect(sql).toBe(
      'SELECT doc.id AS id, doc.is_folder AS is_folder FROM doc AS doc WHERE doc.id > 2',
    );
  });

  it('simplify alone removes dead conditions but does not qualify', () => {
    const sql = optimize(
      parseOne('SELECT * FROM doc WHERE 1 = 1 AND id > 2'),
      { schema, rules: [simplify] },
    ).sql();

    expect(sql).toBe(
      'SELECT * FROM doc WHERE id > 2',
    );
  });

  it('full optimize rewrites subquery into CTE + LEFT JOIN', () => {
    const sql = optimize(
      parseOne("SELECT (SELECT is_folder FROM doc WHERE id = new.doc_id) = TRUE FROM new", { read: Postgres }),
      { schema, dialect: Postgres },
    ).sql({ dialect: Postgres });

    expect(sql).toBe(
      'WITH "_u_0" AS (SELECT ARRAY_AGG("doc"."is_folder") AS "is_folder", "doc"."id" AS "_u_1" FROM "doc" AS "doc" GROUP BY "doc"."id")'
      + ' SELECT "_u_0"."is_folder" = TRUE AS "_col_0" FROM "new" AS "new"'
      + ' LEFT JOIN "_u_0" AS "_u_0" ON "_u_0"."_u_1" = "new"."doc_id"',
    );
  });
});
