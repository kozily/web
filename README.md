# Kozily web

[![Build Status](https://travis-ci.org/kozily/web.svg?branch=master)](https://travis-ci.org/kozily/web)

Kozily client, progressive web application for developing and interaction with
an Oz program.

## Introduction

Kozily is an integrated development environment for the
[Oz](https://en.wikipedia.org/wiki/Oz_(programming_language)) and a runtime for
that language, in the same way [Mozart](http://mozart.github.io/) is. However,
Kozily is specifically designed with students in mind, and has other
constraints in mind:

* It is designed to be a
  [progressive](https://developers.google.com/web/progressive-web-apps/) web
application so that students don't need to install or build any dependencies on
their machines, but even then can have a native-like experience.

* It doesn't support building standalone Oz applications, but instead just
  interprets the Oz programs directly inside the application.

* It exposes runtime concepts to the user, like the abstract machine and the
  execution sequence. This is very useful for students understanding the
basics of program execution.

## Development

Install docker, docker-compose and run `docker-compose up` to get the
application running in development mode at your local port 8080.

## License

MIT License

Copyright (c) 2016 Kozily

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

