; Keywords
(sense) @keyword
(subject_to_keyword) @keyword
(bounds_keyword) @keyword
(generals_keyword) @keyword
(integers_keyword) @keyword
(binaries_keyword) @keyword
(semi_continuous_keyword) @keyword
(sos_keyword) @keyword
(end_marker) @keyword
(free_keyword) @keyword

; SOS type
(sos_type) @type

; Operators
(comparison_operator) @operator

(linear_expression
  ["+" "-"] @operator)

; Signed numeric values in constraints/bounds
(constraint
  ["+" "-"] @operator)

(bound_declaration
  ["+" "-"] @operator)

(sos_entry
  ["+" "-"] @operator)

; Numbers
(number) @number

; Infinity
(infinity) @constant.builtin

; Labels / names
(objective_name) @label
(constraint_name) @label
(sos_name) @label

; Variables
(term
  (identifier) @variable)

(bound_declaration
  (identifier) @variable)

(generals_section
  (identifier) @variable)

(integers_section
  (identifier) @variable)

(binaries_section
  (identifier) @variable)

(semi_continuous_section
  (identifier) @variable)

(sos_entry
  (identifier) @variable)

; Comments
(line_comment) @comment
(block_comment) @comment
