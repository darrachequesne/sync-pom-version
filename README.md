
# sync-pom-version

A small package to sync the `package.json` version with the `pom.xml` one (i.e. to be used with maven-release-plugin).

## Installation

```js
$ npm i --save sync-pom-version
```

## Usage

In your `package.json`:

```js
{
  "scripts": {
    "postinstall": "sync-pom-version <path-to-pom>"
  }
}
```

Or as a global package:

```
$ npm i -g sync-pom-version
$ sync-pom-version <path-to-pom> <path-to-package-json>
```
## Options

```
$ sync-pom-version --help

  Usage: sync-pom-version [pom.xml] [package.json]

  Options:

    -s, --source [source]  the regular expression used to parse the POM version (default: (\d+).(\d+).(\d+).*)
    -t, --target [target]  the replacement used to set the package.json version (default: $1.$2.$3)
    -h, --help             output usage information
```
