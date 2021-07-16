
  // users kunnen een title sturen, maar die moet beginnen met een hoofdletter, 
  // niet langer zijn dan 50 tekens, en effectief een string zijn
  //in: parameter "title"
  // out is string (alles goed), of false (fouten)


  const Helpers =require('./../utils/helpers')


  describe('stringlength tester', () => {

    test('if string has been given', () => {
      expect(Helpers.checkTitleLength()).toBeFalsy();
      expect(Helpers.checkTitleLength(102)).toBeFalsy();
      expect(Helpers.checkTitleLength([])).toBeFalsy();
    })

    test('if string length is not too much', () => {
      expect(Helpers.checkTitleLength("Hello world").length).toBeLessThan(51);
      expect(Helpers.checkTitleLength("Hello world, how is it going, this is a title that should be a bit longer than the average one")).toBeFalsy();
    })

    test('string starts with a capital', () => {
      expect(Helpers.checkTitleLength("hello world")).toBeFalsy();
      expect(Helpers.checkTitleLength("Hello world")).toBe("Hello world");
    })
  })

