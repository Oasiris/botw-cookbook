# TODO

- the `all.json` in `./src/data/` is a massive 96kb right now. There are a ton of optimizations that can be made.
  - In `recipes':
    - Instead of `"name"`, like `"ingredients":[["name","Fresh Milk"], <...>`, we could create something like `"ingredients": [["id", 48]]`. This is far less text.
  - shorten all of the property names.
    - Example: lines like `"thumb":"thumb-17-0.png"` come up a lot, but the only information that we _need_ to get from this is the `17-0` part. Why not
      - `"thumb": "17-0"`, or
      - `"img": "17-0"`?
- Assign ID's for families.

- Write a short script that will minify all of the png images in a folder. Apply that script to the `thumbs` folder (nested somewhere within `public`).
  - These thumbs are quite large -- they take up 3-5kb each, and there are 371 of them, for 1000-1600kb. I can't remember if I already attempted to minify them, but another go would not hurt.