import * as Tree from "../src/btree"
import * as Maybe from "../src/maybe"

describe("binary search tree", () => {
    test("creates empty", () => {
        expect(Maybe.isNone(Tree.empty())).toBeTruthy()
    })

    test("creates singleton", () => {
        const tree = Tree.singleton("hi")("ho")
        expect(Tree.get("hi")(tree)).toEqual(Maybe.Some("ho"))
    })

    test("inserts elements", () => {
        const tree = Tree.insert(20)("20")(Tree.insert(10)("10")(Tree.empty()))
        expect(Tree.get(20)(tree)).toEqual(Maybe.Some("20"))
        expect(Tree.get(10)(tree)).toEqual(Maybe.Some("10"))
    })

    test("removes elements", () => {
        const tree =  Tree.insert(20)("20")(Tree.insert(10)("10")(Tree.empty()));
        const no20 = Tree.remove(20)(tree)
        expect(Tree.get(20)(no20)).toEqual(Maybe.None())
    })

    test("foldl", () => {
        let tree =  Tree.insert(20)("20")(Tree.insert(10)("10")(Tree.empty()));
        tree = Tree.insert(5)("5")(tree)
        const folded = Tree.foldl(testFold)([])(tree)
        expect(folded).toEqual(["5", "10", "20"])
    })

    test("foldr", () => {
        let tree =  Tree.insert(20)("20")(Tree.insert(10)("10")(Tree.empty()));
        tree = Tree.insert(5)("5")(tree)
        const folded = Tree.foldr(testFold)([])(tree)
        expect(folded).toEqual(["20", "10", "5"])
    })

    test("map", () => {
        let tree =  Tree.insert(20)("20")(Tree.insert(10)("10")(Tree.empty()));
        tree = Tree.insert(5)("5")(tree)
        let mapped = Tree.map(testMap)(tree)
        const folded = Tree.foldr(testFold)([])(mapped)
        expect(folded).toEqual(["Val: 20", "Val: 10", "Val: 5"])
    })
})

function testFold(k: number, v: string, a: string[]): string[] {
    return a.concat([v])
}

function testMap(k: number, v: string): string {
    return `Val: ${v}`
}