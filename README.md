![Kaboom Logo](kaboom.png)

[**Kaboom.js**](https://kaboomjs.com/) is a JavaScript library that helps you make games fast and fun!

**NOTE**: still in early active development, expect breaking changes and lots of new features (check out `CHANGELOG.md` for these).

## Examples

(these are for the newest beta version or `kaboom@next`)

Lots of iteractive examples [here](https://kaboomjs.com/examples)

```html
<script type="module">

// import kaboom lib
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.js";

// initialize kaboom context
kaboom();

add([
    text("hello"),
    pos(120, 80),
]);

</script>
```
You can paste this directly into an `.html` file, open it in browser, and start playing around!

Kaboom uses a powerful component system to compose game objects and behaviors.
To make a flappy bird movement you only need a few lines
```js
// init context
kaboom();

// load a default sprite "bean"
loadBean();

// compose the player game object from multiple components
const froggy = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
]);

// press space to jump (.jump() is provided by "body" component)
keyPress("space", () => froggy.jump());
```

It's easy to make custom components to compose your game object behaviors:
```js
// add a game obj to the scene from a list of component
const player = add([
    // it renders as a sprite
    sprite("bean"),
    // it has a position
    pos(100, 200),
    // it has a collider
    area(),
    // it is a physical body which will respond to physics
    body(),
    // it has 8 health
    health(8),
    // or give it tags for controlling group behaviors
    "player",
    "friendly",
    // plain objects fields are directly assigned to the game obj
    {
        dir: vec2(-1, 0),
        dead: false,
        speed: 240,
    },
]);

// .collides() comes from "area" component, .hurt() comes from "health" component
player.collides("enemy", () => {
    player.hurt(1)
});
```

Blocky imperative syntax for describing behaviors
```js
// check fall death
player.action(() => {
    if (player.pos.y >= height()) {
        destroy(player);
        gameOver();
    }
});

// if 'player' collides with any object with tag "enemy", run the callback
player.collides("enemy", () => {
    player.hp -= 1;
});

// all objects with tag "enemy" will move towards 'player' every frame
action("enemy", (e) => {
    e.move(player.pos.sub(e.pos).unit().scale(e.speed));
});

// move up 100 pixels per second every frame when "w" key is held down
keyDown("w", () => {
    player.move(0, 100),
});
```

## Usage

### NPM

```sh
$ npm install kaboom@next
```

```js
import kaboom from "kaboom";

kaboom();

add([
    text("oh hi"),
    pos(80, 40),
]);
```

also works with CJS

```js
const kaboom = require("kaboom");
```

### Browser CDN

This exports a global `kaboom` function

```html
<script src="https://unpkg.com/kaboom@next/dist/kaboom.js"></script>
<script>
kaboom();
</script>
```

or use with es modules

```js
<script type="module">
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
kaboom();
</script>
```

works all CDNs that supports NPM packages, e.g. jsdelivr, skypack

## Dev

1. `npm run setup` to setup first time (installing dev packages)
1. `npm run dev` to watch & build lib
1. go to http://localhost:8000/demo
1. edit demos in `demo/` to test
1. make sure not to break any existing demos

## Community

[Github Discussions](https://github.com/replit/kaboom/discussions)

### Misc

- Thanks to ![abrudz](https://github.com/abrudz) for the amazing [APL386 font](https://abrudz.github.io/APL386/)
- Thanks to ![Polyducks](http://polyducks.co.uk/) for the amazing [kitchen sink font](https://polyducks.itch.io/kitchen-sink-textmode-font) font
- Find bitmap fonts: [Oldschool PC Font](https://int10h.org/oldschool-pc-fonts)
- Featured on [Console 50](https://console.substack.com/p/console-50)
- Thanks to [Umayr](https://github.com/umayr) for kindly offering the "kaboom" npm package name
