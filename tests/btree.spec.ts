import * as Tree from "../src/btree"
import * as Maybe from "../src/maybe"

describe("binary search tree", () => {
    test("creates empty", () => {
        expect(Maybe.isNone(Tree.empty())).toBeTruthy()
    })

    test("creates singleton", () => {
        const tree = Tree.singleton("hi")("ho")
        const item = Tree.get(tree)("hi")
        const tested = Maybe.map(val => {
            expect(val).toBe("ho")
            return val
        })(item)
        expect(Maybe.isSome(tested)).toBeTruthy()
    })

    test("inserts elements", () => {
        const tree = Tree.insert(Tree.insert(Tree.empty())(10)("10"))(20)("20")
        expect(Tree.get(tree)(10)).toEqual([true, "10"])
        expect(Tree.get(tree)(20)).toEqual([true, "20"])
    })
})