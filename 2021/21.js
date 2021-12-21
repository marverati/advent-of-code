
function part1(p1, p2) {
    const pos = [p1 - 1, p2 - 1], points = [0, 0], max = 1000;
    let turn = 0;
    while (Math.max(...points) < max) {
        takeTurn(pos, points, turn);
        turn = 1 - turn;
    }
    return Math.min(...points) * dieRolls;
}

function takeTurn(pos, points, turn) {
    const move = rollDie() + rollDie() + rollDie();
    pos[turn] = (pos[turn] + move) % 10;
    points[turn] += pos[turn] + 1;
}

let dieRolls = 0;
function rollDie() {
    return (dieRolls++ % 100) + 1;
}

function part2(p1, p2) {
    const max = 21;
    const rolls =  [3, 4, 5, 6, 7, 8, 9]; // possible sums of rolling 3 dies at once
    const counts = [1, 3, 6, 7, 6, 3, 1]; // how many of the 3³ = 27 universes end up with that sum
    let p1wins = 0, total = 0;

    recurse(0, p1 - 1, p2 - 1, 0, 0, 1);

    return Math.max(p1wins, total - p1wins);

    function recurse(turn, pos1, pos2, points1, points2, universesInThisState) {
        // Game won by a player?
        if (points1 >= max || points2 >= max) {
            total += universesInThisState;
            (points1 > points2) && (p1wins += universesInThisState);
            return;
        }
        // Continue with next move
        if (turn === 0) {
            // First player
            for (let i = 0; i < rolls.length; i++) {
                const nxt = (pos1 + rolls[i]) % 10, universes = universesInThisState * counts[i];
                recurse(1, nxt, pos2, points1 + nxt + 1, points2, universes);
            }
        } else {
            // Second player
            for (let i = 0; i < rolls.length; i++) {
                const nxt = (pos2 + rolls[i]) % 10, universes = universesInThisState * counts[i];
                recurse(0, pos1, nxt, points1, points2 + nxt + 1, universes);
            }
        }
    }
}

console.log("Part 1: ", part1(8, 4));
console.log("Part 2: ", part2(8, 4));