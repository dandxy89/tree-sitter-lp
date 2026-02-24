package tree_sitter_lp_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lp "github.com/dandxy89/tree-sitter-lp/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lp.Language())
	if language == nil {
		t.Errorf("Error loading Lp grammar")
	}
}
