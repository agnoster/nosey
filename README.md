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

That's it. Every hour, for every project detected, nosey will run `npm test`. I'm trying to be as close to Pow in terms of usability as possible.

## Roadmap

In the future, nosey will add further autodetection to support the following use cases:

- `package.json` -> `npm test`
- `Rakefile` -> `rake spec`
- `Gemfile` -> prefix `bundle exec`
- `Makefile` -> `make test`
