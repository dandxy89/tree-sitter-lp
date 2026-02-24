/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// Case-insensitive keyword helper
const ci = (/** @type {string} */ word) =>
  new RegExp(
    word
      .split("")
      .map((c) =>
        /[a-zA-Z]/.test(c)
          ? `[${c.toLowerCase()}${c.toUpperCase()}]`
          : c === "."
            ? "\\."
            : c,
      )
      .join(""),
  );

// Identifier: matches the Logos lexer regex exactly.
const ID_SPECIAL = "!#$%&(),.;?@\\\\{}~'";
const ID_FIRST = `[a-zA-Z_${ID_SPECIAL}]`;
const ID_CONT = `[a-zA-Z0-9_${ID_SPECIAL}|>]`;
const IDENTIFIER_RE = new RegExp(
  `${ID_FIRST}${ID_CONT}*(-${ID_CONT}${ID_CONT}*)*`,
);

export default grammar({
  name: "lp",

  extras: ($) => [/[ \t\r\n]/, $.line_comment, $.block_comment],

  rules: {
    source_file: ($) =>
      seq(
        $.sense,
        $.objectives_section,
        $.constraints_section,
        repeat($._any_section),
        optional($.end_marker),
      ),

    sense: (_) =>
      token(
        choice(
          ci("minimize"),
          ci("minimise"),
          ci("minimum"),
          ci("min"),
          ci("maximize"),
          ci("maximise"),
          ci("maximum"),
          ci("max"),
        ),
      ),

    subject_to_keyword: (_) =>
      token(
        choice(
          /[sS][uU][bB][jJ][eE][cC][tT][ \t]+[tT][oO][ \t]*:?/,
          /[sS][uU][cC][hH][ \t]+[tT][hH][aA][tT][ \t]*:?/,
          /[sS]\.[tT]\.[ \t]*:?/,
          /[sS][tT][ \t]*:?/,
        ),
      ),

    bounds_keyword: (_) => token(choice(ci("bounds"), ci("bound"))),

    generals_keyword: (_) =>
      token(choice(ci("generals"), ci("general"), ci("gen"))),

    integers_keyword: (_) => token(choice(ci("integers"), ci("integer"))),

    binaries_keyword: (_) =>
      token(choice(ci("binaries"), ci("binary"), ci("bin"))),

    semi_continuous_keyword: (_) =>
      token(choice(ci("semi-continuous"), ci("semis"), ci("semi"))),

    sos_keyword: (_) => token(ci("sos")),

    end_marker: (_) => token(ci("end")),

    free_keyword: (_) => token(ci("free")),

    sos_type: (_) => token(choice(ci("s1"), ci("s2"))),

    number: (_) => token(/([0-9]+\.?[0-9]*|[0-9]*\.[0-9]+)([eE][+-]?[0-9]+)?/),

    infinity: (_) => token(/[+-]?[iI][nN][fF]([iI][nN][iI][tT][yY])?/),

    identifier: (_) => token(IDENTIFIER_RE),

    line_comment: (_) => token(seq("\\", /[^\n*][^\n]*/)),

    block_comment: (_) => token(seq("\\*", /[^*]*/, "*\\")),

    comparison_operator: (_) => choice("<=", ">=", "<", ">", "="),

    _numeric_value: ($) =>
      choice(
        $.number,
        $.infinity,
        seq("+", $.number),
        seq("-", $.number),
        seq("+", $.infinity),
        seq("-", $.infinity),
      ),

    term: ($) =>
      choice(
        seq($.number, $.identifier),
        seq($.infinity, $.identifier),
        $.identifier,
      ),

    linear_expression: ($) =>
      prec.left(
        seq(
          optional(choice("+", "-")),
          $.term,
          repeat(seq(choice("+", "-"), $.term)),
        ),
      ),

    objectives_section: ($) =>
      choice(
        seq($.linear_expression, repeat($.named_objective)),
        repeat1($.named_objective),
      ),

    named_objective: ($) =>
      seq(
        field("name", alias($.identifier, $.objective_name)),
        ":",
        $.linear_expression,
      ),

    constraints_section: ($) => seq($.subject_to_keyword, repeat($.constraint)),

    constraint: ($) =>
      choice(
        seq(
          field("name", alias($.identifier, $.constraint_name)),
          choice(":", "::"),
          $.linear_expression,
          $.comparison_operator,
          $._numeric_value,
        ),
        seq($.linear_expression, $.comparison_operator, $._numeric_value),
      ),

    _any_section: ($) =>
      choice(
        $.bounds_section,
        $.generals_section,
        $.integers_section,
        $.binaries_section,
        $.semi_continuous_section,
        $.sos_section,
      ),

    bounds_section: ($) => seq($.bounds_keyword, repeat($.bound_declaration)),

    bound_declaration: ($) =>
      choice(
        seq($.identifier, $.free_keyword),
        seq(
          $._numeric_value,
          $.comparison_operator,
          $.identifier,
          $.comparison_operator,
          $._numeric_value,
        ),
        seq($.identifier, $.comparison_operator, $._numeric_value),
        seq($._numeric_value, $.comparison_operator, $.identifier),
      ),

    generals_section: ($) => seq($.generals_keyword, repeat($.identifier)),

    integers_section: ($) => seq($.integers_keyword, repeat($.identifier)),

    binaries_section: ($) => seq($.binaries_keyword, repeat($.identifier)),

    semi_continuous_section: ($) =>
      seq($.semi_continuous_keyword, repeat($.identifier)),

    sos_section: ($) => seq($.sos_keyword, repeat($._sos_item)),

    _sos_item: ($) => choice($.sos_constraint_header, $.sos_entry),

    sos_constraint_header: ($) =>
      seq(
        field("name", alias($.identifier, $.sos_name)),
        ":",
        $.sos_type,
        "::",
      ),

    sos_entry: ($) => seq($.identifier, ":", $._numeric_value),
  },
});
