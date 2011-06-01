# Nosey - NodeJS CI

Nosey has one aim: stupid simple continuous integration. Set up Nosey on a server, point it to any projects you want it to watch, and sleep tight knowing any build failures will be reported as soon as they happen.

    npm install -g nosey
    cd ~/.nosey
    ln -s /path/to/your/project
    open http://localhost:4343/

You just symlink your project into `~/.nosey`, and Nosey will watch it vigilantly.

You can configure the behavior for Nosey with a `nosey.js` in your project root, but it shouldn't be necessary in most cases.

The one thing you might need - if Nosey can't autodetect it - is to specify what command to run to test. Here's an example `nosey.js`:

    { "name": "My Awesome Project"
    , "test": "bundle exec rake spec"
    , "interval": 300
    }

However, Nosey can autodetect the following cases:

- `package.json` -> `npm test`
- Rails project -> `rake db:migrate && rake spec`
- Makefile -> `make test`
