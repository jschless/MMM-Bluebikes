# MMM-Bluebikes

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) to display the number of available bikes on the selected stations of the Boston Bluebikes public bike system.

## Credit
This code borrows extensively from [MMM-Bubi](https://github.com/balassy/MMM-Bubi/), so thank you to its creator [György Balássy](https://www.linkedin.com/in/balassy). I only changed the API interface.

## Features

By default this module displays the number of available bikes and the official names of the specified stations:

![Default](https://raw.githubusercontent.com/jschless/MMM-Bluebikes/master/demo.png)

## Using the module

To use this module follow these steps:

1. Clone this repository to the `modules` folder of your MagicMirror:

```bash
git clone https://github.com/jschless/MMM-Bluebikes.git
```

2. Add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Bluebikes',
      position: 'top_right',
      config: {
        updateInterval: 600000, // 10 minutes in milliseconds
        align: 'left',
        places: [
             {id: "76", name: "City Hall"},
	           {id: "116", name: "359 Broadway"},
	           {id: "107", name: "TPP"}
        ]
      }
    }
  ]
}
```

## Configuration options

| Option                 | Description
|------------------------|-----------
| `places`               | **REQUIRED** The list of Bluebikes stations to display. The unique `id` of the station is used to lookup the data from the webservice. The `name` is what will be displayed next to the station 
| `align`                | *Optional* Determines how the text is aligned within the module. Set this to `left` if the module is displayed on left side of the mirror, or to `right` if you positioned this module to the right column of the mirror.<br><br>**Type:** `string`<br>**Possible values**: `'left'` or `'right'`<br>**Default value:** `'left'`
| `updateInterval`       | *Optional* The frequency of how often the module should query the number of available bikes from the webservice. <br><br>**Type:** `int` (milliseconds) <br>**Default value:** `600000` milliseconds (10 minutes)

## How to get the place ID

In the `id` property of the objects in the `places` array of the configuration settings you have to specify the unique identifier of the station for which the module should display the bike availability.

To obtain the unique identifier of the station, look up the station you are interested in in the station_list.json file. 


## Got feedback?

Your feedback is more than welcome, please send your suggestions. I know almost nothing about js, but I can try to implement new features.

## Acknowledments

Many thanks to [Michael Teeuw](https://github.com/MichMich) for creating and maintaining the [MagicMirror²](https://github.com/MichMich/MagicMirror/) project fully open source.

## About the author

