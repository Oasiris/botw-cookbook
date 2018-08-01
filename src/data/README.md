# Data folder (`src/data/`)

This folder contains the following types of files:

1. **Data JSONs**
    - Files: `materials.json, recipes.json, thumbs.json, matDesc.json, recipeDesc.json`
    - These JSONs are game data from _The Legend of Zelda: Breath of the Wild (2017)_ that I scraped or otherwise harvested and organized specifically for this cookbook's needs.
2. **Scripts**
    - There are two scripts I've written here: `bundler.js` and `exporter.js`.
    - The **bundler** combines the JSON data from the aforementioned data JSONs and other important data, such as effect descriptions and effect cooking logic, and exports this as a single JavaScript object through `module.exports`.
    - The **exporter**, when run, serializes and dumps the JS object from `bundler` into `all.json`.
3. **`all.json`**
    - This is the serialized output of `bundler.js` and is the single JSON exposed for use by the rest of the app.

## Reasoning

At first, I was having my app scripts retrieve data by directly importing or requiring the bundler script (`bundler.js`.) 

This ended up being extremely computationally inefficient. The bundler script performs a lot of data operations and can require up to 3-7 seconds to be processed. Multiply this by the number of scripts that require `bundler.js`, and the time cost adds up fast.

All of these data operations are predictable and really should only have to be run one time, so I created the script `exporter` to export the results of the bundler to a data JSON for my app scripts' use.

<!-- End of file -->