Directly state
==============

[Directly](https://www.directly.com/) is an on-demand customer support tool. Read more
about Directly and how it's used in Calypso in the [`lib/directly` README](../../../lib/directly/README.md).

## Action Creators
These action creators return simple actions. The Directly API is called from the
[data-layer](../../data-layer/third-party/directly/README.md) when these actions
are intercepted in middleware.

* `initialize( config )`  
  Initializes the library with the given configuration options. See [the `api/directly`
  README](../../api/directly) for config options.
* `askQuestion( questionText, name, email )`
