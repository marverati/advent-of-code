require('./_helpers.js');
const { data0, data1 } = require('./19data');

function prepareData(data) {
    const lines = data
        .split("\n") // turn into array of lines
        .map(line => line.trim()) // trim white space
        .filter(line => line !== "") // remove empty lines
        .map(line => {
            words = line.split(' ');
            return {
                id: parseInt(words[1]),
                oreCostOre: +words[6],
                clayCostOre: +words[12],
                obsCostOre: +words[18],
                obsCostClay: +words[21],
                geoCostOre: +words[27],
                geoCostObs: +words[30]
            };
        });
    return lines;
}

function part1(blueprints, minutes) {
    const blueprintGeodes = blueprints.map(bp => getMostGeodes(bp, minutes));
    const qualityLevels = blueprintGeodes.map((v, i) => v * blueprints[i].id);
    return qualityLevels.sum();
}

function part2(blueprints, minutes) {
    const blueprintGeodes = blueprints.slice(0, 3).map(bp => getMostGeodes(bp, minutes));
    return blueprintGeodes.product();
}

function getMostGeodes(bp, minutes) {
    const cache = {};
    const state = {
        oreBots: 1,
        clayBots: 0,
        obsBots: 0,
        geoBots: 0,
        ore: 0,
        clay: 0,
        obs: 0,
        geo: 0,
    };

    return _getMostGeodes(state, minutes, false, false, false);

    function _getMostGeodes(state, minutes, couldBuildOre, couldBuildClay, couldBuildObs) {
        if (minutes <= 0) {
            return state.geo;
        }
        const key = buildKey(state, minutes);
        if (cache[key] != null) {
            return state.geo + cache[key];
        }
        // Get resources from robots
        minutes--;
        state = { ... state };
        const { ore, clay, obs } = state;
        state.ore += state.oreBots;
        state.clay += state.clayBots;
        state.obs += state.obsBots;
        state.geo += state.geoBots;
        // Don't need to build anything in last minute
        if (minutes <= 0) {
            return state.geo;
        }
        // Decide which bots to build
        let best = 0;
        const canBuildGeo = ore >= bp.geoCostOre && obs >= bp.geoCostObs;
        // Geodes Bot
        if (canBuildGeo) { // assumption: if we can build one, we should build one, and nothing else. Not sure if this assumption is correct, but sufficed to solve my puzzle inputs. ;-)
            const newState = { ... state };
            newState.ore -= bp.geoCostOre;
            newState.obs -= bp.geoCostObs;
            newState.geoBots++;
            const r = _getMostGeodes(newState, minutes, false, false, false);
            best = Math.max(best, r);
        } else {
            const canBuildObs = ore >= bp.obsCostOre && clay >= bp.obsCostClay;
            // Do nothing? // idea behind last 3 parameters: it doesn't make sense to not build X, then do nothing, and then build X later.
            // It only makes sense to wait with building something because you want to build something else first. So this way we can
            // throw away big (useless) parts of the search tree, as we only allow building ore, clay or obsidian bots in the
            // exact moment when it becomes possible to build them, and no later.
            const r = _getMostGeodes(state, minutes, ore >= bp.oreCostOre, ore >= bp.clayCostOre, canBuildObs); // do nothing
            best = Math.max(best, r);
            // Obsidian bot
            if (canBuildObs && !couldBuildObs) {
                const newState = { ... state };
                newState.ore -= bp.obsCostOre;
                newState.clay -= bp.obsCostClay;
                newState.obsBots++;
                const r = _getMostGeodes(newState, minutes, false, false, false);
                best = Math.max(best, r);
            }
            // Ore bot
            if (ore >= bp.oreCostOre && !couldBuildOre) {
                const newState = { ... state };
                newState.ore -= bp.oreCostOre;
                newState.oreBots++;
                const r = _getMostGeodes(newState, minutes, false, false, false);
                best = Math.max(best, r);
            }
            // Clay bot
            if (ore >= bp.clayCostOre && !couldBuildClay) {
                const newState = { ... state };
                newState.ore -= bp.clayCostOre;
                newState.clayBots++;
                const r = _getMostGeodes(newState, minutes, false, false, false);
                best = Math.max(best, r);
            }
        }
        cache[key] = best - state.geo;
        return best;
    }

    function buildKey(state, minutes) {
        const maxOrePM = Math.max(bp.oreCostOre, bp.clayCostOre, bp.obsCostOre, bp.geoCostOre);
        const maxClayPM = bp.obsCostClay;
        const maxObsPM = bp.geoCostObs;
        // Since building things in the very last minute is useless, we can consider only the number of bots of each type
        // that can be built in the remaining time - 1.
        minutes--;
        // Optimization: we don't store geodes as part of the key; a key just calculates the number of *additional* geodes
        // that one can obtain in the remaining time. So when using the cache, number of geodes must be added or subtracted
        // accordingly. This greatly reduces the number of different keys, hence recursions, and speeds things up.
        const values = [
            // Optimization: to improve reusal of keys (and reduce recursions), we ignore excess ore/clay/obsidian
            // beyond the level that we would be able to utilize in the remaining time.
            Math.min(state.ore, minutes * maxOrePM),
            Math.min(state.clay, minutes * maxClayPM),
            Math.min(state.obs, minutes * maxObsPM),
            state.oreBots,
            state.clayBots,
            state.obsBots,
            state.geoBots,
        ];
        return minutes + ":" + values.join(',');
    }
}

const blueprints = prepareData(data1);
console.log("Part 1: ", part1(blueprints, 24));
console.log("Part 2: ", part2(blueprints, 32));