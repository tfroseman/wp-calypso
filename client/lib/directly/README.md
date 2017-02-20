Directly
========

[Directly](https://www.directly.com/) is an on-demand customer support tool that we're
using to provide live chat support to unpaid customers. This module wraps the Directly
library and API to provide a modular interface to its global functions.

## Docs
- [Directly's website](https://www.directly.com/)
- [Directly integration and API documentation](https://cloudup.com/cySVQ9R_O6S)

## Usage

**Unless you have a very good reason, you should interact with Directly through [its
Redux interface](../../state/help/directly).**

Not all of the Directly API has been wrapped with this library. Refer to the [API
documentation](https://cloudup.com/cySVQ9R_O6S) to see other available methods, which
should be wrapped here rather than called using the global `DirectlyRTM()` function.

The following functions are provided:

#### `initialize( config )`

*This must be called before any other functions have effect.*

Configures Directly and loads all its third-party assets (about 200KB at the time of
writing). If the user has recently interacted with the Directly widget, the widget
will open up on initialization (an unavoidable part of the library's mount).

Configuration options can only be set once, so any tags/labels/etc you add will apply
to all Directly questions the user asks until the page reloads. This also means that
after the first call to `initialize` the function becomes a no-op.

`config` is an Object with these optional keys:
- `displayAskQuestion`: Boolean. Whether to display the ask form and widget by default or not. Default: `false`
- `questionCategory`: String. Category that will be assigned to the question asked.
- `customTags`: Array of strings. Tags that will be assigned to the question asked.
- `metadata`: Object. Key-Value metadata that will be assigned to the question asked.
- `userName`: String. The name that will be used to ask the question. Also, if present, the input field to enter user name won't be displayed.
- `userEmail`: String. The email address of the user who is asking the question. Also, if present, the input field to enter user email won't be displayed.
- `labels`: Object. The texts defined here will override the default text in the ask widget, the ask button and the header. Valid keys are `askBubble` and `askButton`.


Example:

```
import { initialize as initializeDirectly } from 'lib/directly';

const directlyConfig = {
	displayAskQuestion: true,
	questionCategory: 'bananaStand',
	customTags: [ 'ann', 'her?' ],
	metadata: {
		favoriteSong: 'The Final Countdown',
		preferredTransport: 'Segway',
	},
	userName: 'GOB Bluth',
	userEmail: 'gob@bluthcompany.com',
	labels: {
		askBubble: 'Ask\nour specialists',
		askButton: 'Submit your question',
	},
};

initializeDirectly( directlyConfig );
```

#### `askQuestion( questionText, name, email )`

Asks a question with the given params and opens the "Alerting experts" view. All parameters are required strings.

Example:

```
import { askQuestion as askDirectlyQuestion } from 'lib/directly';

askDirectlyQuestion(
	'What have we always said is the most important thing?',
	'Michael Bluth',
	'michael@bluthcompany.com'
);
```

## Upgrading Directly
We're self-hosting the primary Directly embed script. Instead of pulling from Directly's servers at
[https://www.directly.com/widgets/rtm/embed.js](https://www.directly.com/widgets/rtm/embed.js)
the script is hosted at
[http://widgets.wp.com/directly/embed.js](http://widgets.wp.com/directly/embed.js).
So if the Directly widget ever needs to be upgraded, you'll need to paste the new upgraded
script to our self-hosted file.

## Environments & testing
There are two Directly accounts so we can separate development / staging from production for testing.

* __Sandbox (dev/staging)__  
  Login: https://automattic-sandbox.directly.com  
	Apply to be an Expert: https://automattic-sandbox.directly.com/apply  

* __Production__  
  Login: https://automattic.directly.com  
	Apply to be an Expert: https://automattic.directly.com/apply

To test user interactions with Directly you'll want to apply for an Expert account
(most likely on the Sandbox environment). Once you apply your account will be reviewed
by an Expert Operations manager and approved. You most likely _don't_ want to be marked
as an "Official Expert" because user questions are routed more slowly to these accounts.

## Notes, quirks, and gotchas
- Directly's out-of-the-box integration code assumes you'll load their library on
every pageload, but we need finer control. So instead the `initialize()` function
provides on-demand integration in the spirit of the official script.  

- If a user has recently interacted with the Directly widget, it will open immediately
one `initialize()`. This is built-in to the system and we don't have much direct control
over it. There may be mitigation strategies if this becomes undesirable.  

- User questions are routed more slowly to "Official Experts", so if you don't see
questions appearing immediately in your Expert account you likely need to have the
"Official" designation dropped from your account.
