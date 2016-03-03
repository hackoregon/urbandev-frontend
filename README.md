# [Hack Oregon](http://www.hackoregon.org/) - Urban Development project
# README

## Purpose
This project is creating a data visualization tool, so that users can tell their own stories about urban change.

## Technology
The web site, [PlotPDX](http://www.plotpdx.com/prototype/), is a [Single-Page Application](https://en.wikipedia.org/wiki/Single-page_application) (SPA), implemented in JavaScript. The application running in a web browser accesses data from RESTful web services. See the [urbandev-backend](https://github.com/hackoregon/urbandev-backend) source repository for information about the [urbandev-backend web services](http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/).

The browser application is based on the [BootLeaf](https://github.com/bmcbride/bootleaf) template. It uses several JavaScript frameworks:

* [leaflet](http://leafletjs.com/): "an open-source JavaScript library
for mobile-friendly interactive maps."
* [leaflet-groupedlayercontrol](https://github.com/ismyrnow/Leaflet.groupedlayercontrol): "Leaflet layer control with support for grouping overlays together."
* [taffy](http://taffydb.com): "The JavaScript Database ... that brings database features into your JavaScript applications."
* [moment](http://momentjs.com/): "Parse, validate, manipulate, and display dates in JavaScript."
* [daterangepicker](http://www.daterangepicker.com/): "A JavaScript component for choosing date ranges. Designed to work with the Bootstrap CSS framework."

## To view the deployed application
Navigate to the web site, [http://www.plotpdx.com/prototype/](http://www.plotpdx.com/prototype/)

## To build the application
Clone this repository and then from the top-level dirctory, use [npm](https://www.npmjs.com/) to get dependencies:

`npm install`

Run [grunt](http://gruntjs.com/) to assemble the application files:

`grunt`

Open `index.html` in a browser to run the application. You should see a map of Portland, Oregon. There are also controls for selecting neighborhoods, types of data to display, and time periods. The web application is running in the browser on your local machine, but it queries [web services](http://ec2-52-88-193-136.us-west-2.compute.amazonaws.com/services/) to retrieve data about activities in Portland neighborhoods. The application _only_ displays information for the city of Portland, Oregon in the United States.

## To contribute to the project
Contact [Hack Oregon](http://www.hackoregon.org/) if you would like to work on this project. If you are already working on this project, please follow the ["Getting started as a contributor"](https://github.com/hackoregon/urbandev-frontend/blob/master/doc/GettingStartedAsAContributor.md) guidelines for submitting code.

## Project history
This repository was created during the Fall 2015 season of [Hack Oregon](http://www.hackoregon.org/). There had been some prior work on the [PlotPDX project](https://github.com/PlotPDX), but the [urbandev-frontend](https://github.com/hackoregon/urbandev-frontend) repository where you are now is the latest work on this project.
