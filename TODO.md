# TODO

- the `all.json` in `./src/data/` is a massive 96kb right now. There are a ton of optimizations that can be made.
  - In `recipes':
    - Instead of `"name"`, like `"ingredients":[["name","Fresh Milk"], <...>`, we could create something like `"ingredients": [["id", 48]]`. This is far less text.
  - shorten all of the property names.
    - Example: lines like `"thumb":"thumb-17-0.png"` come up a lot, but the only information that we _need_ to get from this is the `17-0` part. Why not
      - `"thumb": "17-0"`, or
      - `"img": "17-0"`?
- Assign ID's for families.
