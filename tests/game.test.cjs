const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');

function game() {
  const scoreboard = { innerHTML: '' };
  const currentPlayer = { innerHTML: '' };
  const element = { innerHTML: '', textContent: '', dataset: {}, addEventListener() {}, setAttribute() {}, focus() {}, querySelectorAll() { return []; }, querySelector(selector) { return selector === '.scoreboard' ? scoreboard : selector === '.current-player' ? currentPlayer : element; } };
  const timers = [];
  const cardElements = new Map();
  const context = vm.createContext({ document: { body: { dataset: {} }, getElementById(id) {
    if (!element.innerHTML.includes(`id="${id}"`)) return null;
    if (!cardElements.has(id)) {
      const classes = new Set();
      cardElements.set(id, { disabled: false, open: false, showModal() { this.open = true; }, close() { this.open = false; }, setAttribute() {}, addEventListener() {}, classList: {
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
        contains(name) { return classes.has(name); },
      } });
    }
    return cardElements.get(id);
  }, querySelector() { return element; } }, window: { setTimeout(callback) { timers.push(callback); } } });
  const source = fs.readFileSync('src/main.ts', 'utf8')
    .replace("import './styles/style.scss';", '')
    .replaceAll('import.meta.env.BASE_URL', "'/projects/memory-game/'");
  vm.runInContext(stripTypeScriptTypes(source), context);
  return { run: expression => vm.runInContext(expression, context), tick: () => timers.shift()?.() };
}

test('Every size and theme contains exactly two cards per motif', () => {
  const app = game();
  for (const theme of ['coding', 'gaming']) {
    for (const size of [16, 24, 36]) {
      assert.equal(app.run(`theme = '${theme}'; size = ${size}; startGame(); cards.length`), size);
      assert.equal(app.run('new Set(cards.map(card => card.value)).size'), size / 2);
      assert.equal(app.run('cards.every(card => cards.filter(other => other.value === card.value).length === 2)'), true);
    }
  }
});

test('Image paths preserve equals signs and the selected theme renders image cards', () => {
  const app = game();
  assert.equal(app.run('asset("Property 1=Component 22 (1).png")'), '/projects/memory-game/assets/Property%201=Component%2022%20(1).png');
  for (const theme of ['coding', 'gaming']) {
    app.run(`theme = '${theme}'; startGame()`);
    const html = app.run('root.innerHTML');
    assert.ok(html.includes('single-card-image'));
    if (theme === 'gaming') {
      assert.ok(html.includes('Property%201=Component%202')); 
      assert.equal(html.includes('Platzhalter'), false);
      assert.equal(app.run('themes.gaming.motifs.length'), 18);
    } else {
      assert.equal(html.includes('Platzhalter'), false);
      assert.equal(app.run('themes.coding.motifs.length'), 18);
      assert.equal(app.run('themes.coding.motifs.every(motif => motif.file && motif.standalone)'), true);
    }
    for (const match of html.matchAll(/src="([^"]+)"/g)) {
      const path = decodeURIComponent(match[1]).replace('/projects/memory-game/', 'public/');
      assert.ok(fs.existsSync(path), match[1]);
    }
    const files = JSON.parse(app.run('JSON.stringify([themes[theme].back, ...themes[theme].motifs.flatMap(motif => motif.file ? [motif.file] : [])])'));
    for (const file of files) assert.ok(fs.existsSync(`public/assets/${file}`), file);
  }
});

test('Cards flip through their IDs and turn back after a mismatch', () => {
  const app = game();
  app.run('startGame(); cards[0].value = "a"; cards[1].value = "b"; flipCard(0)');
  assert.equal(app.run('document.getElementById("card-0").classList.contains("flipped")'), true);
  assert.equal(app.run('document.getElementById("card-1").classList.contains("flipped")'), false);
  app.run('flipCard(1)');
  app.tick();
  assert.equal(app.run('document.getElementById("card-0").classList.contains("flipped")'), false);
  assert.equal(app.run('document.getElementById("card-1").classList.contains("flipped")'), false);
});

test('Exit confirmation preserves the current round when returning to the game', () => {
  const app = game();
  app.run('startGame(); flipCard(0); scores = [2, 1]; showExitDialog()');
  assert.equal(app.run('document.getElementById("exit-dialog").open'), true);
  app.run('document.getElementById("exit-dialog").close()');
  assert.equal(app.run('document.getElementById("exit-dialog").open'), false);
  assert.equal(app.run('opened[0]'), 0);
  assert.equal(app.run('scores[0]'), 2);
  assert.equal(app.run('document.body.dataset.page'), 'game');
});

test('Matching, turn switching, duplicate clicks and input locking', () => {
  const app = game();
  app.run('startGame(); cards = [{value: "a", matched: false}, {value: "a", matched: false}, {value: "b", matched: false}, {value: "b", matched: false}]; flipCard(0); flipCard(0)');
  assert.equal(app.run('opened.length'), 1);
  app.run('flipCard(1); flipCard(2)');
  assert.equal(app.run('opened.length'), 2);
  app.tick();
  assert.equal(app.run('scores[0]'), 1);
  assert.equal(app.run('player'), 0);
  app.run('flipCard(0)');
  assert.equal(app.run('opened.length'), 0);
  app.run('cards[0].matched = false; flipCard(0); flipCard(2)');
  app.tick();
  assert.equal(app.run('player'), 1);
});

test('Leaving a game invalidates pending timers', () => {
  const app = game();
  app.run('startGame(); flipCard(0); flipCard(1); settings(); startGame()');
  app.tick();
  assert.equal(app.run('scores[0] + scores[1]'), 0);
  assert.equal(app.run('opened.length'), 0);
  assert.equal(app.run('moves'), 0);
});

test('Game over precedes the winner screen; ties and restart work', () => {
  const app = game();
  app.run('firstPlayer = 1; startGame()');
  assert.equal(app.run('player'), 1);
  app.run('scores = [5, 3]; finishGame()');
  assert.equal(app.run('document.body.dataset.page'), 'result');
  assert.equal(app.run('root.innerHTML.includes("Final score")'), true);
  assert.equal(app.run('root.innerHTML.includes("The winner is")'), false);
  assert.equal(app.run('root.innerHTML.includes("Blue: 5 Paare")'), true);
  assert.equal(app.run('root.innerHTML.includes("Orange: 3 Paare")'), true);
  assert.equal(app.run('showWinner(); root.innerHTML.includes("Blau gewinnt!")'), true);
  assert.equal(app.run('document.body.dataset.page'), 'winner');
  assert.equal(app.run('scores = [3, 5]; showWinner(); root.innerHTML.includes("Orange gewinnt!")'), true);
  assert.equal(app.run('scores = [4, 4]; showWinner(); root.innerHTML.includes("Unentschieden!")'), true);
  app.run('startGame()');
  assert.equal(app.run('scores[0] + scores[1] + moves'), 0);
  app.run('cards = [{value: "a", matched: false}, {value: "a", matched: false}]; flipCard(0); flipCard(1)');
  app.tick();
  assert.equal(app.run('root.innerHTML.includes("Game over")'), true);
  assert.equal(app.run('document.body.dataset.page'), 'result');
});



