// import * as v from "../src/group-rules";
// 
// describe("group rules", () => {
//   test("or", () => {
//     expect(v.or([true, false, false])).toBe(true)
//     expect(v.or([false, false, false])).toBe(false)
//   })
//   test("and", () => {
//     expect(v.and([true, true, true])).toBe(true)
//     expect(v.and([true, true, false])).toBe(false)
//   })
//   test("n true", () => {
//     expect(v.nTrue(2)([true, true, false])).toBe(true)
//     expect(v.nTrue(2)([true, false, false])).toBe(false)
//   })
//   test("min true", () => {
//     expect(v.minTrue(2)([true, true, false])).toBe(true)
//     expect(v.minTrue(2)([true, true, false, true])).toBe(true)
//     expect(v.minTrue(2)([false, true, false])).toBe(false)
//   })
//   test("max true", () => {
//     expect(v.maxTrue(2)([true, true, false])).toBe(true)
//     expect(v.maxTrue(2)([true, false, false])).toBe(true)
//     expect(v.maxTrue(2)([true, true, true])).toBe(false)
//   })
//   test("n false", () => {
//     expect(v.nFalse(2)([true, false, false])).toBe(true)
//     expect(v.nFalse(2)([true, true, false])).toBe(false)
//   })
//   test("min true", () => {
//     expect(v.minFalse(2)([true, false, false])).toBe(true)
//     expect(v.minFalse(2)([false, true, false, false])).toBe(true)
//     expect(v.minFalse(2)([true, true, false])).toBe(false)
//   })
//   test("max true", () => {
//     expect(v.maxFalse(2)([true, true, false])).toBe(true)
//     expect(v.maxFalse(2)([true, false, false])).toBe(true)
//     expect(v.maxFalse(2)([false, false, false])).toBe(false)
//   })
// })
