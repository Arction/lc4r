# Creating a pull request

GitHub pull requests are a place to propose concrete code changes to the package.

Anyone can create their own version of the package source code, publish it in GitHub in the form of a pull request and discuss with the package maintainers if this change could be integrated into the official package version.

Before creating a new pull request, please check the [list of existing pull requests](https://github.com/Arction/lcjs4r/pulls) in case there is already on-going discussion about the same or related topic.

Additionally, it can be valuable to know if there is [an existing issue](https://github.com/Arction/lcjs4r/issues) that is related to the proposed changes.

## Guidelines for creating pull requests

Pull requests should exist for improving the package in any way:

- Resolve an [issue](https://github.com/Arction/lcjs4r/issues)
- Improve usage syntax
- Integrate to work together with some other R package
- Add new feature
- Modify existing feature to work better or more intuitively

**Be sure to describe in the pull request description, what does it aim to improve?**

- When modifying existing features, include descriptions of current behavior and proposed behavior (including code snippets and pictures of produced data visualization)

New pull requests can be created [here](https://github.com/Arction/lcjs4r/compare)

# Developing the lc4r package

`lc4r` is based on [htmlwidgets](https://www.htmlwidgets.org/), a popular framework for porting `JavaScript` based data visualization tools to `R`.

To develop `lc4r` you don't really need to know much about `htmlwidgets` as the base idea is very simple. There are two parts to the `lc4r` package:

1. R binding
2. JavaScript binding

**R binding**

The R binding is a set of `R` documented R functions which users can access. They can be found in [the `R/` folder](https://github.com/Arction/lc4r/tree/master/R).

At least at the time of writing there is no `R` logic implemented **at all**. The `lc4r R` functions simply pass the user arguments into the JavaScript binding.

**JavaScript binding**

The JavaScript binding can be found in [`inst/htmlwidgets/lc4r.js`](https://github.com/Arction/lc4r/blob/master/inst/htmlwidgets/lc4r.js).
This is a single JavaScript file which receives all R user arguments and translates them into `LightningChart JS` configurations.

Over here, development requires understanding about `LightningChart JS` usage. Here are some useful resources:

- [LightningChart JS examples](https://www.arction.com/lightningchart-js-interactive-examples/) gallery, which allows live editing
- [LightningChart JS API documentation](https://www.arction.com/lightningchart-js-api-documentation)
