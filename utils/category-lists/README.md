# category-lists

This utility is a helper to aid in switching from defining a question's category in the frontmatter like:

```yaml
---
categories:
- animals
- spread
date: April 30, 2020
etc: ....
---

...content...
```

to story them in separate category pages in the `/_categories` directory, where the "name" is the base portion of the question content's filename:

```yaml
questions:
  - name: are-pets-from-a-shelter-safe
  - name: can-bats-in-us-get-covid19
```

This utility is indended to be used a single time, and is checked in for future reference.
