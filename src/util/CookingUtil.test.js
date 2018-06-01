import CookingUtil, { Mat } from './CookingUtil'
import R from 'ramda'

it('sandbox', () => {
  const m20 = Mat.ofId(20);
  const m40 = Mat.ofId(40);
  const price = CookingUtil.getRupeePrice([m20, m40]);
  console.log(price);
});


describe('Mat', () => {

  // ——————————————————————————————————————————————————————————————————————————
  describe('Instantiation/construction', () => {
    it('ofName: acorn', () => {
      const acorn = Mat.ofName('Acorn');
      expect(R.is(Mat, acorn)).toBe(true);
      expect(acorn.name).toEqual('Acorn');
    });

    it('ofName fails for misspelled input', () => {
      try {
        const x = Mat.ofName('oogey boogey ;)');
      } catch(err) {
        expect(true).toBe(true);
      }
    });

    // ——————————————————————————————————————————————

    it('ofId: Naydra\'s Horn (id: 62)', () => {
      const naydrasHorn = Mat.ofId(62);
      expect(R.is(Mat, naydrasHorn)).toBe(true);
      expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
    });

    it('ofId: Naydra\'s Horn w/ input "62"', () => {
      const naydrasHorn = Mat.ofId('62');
      expect(R.is(Mat, naydrasHorn)).toBe(true);
      expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
    });

    it('ofId fails for misspelled input', () => {
      try { 
        const x = Mat.ofId("not quite a number");
      } catch (err) {
        expect(true).toBe(true);
      }
    });
  });
  // ——————————————————————————————————————————————————————————————————————————

});


