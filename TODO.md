# TODO

## Major

<!-- - **Refactor code so that `Mat` and `Rcp` return simple JS objects instead of classes.**
  - `Mat` and `Rcp` should become utility classes, with methods like `static ofName`, `static ofId`, `static isMat`, and/or `static isRcp`. (Somewhat reminiscent of factory classes, but the key distinction is that they are _not returning Class objects, but rather simple JS objects._
  - **This is important for cleanly incorporating Redux!** (And because the old `Mat`/`Rcp` objects didn't really serve any purpose other than `R.is(Mat, foo)` or `R.is(Rcp, bar)`. -->

---

### Major-minor

- **Solve `gh-pages` problem.**

- Clean `scripts` code by using `mathjs` NPM library for operations.

- Add an NPM script to `package.json` that will run the bundler/exporter/whatever.

---

### Minor

- the `all.json` in `./src/data/` is a massive 96kb right now. There are a ton of optimizations that can be made.
  - In `recipes':
    - Instead of `"name"`, like `"ingredients":[["name","Fresh Milk"], <...>`, we could create something like `"ingredients": [["id", 48]]`. This is far less text.
  - shorten all of the property names.
    - Example: lines like `"thumb":"thumb-17-0.png"` come up a lot, but the only information that we _need_ to get from this is the `17-0` part. Why not
      - `"thumb": "17-0"`, or
      - `"img": "17-0"`?
      
- Assign ID's for families.
