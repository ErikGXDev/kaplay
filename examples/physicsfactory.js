kaplay();

setGravity(300);

// Conveyor belt moving right
add([
    pos(100, 300),
    rect(200, 20),
    area(),
    body({ isStatic: true }),
    surfaceEffector({ speed: 20 }),
    {
        draw() {
            drawPolygon({
                pts: [
                    vec2(2, 2),
                    vec2(12, 10),
                    vec2(2, 18),
                ],
                color: RED,
            });
        },
    },
]);

// Conveyor belt moving left
add([
    pos(80, 400),
    rect(250, 20),
    area(),
    body({ isStatic: true }),
    surfaceEffector({ speed: -20 }),
    {
        draw() {
            drawPolygon({
                pts: [
                    vec2(12, 2),
                    vec2(2, 10),
                    vec2(12, 18),
                ],
                color: RED,
            });
        },
    },
]);

// Windtunnel moving up
add([
    pos(20, 320),
    rect(50, 300),
    area(),
    areaEffector({ forceAngle: -90, forceMagnitude: 10 }),
    {
        draw() {
            drawPolygon({
                pts: [
                    vec2(25, 2),
                    vec2(48, 12),
                    vec2(2, 12),
                ],
                color: RED,
            });
        },
    },
]);

// Magnet
add([
    pos(35, 35),
    rect(60, 60),
    anchor("center"),
    area(),
    pointEffector({ forceMagnitude: 10 }),
    {
        draw() {
            drawCircle({
                pos: vec2(0, 0),
                radius: 5,
                color: RED,
            });
        },
    },
]);

// Continouous boxes
loop(5, () => {
    add([
        pos(100, 100),
        rect(20, 20),
        color(RED),
        area(),
        body(),
        offscreen({ destroy: true }),
    ]);
});

// Water
add([
    pos(400, 200),
    rect(200, 100),
    color(BLUE),
    opacity(0.5),
    area(),
    buoyancyEffector({ surfaceLevel: 200, density: 3 }),
]);

// A box
add([
    pos(500, 100),
    rect(20, 20),
    color(RED),
    area(),
    body(),
    // offscreen({ destroy: true }),
]);
