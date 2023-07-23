# Lint Staged TSC

A wrapper CLI around tsc-files that allows us to filter compilation output for staged files only

## Get started

Install peer depedencies
```
npm i -D typescript lint-staged tsc-files
```

Install this package

```
npm i -D @spidy88/lint-staged-tsc
```

Follow the instructions for [lint-staged](https://www.npmjs.com/package/lint-staged) to invoke `lint-staged-tsc` on your staged files. Here's an example from the package.json:
```
"lint-staged": {
  "*.{ts,tsx}": [
    "lint-staged-tsc --noEmit --strict"
  ]
}
```
## How it works

All parameters are forwarded to tsc-files. We then do a simple parse of the tsc-files output and
ignore any output not related to a staged file. It's a very primitive attempt and there are likely
many edge cases not taken into consideration but it should work for simple needs

## Why

We found ourselves needing to update our Typescript config but this resulted in hundreds of errors
across hundreds of files. In order to maintain velocity on product features, we only wanted to 
enforce the new rules across any files that get updated. Thus applying new rules to staged files
and ignoring all other files which will most definitely still have errors until we can address them.
