import XCTest
import SwiftTreeSitter
import TreeSitterLp

final class TreeSitterLpTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lp())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lp grammar")
    }
}
