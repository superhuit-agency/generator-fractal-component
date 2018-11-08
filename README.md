This is a Yeoman generator to create fractal components boilerplate.

## Installation

Install [Yeoman](http://yeoman.io) and generator-fractal-component using [npm](https://www.npmjs.com/).

```bash
npm install -g yo
```
Either install the generator globally or as a dev dependency

```bash
npm install --save-dev generator-fractal-comp
```

## Configuration for Fractal
Create a `.yo-rc.json` file in the root of your project and set all the values according to your needs

```json
{
  "generator-fractal-component": {
    "componentsPath": "./styleguide/components",
    "prefixComponents": false,
    "updateLoaderCMD": {
      "cmd": "yarn",
      "args": ["fractal", "generate:sass"]
    },
    "componentTypes": [
      {
        "name": "atom",
        "path": "atoms",
        "prefix": "a"
      },
      {
        "name": "molecule",
        "path": "molecules",
        "prefix": "m"
      },
      {
        "name": "organism",
        "path": "organisms",
        "prefix": "o"
      },
      {
        "name": "template",
        "path": "templates",
        "prefix": "t"
      }
    ]
  }
}
```
## Run the generator

```bash
yo fractal-comp
```

## Preview
![Preview](preview.gif)

<br>

Enjoy 🤘
