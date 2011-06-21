# Nosey - NodeJS CI, testing your code all the time

Nosey has one aim: crazy simple continuous integration. I was always too lazy to actually do CI, so consider this by lazybutts, for lazybutts. If you're a CI pro running Jenkins/CruiseControl/whatever already, this probably isn't for you.

Set up Nosey on a server, point it to any projects you want it to watch, and sleep tight knowing any build failures will be reported as soon as they happen.

    npm install -g nosey
    cd ~/.nosey
    ln -s /path/to/your/project
    open http://localhost:4343/

## Assumptions

Currently, nosey makes the following assumptions:

1. Each project is symlinked in `~/.nosey`
2. Each project can be tested by running `npm test`

That's it. Every hour, for every project detected, nosey will run `npm test`. I'm trying to be as close to Pow in terms of ease-of-use as possible. It should be a fire-and-forget thing.

## Roadmap

In the future, nosey will add further autodetection to support the following use cases:

- `Makefile` -> `make test`
- `package.json` -> `npm test`
- `Rakefile` -> `rake spec` or `rake test` (introspect the Rakefile?)
- `Gemfile` -> prefix `bundle exec`
- `.rvmrc` -> run `rvm` if available

Alse want to add:

- Automatic update via version control
- Listen to webhooks for updates
- More notifications:
  - HTML5 browser notifications
  - Email
  - Twitter (?)

## License

Copyright 2011 Isaac Wolkerstorfer.
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
