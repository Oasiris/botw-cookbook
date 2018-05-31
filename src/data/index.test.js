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

describe('thumbs', () => {
  it('thumbs works -- material -- Hightail Lizard', () => {
    const ele = index.materials.filter(m => m.name === 'Hightail Lizard');
    expect(ele.length).toBe(1);
    expect(ele[0].thumb).toBe('thumb-0-18.png');
  });

  it('thumbs works -- recipe -- Salt-Grilled Greens', () => {
    const ele = index.recipes.filter(m => m.name === 'Salt-Grilled Greens');
    expect(ele.length).toBe(1);
    expect(ele[0].thumb).toBe('thumb-3-8.png');
  });

  it('thumbs works -- recipe -- Herb Sauté', () => {
    const ele = index.recipes.filter(m => m.name === 'Herb Sauté');
    expect(ele.length).toBe(1);
    expect(ele[0].thumb).toBe('thumb-5-14.png');
  });
});

// console.log(index.recipes.filter(m => m.name.indexOf('é') !== -1))