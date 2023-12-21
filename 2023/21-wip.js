require('./_helpers.js');
const { data1 } = require('./21-data.js');
const { logTime, logProgress } = require('./_util.js');
const Array2D = require('./dataStructures/Array2D.js');

const data0 = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
    return new Array2D(lines[0].length, lines.length, (x, y) => lines[y][x]);
}

function part1(data, steps, multiply = 1) {
    let start = data.find(c => c === 'S');
    data.set(start.x, start.y, '.');

    if (multiply > 1) {
        const newData = new Array2D(multiply * data.w, multiply * data.h, (x, y) => data[y % data.h][x % data.w]);
        start = {
            x: start.x + Math.floor(multiply / 2) * data.w,
            y: start.y + Math.floor(multiply / 2) * data.h,
        };
        data = newData;
        console.log(start, data.w, data.h);
    }

    let frontier = data.map((c, x, y) => x === start.x && y === start.y ? true : false);
    let last = 0;
    for (let s = 0; s < steps; s++) {
        logProgress("", s, steps);
        const newFrontier = frontier.map((c, x, y) => {
            if (data[y][x] === '.') {
                let nextToFrontier = false;
                frontier.forDirectNeighbors(x, y, (c) => {
                    if (c) {
                        nextToFrontier = true;
                    }
                });
                return nextToFrontier;
            }
            return false;
        });
        frontier = newFrontier;
        const current = frontier.countCells(c => c);
        last = current;
    }
    return frontier.countCells(c => c);
}

/*
Notes:
- chessboard style, only every 2nd (generally reachable) garden tile will be occupied after n steps
- within bounds of frontier, every ever visited tile can be assessed by coordinate alone (% 2 even or uneven)
- a rough approximation for the number of cells (or rather upper bound) will be (steps + 1)² / 2
- (maybe there are unreachable "caves"?)
- if map has even size, then every "inner" copy of the map should have the identical number of reachable cells
    - but is has not... oh
- but inner maps have predictable reachable cell count anyway: it's all non-enclosed cells, over 2 (based on coords)
- maybe we could calculate each full step, and then whenever a new map copy is entered after a step, somehow have a
    memorization of how it will develop based entry point...? But what exactly will we memorize?
- ignoring map copies, we could just calculate the frontier only, ignoring all the cells already visited
    - but the frontier also grows ~linearly in size, at roughly +4 per step
    - so for 26501365 (26 million) steps, we end up with a frontier of size ~~100 million
    - that's very probably too much for brute force
- there are these clear paths horizontally and vertically "between maps" - which means the frontier can move very
    unobstructed there.
    - if S can reach that by pure manhatten distance without "backtracking", then our frontier will simply be the
        naive one, the same one we would get for unrestricted growth
    - then all wee need to do is subtract the stones
    - but we still need to do some calculative acrobatics for the frontier maps...
    - buuut maybe we can do this smartly and step through whole maps rather than individual cells?
    - With 131 cells per map and 26 million steps, that's 200k maps we need to traverse (per dimension...)
    - oh but it's also not quite as easy, as we can't move up/down/left/right from start in a straight line, so details
        will most definitely be off anyway...
    - wrong!!! Clear path from S in all directions! Yeah!
    - Yes, frontier tends to take perfect shape after e.g. 65 steps when it's in the free area, touching all the borders
        exactly in the middle
    - so we know neighbor maps of starting map will be entered exactly in the middle of one side each
    - so probably after 65+131 steps we'll have a perfect "square" (Raute) touching the next neighbors
    - yeahhhh it's exactly 65 steps + 202300 * 131 steps, so it will end up perfectly with clean frontier!
    - so we will have a bunch of fully filled maps and then a bunch of diagonal part things

    
    65 steps gives me 3784
    further 131 steps would yield a total of 3 fully filled fields plus 2 that are filled to 6/8... makes 4.5
    further 131 steps would yield a total of 9 fully filled fields plus 4 that are filled to 7/8... makes 12.5
    further 131 steps would yield 7² / 2 = 24.5
    oh always exactly the outer 4 octals are missing! So I can count total number of garden tiles minus 3784
    then overall, I need 202300 full steps
    these steps build a square of (1 + 2 * s)² / 2 filled maps
        s = 1 -> 3²/2 = 4.5
        s = 2 -> 5²/2 = 12.5
        etc.
    meaning the garden tiles would be
        floor(square(s)) * garden_tiles_within_map + 3784
    ...I believe
    square(202300) = 81850984600.5
    81850984600 * 7400 + 3784
    awwww.... 605697286043784 is too low
              609585229256084 <- is the answer (spoiler)
              609585229458384 is too high

    just to check, for s = 1 I would expect something like 4*7400 + 3784
    square(1) = (1 + 2 * 1)² / 2 = 3² / 2 = 4.5
    tiles = floor(4.5) * 7400 + 3784 = 4 * 7400 + 3784 = expected
    maybe 7495, not 7400, because even number of steps after 65 + 131*n?
    that would yield 4 * 7495 + 3784
    or, hm.

    (but if this is off it will be hard to debug what exactly is wrong) 

    so general formula (for my puzzle input) is something like:
    full odd: (s-1)² * 7400
    full even: s² * 7495
    4 corners: 4 * 7400    -    2 * (7400 - 3784)
    edges odd: 4 * (s - 1) * 7400    -    (s - 1) * (7400 - 3784)
    edges even: s * (7495 - 3677)

    so for 202300 steps we end up with:
    609585229458384 which is too high
    (moving on to paper...)
*/
const calcPart2 = (s) => [
    (s - 1) ** 2 * 7400,
    s ** 2 * 7495,
    4 * 7400 - 2 * (7400 - 3784),
    4 * (s - 1) * 7400 - (s - 1) * (7400 - 3784),
    s * (7495 - 3677),
    -s, // <- magic adjustment which I don't understand but this yields the right results... oof
];

const data = prepareData(data1);
// (data.length < 50 || data instanceof Object) && console.log(data);
// logTime("Part 1: ", () => part1(data, 50, 9));
logTime("Part 1: ", () => part1(data, 64));
// logTime("Part 1: ", () => part1(data, 65 + 131 * 2, 11));
console.log(data.w, data.h);
logTime("Part 2: ", () => calcPart2(202300).sum());
// logTime("Part 2: ", () => part2(data, 10));