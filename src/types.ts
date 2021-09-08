/**
 * Initialize kaboom context. The starting point of all kaboom games.
 *
 * @example
 * ```js
 * // this will create a blank canvas and import all kaboom functions to global
 * kaboom();
 *
 * // init with some configs (check out #KaboomConf for full config list)
 * // create a game with custom dimension, but stretch to fit container, keeping aspect ratio, with a clear color
 * kaboom({
 *     width: 320,
 *     height: 240,
 *     stretch: true,
 *     letterbox: true,
 *     font: "sinko",
 *     clearColor: [ 0, 0, 255, ],
 * });
 *
 * // all kaboom functions are imported to global automatically
 * add();
 * action();
 * keyPress();
 * vec2();
 *
 * // can also prevent kaboom from importing all functions to global and use a context handle
 * const k = kaboom({ global: false });
 *
 * k.add(...);
 * k.action(...);
 * k.keyPress(...);
 * k.vec2(...);
 * ```
 */
declare function kaboom(conf?: KaboomConf): KaboomCtx;

/**
 * Context handle that contains every kaboom function.
 */
interface KaboomCtx {
	/**
	 * Sets the root for all subsequent resource urls.
	 *
	 * @section Assets
	 *
	 * @example
	 * ```js
	 * loadRoot("https://myassets.com/");
	 * loadSprite("froggy", "sprites/froggy.png"); // will resolve to "https://myassets.com/sprites/frogg.png"
	 * ```
	 */
	loadRoot(path?: string): string,
	/**
	 * Load a sprite into asset manager, with name and resource url and optional config.
	 *
	 * @example
	 * ```js
	 * // due to browser policies you'll need a static file server to load local files
	 * loadSprite("froggy", "froggy.png");
	 * loadSprite("apple", "https://kaboomjs.com/sprites/apple.png");
	 *
	 * // slice a spritesheet and add anims manually
	 * loadSprite("froggy", "froggy.png", {
	 *     sliceX: 4,
	 *     sliceY: 1,
	 *     anims: {
	 *         run: {
	 *             from: 0,
	 *             to: 3,
	 *         },
	 *         jump: {
	 *             from: 3,
	 *             to: 3,
	 *         },
	 *     },
	 * });
	 * ```
	 */
	loadSprite(
		id: string | null,
		src: SpriteLoadSrc,
		conf?: SpriteLoadConf,
	): Promise<SpriteData>,
	/**
	 * Load sprites from a sprite atlas.
	 *
	 * @example
	 * ```js
	 * loadSpriteAtlas("sprites/dungeon.png", {
	 *     "hero": {
	 *         x: 128,
	 *         y: 68,
	 *         width: 144,
	 *         height: 28,
	 *         sliceX: 9,
	 *         anims: {
	 *             idle: { from: 0, to: 3 },
	 *             run: { from: 4, to: 7 },
	 *             hit: { from: 8, to: 8 },
	 *         },
	 *     },
	 * });
	 *
	 * const player = add([
	 *     sprite("hero"),
	 * ]);
	 *
	 * player.play("run");
	 * ```
	 */
	loadSpriteAtlas(
		src: SpriteLoadSrc,
		entries?: Record<string, SpriteAtlasEntry>,
	): Promise<Record<string, SpriteData>>,
	/**
	 * Load a sound into asset manager, with name and resource url.
	 *
	 * @example
	 * ```js
	 * loadSound("shoot", "horse.ogg");
	 * loadSound("shoot", "https://kaboomjs.com/sounds/scream6.mp3");
	 * ```
	 */
	loadSound(
		id: string,
		src: string,
	): Promise<SoundData>,
	/**
	 * Load a bitmap font into asset manager, with name and resource url and infomation on the layout of the bitmap.
	 *
	 * @example
	 * ```js
	 * // load a bitmap font called "04b03", with bitmap "fonts/04b03.png"
	 * // each character on bitmap has a size of (6, 8), and contains default ASCII_CHARS
	 * loadFont("04b03", "fonts/04b03.png", 6, 8);
	 *
	 * // load a font with custom characters
	 * loadFont("cp437", "cp437.png", 6, 8, "☺☻♥♦♣♠");
	 * ```
	 */
	loadFont(
		id: string,
		src: string,
		gridWidth: number,
		gridHeight: number,
		conf?: FontLoadConf,
	): Promise<FontData>,
	/**
	 * Load a shader into asset manager with vertex and fragment code / file url.
	 *
	 * @example
	 * ```js
	 * // load only a fragment shader from URL
	 * loadShader("outline", null, "/shaders/outline.glsl", true);
	 *
	 * // default shaders and custom shader format
	 * loadShader("outline",
	 *     `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	 *     // predefined functions to get the default value by kaboom
	 *     return def_vert();
	 * }`,
	 * `vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	 *     // turn everything blue-ish
	 *     return def_frag() * vec4(0, 0, 1, 1);
	 * }`, true);
	 * ```
	 */
	loadShader(
		name: string,
		vert?: string,
		frag?: string,
		isUrl?: boolean,
	): Promise<ShaderData>,
	/**
	 * Add a new loader to wait for before starting the game.
	 *
	 * @example
	 * ```js
	 * load(new Promise((resolve, reject) => {
	 *     // anything you want to do that stalls the game in loading state
	 *     resolve("ok");
	 * }));
	 * ```
	 */
	load<T>(l: Promise<T>): void,
	/**
	 * Get the width of game.
	 *
	 * @section Info
	 */
	width(): number,
	/**
	 * Get the height of game.
	 */
	height(): number,
	/**
	 * Get the center point of view.
	 *
	 * @example
	 * ```js
	 * // add froggy to the center of the screen
	 * add([
	 *     sprite("froggy"),
	 *     pos(center()),
	 *     // ...
	 * ]);
	 * ```
	 */
	center(): Vec2,
	/**
	 * Get the delta time since last frame.
	 *
	 * @example
	 * ```js
	 * // rotate froggy 100 deg per second
	 * froggy.action(() => {
	 *     froggy.angle += 100 * dt();
	 * });
	 * ```
	 */
	dt(): number,
	/**
	 * Get the total time since beginning.
	 */
	time(): number,
	/**
	 * Take a screenshot and get the dataurl of the image.
	 */
	screenshot(): string,
	/**
	 * If the game canvas is currently focused.
	 */
	focused(): boolean,
	/**
	 * Focus on the game canvas.
	 */
	focus(): void,
	/**
	 * Run something when assets finished loading.
	 *
	 * @example
	 * ```js
	 * const froggy = add([
	 *     // ...
	 * ]);
	 *
	 * // certain assets related data are only available when the game finishes loading
	 * ready(() => {
	 *     debug.log(froggy.numFrames());
	 * });
	 * ```
	 */
	ready(cb: () => void): void,
	/**
	 * Is currently on a touch screen device.
	 */
	isTouch(): boolean,
	/**
	 * Create and add a game obj to the scene, from a list of components or tags. The added and returned game obj will contain all methods from each component.
	 *
	 * @section Game Obj
	 *
	 * @example
	 * ```js
	 * // let's add our player character to the screen
	 * // we use a list of components to define who they are and how they actually work
	 * const player = add([
	 *     // it renders as a sprite
	 *     sprite("mark"),
	 *     // it has a position
	 *     pos(100, 200),
	 *     // it has a collider
	 *     area(),
	 *     // it is a physical body which will respond to physics
	 *     body(),
	 *     // you can easily make custom components to encapsulate reusable logics
	 *     doubleJump(),
	 *     health(8),
	 *     // give it tags for controlling group behaviors
	 *     "player",
	 *     "friendly",
	 *     // plain objects fields are directly assigned to the game obj
	 *     {
	 *         dir: vec2(-1, 0),
	 *         dead: false,
	 *         speed: 240,
	 *     },
	 * ]);
	 *
	 * // .jump is provided by body()
	 * player.jump();

	 * // .moveTo is provided by pos()
	 * player.moveTo(100, 200);
	 *
	 * // run something every frame
	 * // player will constantly move towards player.dir, at player.speed per second
	 * player.action(() => {
	 *     player.move(player.dir.scale(player.speed));
	 * });
	 *
	 * // .collides is provided by area()
	 * player.collides("tree", () => {
	 *     destroy(player);
	 * });
	 *
	 * // run this for all game objs with tag "friendly"
	 * action("friendly", (friend) => {
	 *     // .hurt is provided by health()
	 *     friend.hurt();
	 * });
	 * ```
	 */
	add<T>(comps: CompList<T>): GameObj<T>,
	/**
	 * Remove the game obj.
	 *
	 * @example
	 * ```js
	 * // every time froggy collides with anything with tag "fruit", remove it
	 * froggy.collides("fruit", (fruit) => {
	 *     destroy(fruit);
	 * });
	 * ```
	 */
	destroy(obj: GameObj<any>): void,
	/**
	 * Remove all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // destroy all objects with tag "bomb" when you click one
	 * clicks("bomb", () => {
	 *     destroyAll("bomb");
	 * });
	 * ```
	 */
	destroyAll(tag: Tag): void,
	/**
	 * Get a list of all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // get a list of all game objs with tag "bomb"
	 * const allBombs = get("bomb");
	 *
	 * // without args returns all current objs in the game
	 * const allObjs = get();
	 * ```
	 */
	get(tag?: Tag): GameObj<any>[],
	/**
	 * Run callback on every game obj with certain tag.
	 *
	 * @example
	 * ```js
	 * // how destroyAll() works
	 * every("fruit", destroy);
	 * ```
	 */
	every<T>(t: Tag, cb: (obj: GameObj<any>) => T): void,
	every<T>(cb: (obj: GameObj<any>) => T): void,
	/**
	 * Run callback on every game obj with certain tag in reverse order.
	 */
	revery<T>(t: Tag, cb: (obj: GameObj<any>) => T): void,
	revery<T>(cb: (obj: GameObj<any>) => T): void,
	/**
	 * Remove and re-add the game obj.
	 *
	 * @example
	 * ```js
	 * // mainly useful when you want to make something to draw on top
	 * readd(froggy);
	 * ```
	 */
	readd(obj: GameObj<any>): GameObj<any>,
	/**
	 * Get CompList<T> from DynCompList<T>.
	 */
	getComps<T>(comps: DynCompList<T>, ...args: any[]): CompList<T>,
	/**
	 * Define layers (the last one will be on top).
	 *
	 * @example
	 * ```js
	 * // defining 3 layers, "ui" will be drawn on top most, with default layer being "game"
	 * layers([
	 *     "bg",
	 *     "game",
	 *     "ui",
	 * ], "game");
	 *
	 * // use layer() comp to define which layer an obj belongs to
	 * add([
	 *     text(score),
	 *     layer("ui"),
	 *     fixed(),
	 * ]);
	 *
	 * // without layer() comp it'll fall back to default layer, which is "game"
	 * add([
	 *     sprite("froggy"),
	 * ]);
	 * ```
	 */
	layers(list: string[], def?: string): void,
	/**
	 * Register an event on all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // a custom event defined by body() comp
	 * // every time an obj with tag "bomb" hits the floor, destroy it and addKaboom()
	 * on("ground", "bomb", (bomb) => {
	 *     destroy(bomb);
	 *     addKaboom();
	 * });
	 * ```
	 */
	on(event: string, tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	/**
	 * Register "update" event (runs every frame) on all game objs with certain tag.
	 *
	 * @example
	 * ```js
	 * // move every "tree" 120 pixels per second to the left, destroy it when it leaves screen
	 * // there'll be nothing to run if there's no "tree" obj in the scene
	 * action("tree", (tree) => {
	 *     tree.move(-120, 0);
	 *     if (tree.pos.x < 0) {
	 *         destroy(tree);
	 *     }
	 * });
	 *
	 * // without tags it just runs it every frame
	 * action(() => {
	 *     debug.log("ohhi");
	 * });
	 * ```
	 */
	action(tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	action(cb: () => void): EventCanceller,
	/**
	 * Register "draw" event (runs every frame) on all game objs with certain tag.
	 */
	render(tag: Tag, cb: (obj: GameObj<any>) => void): EventCanceller,
	render(cb: () => void): EventCanceller,
	/**
	 * Register event when 2 game objs with certain tags collides. This function spins off an action() when called, please put it at root level and never inside another action().
	 *
	 * @example
	 * ```js
	 * collides("sun", "earth", () => {
	 *     addExplosion();
	 * });
	 * ```
	 */
	collides(
		t1: Tag,
		t2: Tag,
		cb: (a: GameObj<any>, b: GameObj<any>, side?: RectSide) => void,
	): EventCanceller,
	/**
	 * Register event when game objs with certain tags are clicked. This function spins off an action() when called, please put it at root level and never inside another action().
	 */
	clicks(
		tag: Tag,
		cb: (a: GameObj<any>) => void,
	): EventCanceller,
	/**
	 * Register event when game objs with certain tags are hovered. This function spins off an action() when called, please put it at root level and never inside another action().
	 */
	hovers(
		tag: Tag,
		cb: (a: GameObj<any>) => void,
	): EventCanceller,
	/**
	 * Camera shake.
	 *
	 * @example
	 * ```js
	 * // shake intensively when froggy collides with a "bomb"
	 * froggy.collides("bomb", () => {
	 *     shake(120);
	 * });
	 * ```
	 */
	shake(intensity: number): void,
	/**
	 * Get / set camera position.
	 *
	 * @example
	 * ```js
	 * // camera follows player
	 * player.action(() => {
	 *     camPos(player.pos);
	 * });
	 * ```
	 */
	camPos(pos: Vec2): Vec2,
	/**
	 * Get / set camera scale.
	 */
	camScale(scale: Vec2): Vec2,
	/**
	 * Get / set camera rotation.
	 */
	camRot(angle: number): number,
	/**
	 * Transform a point from world position to screen position.
	 */
	toScreen(p: Vec2): Vec2,
	/**
	 * Transform a point from screen position to world position.
	 */
	toWorld(p: Vec2): Vec2,
	/**
	 * Get / set gravity.
	 */
	gravity(g: number): number,
	/**
	 * Position
	 *
	 * @section Components
	 */
	pos(x: number, y: number): PosComp,
	pos(xy: number): PosComp,
	pos(p: Vec2): PosComp,
	pos(): PosComp,
	/**
	 * Scale.
	 */
	scale(x: number, y: number): ScaleComp,
	scale(xy: number): ScaleComp,
	scale(s: Vec2): ScaleComp,
	scale(): ScaleComp,
	/**
	 * Rotate (in degrees).
	 */
	rotate(a: number): RotateComp,
	/**
	 * Sets color (rgb 0-255).
	 *
	 * @example
	 * ```js
	 * // blue frog
	 * add([
	 *     sprite("froggy"),
	 *     color(0, 0, 255)
	 * ]);
	 * ```
	 */
	color(r: number, g: number, b: number): ColorComp,
	color(c: Color): ColorComp,
	color(): ColorComp,
	/**
	 * Sets opacity (0.0 - 1.0).
	 */
	opacity(o?: number): OpacityComp,
	/**
	 * Renders as sprite.
	 *
	 * @example
	 * ```js
	 * // minimal setup
	 * add([
	 *     sprite("froggy"),
	 * ]);
	 *
	 * // with config
	 * const froggy = add([
	 *     sprite("froggy", {
	 *         // start with animation "idle"
	 *         anim: "idle",
	 *     }),
	 * ]);
	 *
	 * // play / stop an anim
	 * froggy.play("jump");
	 * froggy.stop();
	 *
	 * // manually setting a frame
	 * froggy.frame = 3;
	 * ```
	 */
	sprite(spr: string | SpriteData, conf?: SpriteCompConf): SpriteComp,
	/**
	 * Renders as text.
	 *
	 * @example
	 * ```js
	 * // a simple score counter
	 * const score = add([
	 *     text("Score: 0"),
	 *     pos(24, 24),
	 *     { value: 0 },
	 * ]);
	 *
	 * player.collides("coin", () => {
	 *     score.value += 1;
	 *     score.text = "Score:" + score.value;
	 * });
	 *
	 * // set to another default font on start up ("sink" is a pixel font provided by default)
	 * kaboom({ font: "sink" });
	 * ```
	 */
	text(txt: string, conf?: TextCompConf): TextComp,
	/**
	 * Renders as rect.
	 *
	 * @example
	 * ```js
	 * // i don't know, could be an obstacle or somethign
	 * add([
	 *     rect(20, 40),
	 *     outline(4),
	 *     area(),
	 * ]);
	 * ```
	 */
	rect(w: number, h: number): RectComp,
	/**
	 * Collider. Will calculate from rendered comps (e.g. from sprite, text, rect) if no params given.
	 *
	 * @example
	 * ```js
	 * add([
	 *     sprite("froggy"),
	 *     // without args it'll auto calculate from the data sprite comp provides
	 *     area(),
	 * ]);
	 *
	 * add([
	 *     sprite("bomb"),
	 *     // scale to 0.6 of the sprite size
	 *     area({ scale: 0.6 }),
	 *     // we want the scale to be calculated from the center
	 *     origin("center"),
	 * ]);
	 *
	 * // define custom area with topleft and botright point
	 * const player = add([
	 *     sprite("froggy"),
	 *     area({ width: 20, height: 40. }),
	 * ])
	 *
	 * // die if player collides with another game obj with tag "tree"
	 * player.collides("tree", () => {
	 *     destroy(player);
	 * });
	 *
	 * // push player out of all other game obj with "solid" component
	 * player.action(() => {
	 *     player.pushOutAll();
	 * });
	 *
	 * // simple drag an drop
	 * let draggin = false;
	 *
	 * player.clicks(() => {
	 *     draggin = true;
	 * });
	 *
	 * player.action(() => {
	 *     if (draggin) {
	 *         player.pos = mousePos();
	 *     }
	 * })
	 *
	 * mouseRelease(() => {
	 *     draggin = false;
	 * });
	 *
	 * // check for collision with another single game obj
	 * player.action(() => {
	 *     if (player.isColliding(bomb)) {
	 *         score += 1;
	 *     }
	 * });
	 *
	 * // for more methods check out AreaComp
	 * ```
	 */
	area(conf: AreaCompConf): AreaComp,
	/**
	 * Origin point for render (default "topleft").
	 *
	 * @example
	 * ```js
	 * // set origin to "center" so it'll rotate from center
	 * add([
	 *     rect(40, 10),
	 *     rotate(45),
	 *     origin("center"),
	 * ]);
	 * ```
	 */
	origin(o: Origin | Vec2): OriginComp,
	/**
	 * Which layer this object belongs to.
	 */
	layer(l: string): LayerComp,
	/**
	 * Determines the draw order for objects on the same layer. Object will be drawn on top if z value is bigger.
	 */
	z(z: number): ZComp,
	/**
	 * Move towards a direction infinitely, and destroys when it leaves game view. Requires "pos" comp.
	 *
	 * @example
	 * ```js
	 * // enemy throwing feces at player
	 * const projectile = add([
	 *     sprite("feces"),
	 *     pos(player.pos),
	 *     area(),
	 *     move(player.pos.angle(enemy.pos), 1200),
	 * ]);
	 * ```
	 */
	move(direction: number | Vec2, speed: number): MoveComp,
	/**
	 * Follow another game obj's position.
	 */
	follow(obj: GameObj<any> | null, offset?: Vec2): FollowComp,
	/**
	 * Give obj an outline.
	 */
	outline(width?: number, color?: Color): OutlineComp,
	/**
	 * Physical body that responds to gravity. Requires "area" and "pos" comp. This also makes the object "solid".
	 *
	 * @example
	 * ```js
	 * // froggy jumpy
	 * const froggy = add([
	 *     sprite("froggy"),
	 *     // body() requires "pos" and "area" component
	 *     pos(),
	 *     area(),
	 *     body(),
	 * ]);
	 *
	 * // when froggy is grounded, press space to jump
	 * // check out BodyComp for more methods
	 * keyPress("space", () => {
	 *     if (froggy.grounded()) {
	 *         froggy.jump();
	 *     }
	 * });
	 *
	 * // a custom event provided by "body"
	 * froggy.on("ground", () => {
	 *     debug.log("oh no!");
	 * });
	 * ```
	 */
	body(conf?: BodyCompConf): BodyComp,
	/**
	 * Custom shader.
	 */
	shader(id: string): ShaderComp,
	/**
	 * Run certain action after some time.
	 */
	timer(n?: number, action?: () => void): TimerComp,
	/**
	 * Make other objects cannot move pass. Requires "area" comp.
	 */
	solid(): SolidComp,
	/**
	 * Unaffected by camera.
	 *
	 * @example
	 * ```js
	 * // this score counter better be fixed on top left and not affected by camera
	 * const score = add([
	 *     text(0),
	 *     pos(12, 12),
	 * ]);
	 * ```
	 */
	fixed(): FixedComp,
	/**
	 * Don't get destroyed on scene switch.
	 *
	 * @example
	 * ```js
	 * player.collides("bomb", () => {
	 *     // spawn an explosion and switch scene, but don't destroy the explosion game obj on scene switch
	 *     add([
	 *         sprite("explosion", { anim: "burst", }),
	 *         stay(),
	 *         lifespan(2),
	 *     ]);
	 *     go("lose", score);
	 * });
	 * ```
	 */
	stay(): StayComp,
	/**
	 * Handles health related logic and events.
	 *
	 * @example
	 * ```js
	 * const player = add([
	 *     health(3),
	 * ]);
	 *
	 * player.collides("bad", (bad) => {
	 *     player.hurt(1);
	 *     bad.hurt(1);
	 * });
     *
	 * player.collides("apple", () => {
	 *     player.heal(1);
	 * });
	 *
	 * player.on("hurt", () => {
	 *     play("ouch");
	 * });
	 *
	 * // triggers when hp reaches 0
	 * player.on("death", () => {
	 *     destroy(player);
	 *     go("lose");
	 * });
	 * ```
	 */
	health(hp: number): HealthComp,
	/**
	 * Destroy the game obj after certain amount of time
	 *
	 * @example
	 * ```js
	 * // spawn an explosion, destroy after 2 seconds and the switch scene
	 * add([
	 *     sprite("explosion", { anim: "burst", }),
	 *     lifespan(2, () => go("lose")),
	 * ]);
	 * ```
	 */
	lifespan(time: number, action?: () => void): LifespanComp,
	/**
	 * Get / set the cursor (css). Cursor will be reset to "default" every frame so use this in an per-frame action.
	 *
	 * @example
	 * ```js
	 * hovers("clickable", (c) => {
	 *     cursor("pointer");
	 * });
	 */
	cursor(c?: Cursor): Cursor,
	/**
	 * Load a cursor from a sprite, or custom drawing function.
	 *
	 * @example
	 * ```js
	 * loadSprite("froggy", "sprites/froggy.png");
	 *
	 * // use sprite as cursor
	 * regCursor("default", "froggy");
	 * regCursor("pointer", "apple");
	 *
	 * // use custom draw func as cursor
	 * regCursor("crosshair", (pos) => {
	 *     drawRect(pos, 12, 2);
	 *     drawRect(pos, 2, 12);
	 * });
	 *
	 * hovers("clickable", (c) => {
	 *     cursor("pointer");
	 * });
	 * ```
	 */
	regCursor(c: string, draw: string | ((mpos: Vec2) => void)): void,
	/**
	 * Enter / exit fullscreen mode.
	 *
	 * @example
	 * ```js
	 * // toggle fullscreen mode on "f"
	 * keyPress("f", (c) => {
	 *     fullscreen(!fullscreen());
	 * });
	 * ```
	 */
	fullscreen(f?: boolean): boolean,
	/**
	 * Get current mouse position (without camera transform).
	 *
	 * @section Input
	 */
	mousePos(): Vec2,
	/**
	 * Get current mouse position (after camera transform)
	 */
	mouseWorldPos(): Vec2,
	/**
	 * How much mouse moved last frame.
	 */
	mouseDeltaPos(): Vec2,
	/**
	 * Registers an event that runs every frame when a key is down.
	 *
	 * @example
	 * ```js
	 * // move left by SPEED pixels per frame every frame when "left" is being held down
	 * keyDown("left", () => {
	 *     froggy.move(-SPEED, 0);
	 * });
	 * ```
	 */
	keyDown(k: Key, cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user presses certain key.
	 *
	 * @example
	 * ```js
	 * // .jump() once when "space" is just being pressed
	 * keyPress("space", () => {
	 *     froggy.jump();
	 * });
	 * ```
	 */
	keyPress(k: Key, cb: () => void): EventCanceller,
	keyPress(cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user presses certain key (also fires repeatedly when they key is held).
	 *
	 * @example
	 * ```js
	 * // delete last character when "backspace" is being pressed and held
	 * keyPressRep("backspace", () => {
	 *     input.text = input.text.substring(0, input.text.length - 1);
	 * });
	 * ```
	 */
	keyPressRep(k: Key, cb: () => void): EventCanceller,
	keyPressRep(cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user releases certain key.
	 */
	keyRelease(k: Key, cb: () => void): EventCanceller,
	keyRelease(cb: () => void): EventCanceller,
	/**
	 * Registers an event that runs when user inputs text.
	 *
	 * @example
	 * ```js
	 * // type into input
	 * charInput((ch) => {
	 *     input.text += ch;
	 * });
	 * ```
	 */
	charInput(cb: (ch: string) => void): EventCanceller,
	/**
	 * Registers an event that runs every frame when mouse button is down.
	 */
	mouseDown(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when user clicks mouse.
	 */
	mouseClick(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when user releases mouse.
	 */
	mouseRelease(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs whenever user move the mouse.
	 */
	mouseMove(cb: (pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when a touch starts.
	 */
	touchStart(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs whenever touch moves.
	 */
	touchMove(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * Registers an event that runs when a touch ends.
	 */
	touchEnd(cb: (id: TouchID, pos: Vec2) => void): EventCanceller,
	/**
	 * If certain key is currently down.
	 *
	 * @example
	 * ```js
	 * // almost equivalent to the keyPress() example above
	 * action(() => {
	 *     if (keyIsDown("left")) {
	 *         froggy.move(-SPEED, 0);
	 *     }
	 * });
	 * ```
	 */
	keyIsDown(k: Key): boolean,
	/**
	 * If certain key is just pressed last frame.
	 */
	keyIsPressed(k?: Key): boolean,
	/**
	 * If certain key is just pressed last frame (accepts help down repeatedly).
	 */
	keyIsPressedRep(k?: Key): boolean,
	/**
	 * If certain key is just released last frame.
	 */
	keyIsReleased(k?: Key): boolean,
	/**
	 * If certain mouse is currently down.
	 */
	mouseIsDown(): boolean,
	/**
	 * If mouse is just clicked last frame.
	 */
	mouseIsClicked(): boolean,
	/**
	 * If mouse is just released last frame.
	 */
	mouseIsReleased(): boolean,
	/**
	 * If mouse moved last frame.
	 */
	mouseIsMoved(): boolean,
	/**
	 * Run the callback every n seconds.
	 *
	 * @example
	 * ```js
	 * // spawn a bomb at random position every frame
	 * loop(1, () => {
	 *     add([
	 *         sprite("bomb"),
	 *         pos(rand(0, width()), rand(0, height())),
	 *         area(),
	 *         body(),
	 *     ]);
	 * });
	 * ```
	 */
	loop(t: number, cb: () => void): EventCanceller,
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb?: () => void): Promise<void>,
	/**
	 * Play a piece of audio, returns a handle to control.
	 *
	 * @section Audio
	 *
	 * @example
	 * ```js
	 * // play a one off sound
	 * play("wooosh");
	 *
	 * // play a looping soundtrack (check out AudioPlayConf for more configs)
	 * const music = play("OverworldlyFoe", {
	 *     volume: 0.8,
	 *     loop: true
	 * });
	 *
	 * // using the handle to control (check out AudioPlay for more controls / info)
	 * music.pause();
	 * music.play();
	 * ```
	 */
	play(id: string, conf?: AudioPlayConf): AudioPlay,
	/**
	 * Yep.
	 */
	burp(conf?: AudioPlayConf): AudioPlay,
	/**
	 * Sets global volume.
	 *
	 * @example
	 * ```js
	 * // makes everything quieter
	 * volume(0.5);
	 * ```
	 */
	volume(v?: number): number,
	/**
	 * Get the underlying browser AudioContext.
	 */
	audioCtx: AudioContext,
	/**
	 * Get a random number (with optional bounds).
	 *
	 * @section Math
	 *
	 * @example
	 * ```js
	 * // a random number between 0 - 1
	 * rand();

	 * // a random number between 0 - 8
	 * rand(8);

	 * // a random number between 50 - 100
	 * rand(50, 100);
	 *
	 * // a random vec2 between vec2(0) and vec2(100)
	 * rand(vec2(0), vec2(100));
	 *
	 * // spawn something on the right side of the screen but with random y value within screen height
	 * add([
	 *     pos(width(), rand(0, height())),
	 * ]);
	 * ```
	 */
	rand(): number,
	rand<T extends RNGValue>(n: T): T,
	rand<T extends RNGValue>(a: T, b: T): T,
	randSeed(seed: number): number,
	/**
	 * Make a 2d vector.
	 *
	 * @example
	 * ```js
	 * // { x: 0, y: 0 }
	 * vec2();
	 *
	 * // { x: 10, y: 10 }
	 * vec2(10);
	 *
	 * // { x: 100, y: 80 }
	 * const pos = vec2(100, 80);
	 *
	 * // move to 150 degrees direction with by length 10
	 * pos = pos.add(dir(150).scale(10));
	 * ```
	 */
	vec2(x: number, y: number): Vec2,
	vec2(p: Vec2): Vec2,
	vec2(xy: number): Vec2,
	vec2(): Vec2,
	/**
	 * RGB color (0 - 255).
	 */
	rgb(r: number, g: number, b: number): Color,
	/**
	 * Rectangle area (0.0 - 1.0).
	 */
	quad(x: number, y: number, w: number, h: number): Quad,
	/**
	 * Choose a random item from a list.
	 *
	 * @example
	 * ```js
	 * // decide the best fruit randomly
	 * const bestFruit = choose(["apple", "banana", "pear", "watermelon"]);
	 * ```
	 */
	choose<T>(lst: T[]): T,
	/**
	 * rand(1) <= p
	 *
	 * @example
	 * ```js
	 * // every frame all objs with tag "unlucky" have 50% chance die
	 * action("unlucky", (o) => {
	 *     if (chance(0.5)) {
	 *         destroy(o);
	 *     }
	 * });
	 * ```
	 */
	chance(p: number): boolean,
	/**
	 * Linear interpolation.
	 */
	lerp(from: number, to: number, t: number): number,
	/**
	 * Map a value from one range to another range.
	 */
	map(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	/**
	 * Map a value from one range to another range, and clamp to the dest range.
	 */
	mapc(
		v: number,
		l1: number,
		h1: number,
		l2: number,
		h2: number,
	): number,
	/**
	 * Get directional vector from an angle
	 *
	 * @example
	 * ```js
	 * // move towards 80 deg direction at SPEED
	 * player.action(() => {
	 *     player.move(dir(80).scale(SPEED));
	 * });
	 * ```
	 */
	dir(deg: number): Vec2,
	/**
	 * Sin() motion between 2 values.
	 *
	 * @example
	 * ```js
	 * // change color with sin() like motion
	 * action("colorful", (c) => {
	 *     c.color.r = wave(0, 255, time());
	 *     c.color.g = wave(0, 255, time() + 1);
	 *     c.color.b = wave(0, 255, time() + 2);
	 * });
	 * ```
	 */
	wave(lo: number, hi: number, t: number): number,
	/**
	 * Convert degrees to radians.
	 */
	deg2rad(deg: number): number,
	/**
	 * Convert radians to degrees.
	 */
	rad2deg(rad: number): number,
	/**
	 * Make a new random number generator.
	 */
	rng(seed: number): RNG,
	colLineLine(l1: Line, l2: Line): Vec2 | null,
	colRectRect(r1: Rect, r2: Rect): boolean,
	drawSprite(id: string | SpriteData, conf?: DrawSpriteConf): void,
	// TODO: conf type
	drawText(txt: string, conf?: {}): void,
	drawRect(pos: Vec2, w: number, h: number, conf?: DrawRectConf): void,
	drawRectStroke(pos: Vec2, w: number, h: number, conf?: DrawRectStrokeConf): void,
	drawLine(p1: Vec2, p2: Vec2, conf?: DrawLineConf): void,
	drawTri(p1: Vec2, p2: Vec2, p3: Vec2, conf?: DrawTriConf): void,
	/**
	 * Define a scene.
	 */
	scene(id: SceneID, def: SceneDef): void,
	/**
	 * Go to a scene, passing all rest args to scene callback.
	 */
	go(id: SceneID, ...args: any[]): void,
	/**
	 * Get data from local storage, if not present can set to a default value.
	 */
	getData<T>(key: string, def?: T): T,
	/**
	 * Set data from local storage.
	 */
	setData(key: string, data: any): void,
	/**
	 * Import a plugin.
	 */
	plug<T>(plugin: KaboomPlugin<T>): void,
	/**
	 * Debug stuff.
	 */
	debug: Debug,
	/**
	 * All chars in ASCII.
	 */
	ASCII_CHARS: string,
	/**
	 * All chars in CP437.
	 */
	CP437_CHARS: string,
	/**
	 * Left directional vector vec2(-1, 0).
	 */
	LEFT: Vec2,
	/**
	 * Right directional vector vec2(1, 0).
	 */
	RIGHT: Vec2,
	/**
	 * Up directional vector vec2(0, -1).
	 */
	UP: Vec2,
	/**
	 * Down directional vector vec2(0, 1).
	 */
	DOWN: Vec2,
	/**
	 * The canvas DOM kaboom is currently using.
	 */
	canvas: HTMLCanvasElement,
	[custom: string]: any,
}

type Tag = string;

// TODO: understand this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type Defined<T> = T extends any ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]> : never;
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>;
type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>;

type CompList<T> = Array<T | Tag>;
type DynCompList<T> = CompList<T> | ((...args: any[]) => CompList<T>);

type Key =
	| "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8" | "f9" | "f10" | "f11" | "f12"
	| "`" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0" | "-" | "="
	| "q" | "w" | "e" | "r" | "t" | "y" | "u" | "i" | "o" | "p" | "[" | "]" | "\\"
	| "a" | "s" | "d" | "f" | "g" | "h" | "j" | "k" | "l" | ";" | "'"
	| "z" | "x" | "c" | "v" | "b" | "n" | "m" | "," | "." | "/"
	| "backspace" | "enter" | "tab" | "space" | " "
	| "left" | "right" | "up" | "down"
	;

interface GameObjRaw {
	/**
	 * Internal GameObj ID.
	 */
	_id: number | null,
	/**
	 * If draw the game obj (run "draw" event or not).
	 */
	hidden: boolean;
	/**
	 * If update the game obj (run "update" event or not).
	 */
	paused: boolean;
	/**
	 * If game obj exists in scene.
	 */
	exists(): boolean;
	/**
	 * If there a certain tag on the game obj.
	 */
	is(tag: Tag | Tag[]): boolean;
	// TODO: update the GameObj type info
	/**
	 * Add a component or tag.
	 */
	use(comp: Comp | Tag): void;
	// TODO: update the GameObj type info
	/**
	 * Remove a tag or a component with its id.
	 */
	unuse(comp: Tag): void;
	/**
	 * Run something every frame for this game obj (sugar for on("update")).
	 */
	action(cb: () => void): EventCanceller;
	/**
	 * Registers an event.
	 */
	on(ev: string, cb: () => void): EventCanceller;
	/**
	 * Triggers an event.
	 */
	trigger(ev: string, ...args: any[]): void;
	/**
	 * Remove the game obj from scene.
	 */
	destroy(): void;
	/**
	 * Get state for a specific comp.
	 */
	c(id: Tag): Comp;
}

/**
 * Kaboom configurations.
 */
interface KaboomConf {
	/**
	 * Width of game.
	 */
	width?: number,
	/**
	 * Height of game.
	 */
	height?: number,
	/**
	 * Pixel scale / size.
	 */
	scale?: number,
	/**
	 * If stretch canvas to container when width and height is specified
	 */
	stretch?: boolean,
	/**
	 * When stretching if keep aspect ratio and leave black bars on remaining spaces.
	 */
	letterbox?: boolean,
	/**
	 * If register debug buttons (default true)
	 */
	debug?: boolean,
	/**
	 * Default font (defaults to "apl386o", with "apl386", "sink", "sinko" as other built-in options).
	 */
	font?: string,
	/**
	 * Disable antialias and enable sharp pixel display.
	 */
	crisp?: boolean,
	/**
	 * The canvas DOM element to use. If empty will create one.
	 */
	canvas?: HTMLCanvasElement,
	/**
	 * The container DOM element to insert the canvas if created. Defaults to document.body.
	 */
	root?: HTMLElement,
	/**
	 * Background color. E.g. [ 0, 0, 255 ] for solid blue background.
	 */
	clearColor?: number[],
	/**
	 * The color to draw collider boxes etc.
	 */
	inspectColor?: number[],
	/**
	 * Default texture filter.
	 */
	texFilter?: TexFilter,
	/**
	 * How many log messages can there be on one screen.
	 */
	logMax?: number,
	/**
	 * The websocket server to connect.
	 */
	connect?: string,
	/**
	 * If focus user input to canvas on start.
	 */
	focus?: boolean,
	/**
	 * If translate touch events as mouse clicks (default true).
	 */
	touchToMouse?: boolean,
	/**
	 * If show the virtualDpad on touch devices.
	 */
	virtualDPad?: boolean,
	/**
	 * If import all kaboom functions to global (default true).
	 */
	global?: boolean,
	/**
	 * List of plugins to import.
	 */
	plugins?: KaboomPlugin<any>[],
}

type KaboomPlugin<T> = (k: KaboomCtx) => T;

type GameObj<T> = GameObjRaw & MergeComps<T>;

type SceneID = string;
type SceneDef = (...args: any[]) => void;
type TouchID = number;

/**
 * Cancel the event.
 */
type EventCanceller = () => void;

type SpriteAnim = number | {
	/**
	 * The starting frame.
	 */
	from: number,
	/**
	 * The end frame.
	 */
	to: number,
	/**
	 * If this anim should be played in loop.
	 */
	loop: boolean,
	/**
	 * This anim's speed in frames per second.
	 */
	speed: number,
}

/**
 * A dict of name <-> animation.
 */
type SpriteAnims = Record<string, SpriteAnim>

/**
 * Sprite loading configuration.
 */
interface SpriteLoadConf {
	sliceX?: number,
	sliceY?: number,
	anims?: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

interface SpriteAtlasEntry {
	x: number,
	y: number,
	width: number,
	height: number,
	sliceX?: number,
	sliceY?: number,
	anims?: SpriteAnims,
}

type SpriteLoadSrc = string | GfxTexData;

interface SpriteData {
	tex: GfxTexture,
	frames: Quad[],
	anims: SpriteAnims,
	filter?: TexFilter,
	wrap?: TexWrap,
}

interface FontLoadConf {
	chars?: string,
	filter?: TexFilter,
	wrap?: TexWrap,
}

type SoundData = AudioBuffer;
type FontData = GfxFont;
type ShaderData = GfxProgram;

interface AudioPlayConf {
	loop?: boolean,
	volume?: number,
	speed?: number,
	detune?: number,
	/**
	 * The start time, in seconds.
	 */
	seek?: number,
}

interface AudioPlay {
	play(seek?: number): void,
	stop(): void,
	pause(): void,
	paused(): boolean,
	stopped(): boolean,
	speed(s?: number): number,
	detune(d?: number): number,
	volume(v?: number): number,
	/**
	 * The current playing time.
	 */
	time(): number,
	/**
	 * The total duration.
	 */
	duration(): number,
	loop(): void,
	unloop(): void,
}

// TODO: hide
interface GfxProgram {
	bind(): void,
	unbind(): void,
	bindAttribs(): void,
	send(uniform: Uniform): void,
}

// TODO: hide
interface GfxTexture {
	width: number,
	height: number,
	bind(): void,
	unbind(): void,
}

type GfxTexData =
	HTMLImageElement
	| HTMLCanvasElement
	| ImageData
	| ImageBitmap
	;

interface GfxFont {
	tex: GfxTexture,
	map: Record<string, Vec2>,
	/**
	 * The quad width of each character.
	 */
	qw: number,
	qh: number,
}

interface Vertex {
	pos: Vec3,
	uv: Vec2,
	color: Color,
	opacity: number,
}

/**
 * Texture scaling filter. "nearest" is mainly for sharp pixelated scaling, "linear" means linear interpolation.
 */
type TexFilter = "nearest" | "linear";
type TexWrap = "repeat" | "clampToEdge";

interface GfxTexConf {
	filter?: TexFilter,
	wrap?: TexWrap,
}

interface RenderProps {
	pos?: Vec2,
	scale?: Vec2 | number,
	rot?: number,
	color?: Color,
	opacity?: number,
	origin?: Origin | Vec2,
	z?: number,
	prog?: GfxProgram,
	uniform?: Uniform,
}

type DrawQuadConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	tex?: GfxTexture,
	quad?: Quad,
}

type DrawTextureConf = RenderProps & {
	flipX?: boolean,
	flipY?: boolean,
	width?: number,
	height?: number,
	tiled?: boolean,
	quad?: Quad,
}

type DrawRectStrokeConf = RenderProps & {
	width?: number,
}

type DrawRectConf = RenderProps & {
}

type DrawLineConf = RenderProps & {
	width?: number,
}

type DrawTriConf = RenderProps & {
}

type DrawTextConf = RenderProps & {
	size?: number,
	width?: number,
}

interface FormattedChar {
	tex: GfxTexture,
	quad: Quad,
	ch: string,
	pos: Vec2,
	scale: Vec2,
	color: Color,
	opacity: number,
	origin: string,
}

interface FormattedText {
	width: number,
	height: number,
	chars: FormattedChar[],
}

type Cursor =
	string
	| "auto"
	| "default"
	| "none"
	| "context-menu"
	| "help"
	| "pointer"
	| "progress"
	| "wait"
	| "cell"
	| "crosshair"
	| "text"
	| "vertical-text"
	| "alias"
	| "copy"
	| "move"
	| "no-drop"
	| "not-allowed"
	| "grab"
	| "grabbing"
	| "all-scroll"
	| "col-resize"
	| "row-resize"
	| "n-resize"
	| "e-resize"
	| "s-resize"
	| "w-resize"
	| "ne-resize"
	| "nw-resize"
	| "se-resize"
	| "sw-resize"
	| "ew-resize"
	| "ns-resize"
	| "nesw-resize"
	| "nwse-resize"
	| "zoom-int"
	| "zoom-out"
	;

type Origin =
	"topleft"
	| "top"
	| "topright"
	| "left"
	| "center"
	| "right"
	| "botleft"
	| "bot"
	| "botright"
	;

type DrawSpriteConf = RenderProps & {
	frame?: number,
	width?: number,
	height?: number,
	tiled?: boolean,
	flipX?: boolean,
	flipY?: boolean,
	quad?: Quad,
	prog?: ShaderData,
	uniform?: Uniform,
}

interface Vec2 {
	x: number,
	y: number,
	clone(): Vec2,
	/**
	 * Returns the addition with another vector.
	 */
	add(p: Vec2): Vec2,
	add(x: number, y: number): Vec2,
	/**
	 * Returns the subtraction with another vector.
	 */
	sub(p: Vec2): Vec2,
	sub(x: number, y: number): Vec2,
	/**
	 * Scale by another vector, or a single number.
	 */
	scale(p: Vec2): Vec2,
	scale(s: number): Vec2,
	scale(sx: number, sy: number): Vec2,
	/**
	 * Get the dot product with another vector.
	 */
	dot(p: Vec2): number,
	/**
	 * Get distance between another vector.
	 */
	dist(p: Vec2): number,
	len(): number,
	/**
	 * Get the unit vector (length of 1).
	 */
	unit(): Vec2,
	/**
	 * Get the perpendicular vector.
	 */
	normal(): Vec2,
	/**
	 * Get the angle between another vector
	 */
	angle(p: Vec2): number,
	/**
	 * Linear interpolate to a destination vector
	 */
	lerp(p: Vec2, t: number): Vec2,
	/**
	 * To n precision floating point.
	 */
	toFixed(n: number): Vec2,
	eq(p: Vec2): boolean,
	str(): string,
}

interface Vec3 {
	x: number,
	y: number,
	z: number,
	xy(): Vec2,
}

interface Vec4 {
	x: number,
	y: number,
	z: number,
	w: number,
}

interface Mat4 {
	m: number[],
	clone(): Mat4,
	mult(m: Mat4): Mat4,
	multVec4(m: Vec4): Vec4,
	multVec3(m: Vec3): Vec3,
	multVec2(m: Vec2): Vec2,
	scale(s: Vec2): Mat4,
	translate(p: Vec2): Mat4,
	rotateX(a: number): Mat4,
	rotateY(a: number): Mat4,
	rotateZ(a: number): Mat4,
	invert(): Mat4,
}

/**
 * 0-255 RGBA color.
 */
interface Color {
	/**
	 * Red (0-255).
	 */
	r: number,
	/**
	 * Green (0-255).
	 */
	g: number,
	/**
	 * Blue (0-255).
	 */
	b: number,
	clone(): Color,
	/**
	 * Lighten the color (adds RGB by n).
	 */
	lighten(n: number): Color,
	/**
	 * Darkens the color (subtracts RGB by n).
	 */
	darken(n: number): Color,
	invert(): Color,
	eq(c: Color): boolean,
	str(): string,
}

interface Quad {
	x: number,
	y: number,
	w: number,
	h: number,
	scale(q: Quad): Quad,
	clone(): Quad,
	eq(q: Quad): boolean,
}

type RNGValue =
	number
	| Vec2
	| Color
	;

interface RNG {
	seed: number,
	gen(): number,
	gen<T extends RNGValue>(n: T): T,
	gen<T extends RNGValue>(a: T, b: T): T,
}

interface Rect {
	p1: Vec2,
	p2: Vec2,
}

interface Line {
	p1: Vec2,
	p2: Vec2,
}

type ClientID = number;
type MsgHandler = (id: ClientID, data: any) => void;

interface Comp {
	/**
	 * Component ID (if left out won't be treated as a comp).
	 */
	id?: Tag;
	/**
	 * What other comps this comp depends on.
	 */
	require?: Tag[];
	/**
	 * Event that runs when host game obj is added to scene.
	 */
	add?: () => void;
	/**
	 * Event that runs when host game obj is added to scene and game is loaded.
	 */
	load?: () => void;
	/**
	 * Event that runs every frame.
	 */
	update?: () => void;
	/**
	 * Event that runs every frame.
	 */
	draw?: () => void;
	/**
	 * Event that runs when obj is removed from scene.
	 */
	destroy?: () => void;
	/**
	 * Debug info for inspect mode.
	 */
	inspect?: () => string;
}

type GameObjID = number;

interface PosComp extends Comp {
	pos: Vec2;
	/**
	 * Move how many pixels per second. If object is 'solid', it won't move into other 'solid' objects.
	 */
	move(xVel: number, yVel: number): void;
	move(vel: Vec2): void;
	/**
	 * Move how many pixels, without multiplying dt, but still checking for 'solid'.
	 */
	moveBy(dx: number, dy: number): void;
	moveBy(d: Vec2): void;
	/**
	 * Move to a spot with a speed (pixels per second), teleports if speed is not given.
	 */
	moveTo(dest: Vec2, speed?: number): void;
	moveTo(x: number, y: number, speed?: number): void;
	/**
	 * Get position on screen after camera transform.
	 */
	screenPos(): Vec2;
}

interface ScaleComp extends Comp {
	scale: Vec2;
}

interface RotateComp extends Comp {
	/**
	 * Angle in degrees.
	 */
	angle: number;
}

interface ColorComp extends Comp {
	color: Color;
}

interface OpacityComp extends Comp {
	opacity: number;
}

interface OriginComp extends Comp {
	/**
	 * Origin point for render.
	 */
	origin: Origin | Vec2;
}

interface LayerComp extends Comp {
	/**
	 * Which layer this game obj belongs to.
	 */
	layer: string;
}

interface ZComp extends Comp {
	/**
	 * Defines the z-index of this game obj
	 */
	z: number;
}

interface FollowComp extends Comp {
	follow: {
		obj: GameObj<any>,
		offset: Vec2,
	},
}

interface MoveComp extends Comp {
}

type RectSide =
	| "top"
	| "bottom"
	| "left"
	| "right"
	;

interface PushOut {
	obj: GameObj<any>,
	side: RectSide,
	dis: number,
}

interface AreaCompConf {
	/**
	 * Width of area.
	 */
	offset?: Vec2,
	/**
	 * Width of area.
	 */
	width?: number,
	/**
	 * Height of area.
	 */
	height?: number,
	/**
	 * Area scale.
	 */
	scale?: number | Vec2,
	/**
	 * Cursor on hover.
	 */
	cursor?: Cursor,
}

interface AreaComp extends Comp {
	/**
	 * Collider area info.
	 */
	area: AreaCompConf;
	/**
	 * Get the width of collider area.
	 */
	areaWidth(): number,
	/**
	 * Get the height of collider area.
	 */
	areaHeight(): number,
	/**
	 * If was just clicked on last frame.
	 */
	isClicked(): boolean,
	/**
	 * If is being hovered on.
	 */
	isHovering(): boolean,
	/**
	 * If is currently colliding with another game obj.
	 */
	isColliding(o: GameObj<any>): boolean,
	/**
	 * If is currently touching another game obj.
	 */
	isTouching(o: GameObj<any>): boolean,
	/**
	 * Registers an event runs when clicked.
	 */
	clicks(f: () => void): void,
	/**
	 * Registers an event runs when hovered.
	 */
	hovers(onHover: () => void, onNotHover?: () => void): void,
	/**
	 * Registers an event runs when collides with another game obj with certain tag.
	 */
	collides(tag: Tag, f: (obj: GameObj<any>, side?: RectSide) => void): void,
	/**
	 * If has a certain point inside collider.
	 */
	hasPt(p: Vec2): boolean,
	/**
	 * Push out from another solid game obj if currently overlapping.
	 */
	pushOut(obj: GameObj<any>): void,
	/**
	 * Push out from all other solid game objs if currently overlapping.
	 *
	 * @example
	 * ```js
	 * // make player won't move through solid() objs
	 * player.action(() => {
	 *     player.pushOutAll();
	 * });
	 * ```
	 */
	pushOutAll(): void,
	/**
	 * Get the geometry data for the collider in world coordinate space.
	 */
	worldArea(): Rect;
	/**
	 * Get the geometry data for the collider in screen coordinate space.
	 */
	screenArea(): Rect;
	_checkCollisions(tag: string, f: (obj: GameObj<any>) => void): void;
}

interface SpriteCompConf {
	/**
	 * Rectangular area to render.
	 */
	quad?: Quad,
	/**
	 * Initial frame.
	 */
	frame?: number,
	/**
	 * If provided width and height, don't stretch but instead render tiled.
	 */
	tiled?: boolean,
	/**
	 * Stretch sprite to a certain width.
	 */
	width?: number,
	/**
	 * Stretch sprite to a certain height.
	 */
	height?: number,
	/**
	 * Play an anim on start.
	 */
	anim?: number,
	/**
	 * Frame animation speed scale multiplier.
	 */
	animSpeed?: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX?: boolean,
	/**
	 * Flip texture vertically.
	 */
	flipY?: boolean,
}

interface SpriteComp extends Comp {
	/**
	 * Width for sprite.
	 */
	width: number;
	/**
	 * Height for sprite.
	 */
	height: number;
	/**
	 * Current frame.
	 */
	frame: number;
	/**
	 * The rectangular area of the texture to render.
	 */
	quad: Quad;
	/**
	 * Play a piece of anim.
	 */
	play(anim: string, loop?: boolean): void;
	/**
	 * Stop current anim.
	 */
	stop(): void;
	/**
	 * Get total number of frames.
	 */
	numFrames(): number;
	/**
	 * Get current anim name.
	 */
	curAnim(): string;
	/**
	 * Frame animation speed scale multiplier.
	 */
	animSpeed: number,
	/**
	 * Flip texture horizontally.
	 */
	flipX(b: boolean): void;
	/**
	 * Flip texture vertically.
	 */
	flipY(b: boolean): void;
}

interface TextComp extends Comp {
	/**
	 * The text to render.
	 */
	text: string;
	/**
	 * The text size.
	 */
	textSize: number;
	/**
	 * The font to use.
	 */
	font: string | FontData;
	/**
	 * Width of text.
	 */
	width: number;
	/**
	 * Height of text.
	 */
	height: number;
}

interface TextCompConf {
	/**
	 * Height of text.
	 */
	size?: number,
	/**
	 * The font to use.
	 */
	font?: string | FontData,
	/**
	 * Wrap text to a certain width.
	 */
	width?: number,
}

interface RectComp extends Comp {
	/**
	 * Width of rect.
	 */
	width: number;
	/**
	 * Height of height.
	 */
	height: number;
}

type AreaType =
	| "rect"
	| "line"
	| "point"
	| "circle"
	| "polygon"
	;

interface OutlineComp extends Comp {
	lineWidth: number;
	lineColor: Color;
}

interface Debug {
	paused: boolean,
	inspect: boolean,
	timeScale: number,
	showLog: boolean,
	fps(): number,
	objCount(): number,
	drawCalls(): number,
	stepFrame(): void,
	clearLog(): void,
	/**
	 * Log some text to screen.
	 */
	log(msg: string): void,
	error(msg: string): void,
}

type UniformValue =
	Vec2
	| Vec3
	| Color
	| Mat4
	;

type Uniform = Record<string, UniformValue>;

interface ShaderComp extends Comp {
	uniform: Uniform;
	shader: string;
}

interface BodyComp extends Comp {
	/**
	 * If should collide with other solid objects.
	 */
	solid: boolean;
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce: number;
	/**
	 * Gravity multiplier.
	 */
	weight: number;
	/**
	 * Current platform landing on.
	 */
	curPlatform(): GameObj<any> | null;
	/**
	 * If currently landing on a platform.
	 */
	grounded(): boolean;
	/**
	 * If currently falling.
	 */
	falling(): boolean;
	/**
	 * Upward thrust.
	 */
	jump(f?: number): void;
	/**
	 * Performs double jump (the initial jump only happens if player is grounded).
	 */
	djump(f?: number): void;
}

interface BodyCompConf {
	/**
	 * Initial speed in pixels per second for jump().
	 */
	jumpForce?: number,
	/**
	 * Maximum velocity when falling.
	 */
	maxVel?: number,
	/**
	 * Gravity multiplier.
	 */
	weight?: number;
	/**
	 * Can you hang to a wall.
	 */
//  	hang?: boolean;
	/**
	 * How many seconds can you hang to a wall.
	 */
//  	hangTime?: number;
	/**
	 * How many pixels per second to glide down when hanging.
	 */
//  	hangGlide?: number;
}

interface Timer {
	/**
	 * Timer left.
	 */
	time: number,
	action(): void,
}

interface TimerComp extends Comp {
	/**
	 * Run the callback after n seconds.
	 */
	wait(n: number, cb: () => void): EventCanceller,
}

interface SolidComp extends Comp {
	solid: boolean;
}

interface FixedComp extends Comp {
	/**
	 * If the obj is unaffected by camera
	 */
	fixed: boolean;
}

interface StayComp extends Comp {
	/**
	 * If the obj should not be destroyed on scene switch.
	 */
	stay: boolean;
}

interface HealthComp extends Comp {
	/**
	 * Decrease HP by n (defaults to 1).
	 */
	hurt(n?: number): void,
	/**
	 * Increase HP by n (defaults to 1).
	 */
	heal(n?: number): void,
	/**
	 * Current health points.
	 */
	hp(): number,
	/**
	 * Set current health points.
	 */
	setHP(hp: number): void,
}

interface LifespanComp extends Comp {
}
