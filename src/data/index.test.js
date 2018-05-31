import index from './index';

// Basic tests

/**
 * Testing the exported variable 'additiveOnlyRecipes'.
 * 
 * Can be accessed as `index.additiveOnlyRecipes`.
 */
describe('additiveOnlyRecipes', () => {

  it('additiveOnlyRecipes was calculated correctly', () => {
    expect(index.additiveOnlyRecipes).not.toBe(undefined);
  });

  it('additiveOnlyRecipes is the correct length', () => {
    const aoRecipeNames = [ // 3, 4, 5, 28, 55, 70, 84, 113
      'Monster Curry',
      'Monster Rice Balls',
      'Monster Cake',
      'Nutcake',
      'Curry Pilaf',
      'Curry Rice',
      'Wheat Bread',
      'Sautéed Nuts'
    ];
    expect(index.additiveOnlyRecipes.length).toBe(aoRecipeNames.length);
  });
});