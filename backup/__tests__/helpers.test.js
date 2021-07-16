const Helpers = require('./../utils/helpers.js')


describe('helpers test', () => {
  test('check if function generates something', () => {
    expect(Helpers.generateUUID()).not.toBeUndefined();
  })
  test('check if generated is UUID', () => {
    expect(Helpers.generateUUID()).toMatch(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/);
  })
})


describe('limit tests', () => {
  test('requires one argument', () => {
    expect(Helpers.limitToTen()).toBeUndefined()
  })
  test('if only accepts arrays', () => {
    expect(Helpers.limitToTen('string voorbeeld')).toBeUndefined()
    expect(Helpers.limitToTen([])).not.toBeUndefined()
  })
  test('if only return 10 items', () => {
    expect(Helpers.limitToTen([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12]).length).toBe(10)
  })
})

describe('lengthCheck test', () => {
  test('moet een string zijn', () => {
    expect(Helpers.lengthCheck(1201)).toBeFalsy()
    expect(Helpers.lengthCheck(-201)).toBeFalsy()
    expect(Helpers.lengthCheck(null)).toBeFalsy()
    expect(Helpers.lengthCheck([])).toBeFalsy()
    expect(Helpers.lengthCheck("string")).toBeDefined()
  })
  test('length of string kan niet meer dan 50 zijn', () => {
    expect(Helpers.lengthCheck("Een ietwat langere string")).toBeTruthy()
    expect(Helpers.lengthCheck("Een ietwat langere string en ietwat langere string en ietwat langere string en ietwat langere string en ietwat langere string ")).toBeFalsy()
  })
  test('moet beginnen met hoofdletter', () => {
    expect(Helpers.lengthCheck("een ietwat langere string")).toBeFalsy()
    expect(Helpers.lengthCheck("Een ietwat langere string")).toBeTruthy()
  })
})