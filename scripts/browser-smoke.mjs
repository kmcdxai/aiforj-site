const DEVTOOLS_BASE = 'http://127.0.0.1:9223';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function newPage(url = 'about:blank', options = {}) {
  const response = await fetch(`${DEVTOOLS_BASE}/json/new?${encodeURIComponent('about:blank')}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Failed to create page for ${url}: ${response.status}`);
  }

  const info = await response.json();
  const page = new CDPPage(info);
  await page.connect();
  if (options.width && options.height) {
    await page.setViewport(options);
  }
  if (url && url !== 'about:blank') {
    await page.navigate(url);
  }
  return page;
}

class CDPPage {
  constructor(info) {
    this.info = info;
    this.ws = null;
    this.nextId = 0;
    this.pending = new Map();
    this.eventWaiters = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.info.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('WebSocket connect timeout')), 10000);

      this.ws.addEventListener(
        'open',
        () => {
          clearTimeout(timeout);
          resolve();
        },
        { once: true }
      );

      this.ws.addEventListener(
        'error',
        (error) => {
          clearTimeout(timeout);
          reject(error?.error || new Error('WebSocket error'));
        },
        { once: true }
      );
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data.toString());

      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;

        this.pending.delete(message.id);

        if (message.error) {
          pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
        } else {
          pending.resolve(message.result);
        }
        return;
      }

      const waiters = this.eventWaiters.get(message.method);
      if (waiters?.length) {
        for (const waiter of waiters.splice(0)) {
          waiter.resolve(message.params);
        }
      }
    });

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
    await this.send('Network.enable');
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    const payload = JSON.stringify({ id, method, params });

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);

      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timeout waiting for ${method}`));
        }
      }, 15000);
    });
  }

  waitForEvent(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const waiters = this.eventWaiters.get(method) || [];
      const waiter = { resolve, reject };
      waiters.push(waiter);
      this.eventWaiters.set(method, waiters);

      setTimeout(() => {
        const current = this.eventWaiters.get(method) || [];
        const index = current.indexOf(waiter);
        if (index >= 0) current.splice(index, 1);
        reject(new Error(`Timed out waiting for event ${method}`));
      }, timeout);
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
    }

    return result.result?.value;
  }

  async waitFor(expression, timeout = 15000) {
    const started = Date.now();

    while (Date.now() - started < timeout) {
      try {
        const matched = await this.evaluate(`Boolean(${expression})`);
        if (matched) return true;
      } catch {
        // Keep polling while the page is moving.
      }

      await delay(250);
    }

    throw new Error(`Timed out waiting for ${expression}`);
  }

  async navigate(url) {
    const load = this.waitForEvent('Page.loadEventFired', 20000).catch(() => null);
    await this.send('Page.navigate', { url });
    await load;
    await delay(1200);
  }

  async setViewport({ width, height, mobile = false, deviceScaleFactor = 2 }) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      mobile,
      deviceScaleFactor,
    });

    await this.send('Emulation.setTouchEmulationEnabled', {
      enabled: mobile,
    });
  }

  async clickByText(text) {
    const result = await this.evaluate(`(() => {
      const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
      const target = ${JSON.stringify(text)};
      const nodes = [...document.querySelectorAll('button, a, [role="button"]')]
        .filter((node) => node.offsetParent !== null && !node.disabled);
      const exact = nodes.find((node) => normalize(node.textContent) === target);
      const partial = nodes.find((node) => normalize(node.textContent).includes(target));
      const match = exact || partial;

      if (!match) {
        return {
          ok: false,
          available: nodes.map((node) => normalize(node.textContent)).filter(Boolean).slice(0, 80),
        };
      }

      match.click();
      return {
        ok: true,
        text: normalize(match.textContent),
        href: match.href || null,
      };
    })()`);

    if (!result?.ok) {
      throw new Error(`Unable to click "${text}". Available controls: ${(result?.available || []).join(' | ')}`);
    }

    await delay(900);
    return result;
  }

  async clickBySelector(selector) {
    const ok = await this.evaluate(`(() => {
      const node = document.querySelector(${JSON.stringify(selector)});
      if (!node) return false;
      node.click();
      return true;
    })()`);

    if (!ok) {
      throw new Error(`Unable to click selector ${selector}`);
    }

    await delay(700);
  }

  async clickHrefContains(fragment) {
    const result = await this.evaluate(`(() => {
      const nodes = [...document.querySelectorAll('a[href]')]
        .filter((node) => node.offsetParent !== null);
      const match = nodes.find((node) => node.getAttribute('href')?.includes(${JSON.stringify(fragment)}));

      if (!match) {
        return {
          ok: false,
          hrefs: nodes.map((node) => node.getAttribute('href')).slice(0, 80),
        };
      }

      match.click();
      return {
        ok: true,
        href: match.getAttribute('href'),
        text: (match.textContent || '').replace(/\\s+/g, ' ').trim(),
      };
    })()`);

    if (!result?.ok) {
      throw new Error(`Unable to click link containing ${fragment}`);
    }

    await delay(1200);
    return result;
  }

  async fillVisibleFields(values) {
    const result = await this.evaluate(`(() => {
      const values = ${JSON.stringify(values)};
      const fields = [...document.querySelectorAll('input[type="text"], textarea')]
        .filter((node) => node.offsetParent !== null);

      const setValue = (field, value) => {
        const prototype = field.tagName === 'TEXTAREA'
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        descriptor.set.call(field, value);
      };

      if (fields.length !== values.length) {
        return { ok: false, count: fields.length };
      }

      fields.forEach((field, index) => {
        field.focus();
        setValue(field, values[index]);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.blur();
      });

      return { ok: true, count: fields.length };
    })()`);

    if (!result?.ok) {
      throw new Error(`Unable to fill visible fields. Expected ${values.length}, saw ${result?.count}`);
    }

    await delay(500);
  }

  async setInputValue(selector, value) {
    const ok = await this.evaluate(`(() => {
      const field = document.querySelector(${JSON.stringify(selector)});
      if (!field) return false;
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      descriptor.set.call(field, ${JSON.stringify(String(value))});
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);

    if (!ok) {
      throw new Error(`Unable to set value for ${selector}`);
    }

    await delay(400);
  }

  async textSnapshot() {
    return this.evaluate(`document.body.innerText.replace(/\\s+/g, ' ').trim()`);
  }

  async close() {
    try {
      await fetch(`${DEVTOOLS_BASE}/json/close/${this.info.id}`);
    } catch {
      // Ignore close errors during teardown.
    }

    try {
      this.ws?.close();
    } catch {
      // Ignore socket errors during teardown.
    }
  }
}

async function run() {
  const results = {};

  const home = await newPage(`${BASE_URL}/`);
  try {
    await home.waitFor(`document.body.innerText.includes('Emotional first aid that actually works.')`);
    results.homepage = await home.evaluate(`(() => {
      const text = document.body.innerText;
      return {
        title: document.title,
        hasStartCTA: text.includes('Get support now'),
        hasWorkbook: text.includes('CBT workbook'),
        hasPremium: text.includes('Talk to Forj Premium'),
        hasCredential: text.includes('AIForj Team') && text.includes('Licensed Healthcare Provider'),
        navHasWorkbook: [...document.querySelectorAll('a[href]')].some((a) => a.textContent.includes('CBT Workbook')),
        navHasCompanion: [...document.querySelectorAll('a[href]')].some((a) => a.textContent.includes('Talk to Forj')),
      };
    })()`);
  } finally {
    await home.close();
  }

  const themePage = await newPage(`${BASE_URL}/`);
  try {
    await themePage.waitFor(`document.body.innerText.includes('Emotional first aid that actually works.')`);
    const before = await themePage.evaluate(`(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      manual: localStorage.getItem('aiforj-theme-manual'),
    }))()`);
    await themePage.clickBySelector('button[aria-label^="Switch to"]');
    await themePage.waitFor(`localStorage.getItem('aiforj-theme-manual') === 'true'`);
    results.themeToggle = await themePage.evaluate(`(() => ({
      beforeTheme: ${JSON.stringify('placeholder')},
      afterTheme: document.documentElement.getAttribute('data-theme'),
      manual: localStorage.getItem('aiforj-theme-manual'),
      storedTheme: localStorage.getItem('aiforj-theme'),
    }))()`);
    results.themeToggle.beforeTheme = before.theme;
    results.themeToggle.beforeManual = before.manual;
  } finally {
    await themePage.close();
  }

  const mobileHome = await newPage(`${BASE_URL}/`, {
    width: 390,
    height: 844,
    mobile: true,
  });
  try {
    await mobileHome.waitFor(`document.body.innerText.includes('Emotional first aid that actually works.')`);
    results.mobileHomepage = await mobileHome.evaluate(`(() => ({
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowPx: document.documentElement.scrollWidth - window.innerWidth,
      hasHeroCTA: document.body.innerText.includes('Get support now'),
      hasMenuButton: Boolean(document.querySelector('button[aria-label="Open menu"]')?.offsetParent),
    }))()`);
  } finally {
    await mobileHome.close();
  }

  const mobileStart = await newPage(`${BASE_URL}/start`, {
    width: 390,
    height: 844,
    mobile: true,
  });
  try {
    await mobileStart.waitFor(`document.body.innerText.includes('What\\'s going on?')`);
    results.mobileStart = await mobileStart.evaluate(`(() => ({
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowPx: document.documentElement.scrollWidth - window.innerWidth,
      hasCanonicalEmotion: document.body.innerText.includes('Stressed / Burned Out'),
      hasStepCopy: document.body.innerText.includes('Private · no account · matched in under 30 seconds'),
    }))()`);
  } finally {
    await mobileStart.close();
  }

  const safety = await newPage(`${BASE_URL}/start`);
  try {
    await safety.waitFor(`document.body.innerText.includes('Self-Destructive')`);
    await safety.clickByText('Self-Destructive');
    await safety.waitFor(`document.body.innerText.includes('Before we continue') && document.body.innerText.includes('988')`);
    results.safetyInterstitial = await safety.evaluate(`(() => {
      const text = document.body.innerText;
      const crisisLink = [...document.querySelectorAll('a[href]')].find((a) => a.href.includes('988lifeline.org'));
      return {
        hasBeforeWeContinue: text.includes('Before we continue'),
        has988: text.includes('988'),
        has741741: text.includes('741741'),
        hasContinue: text.includes('Continue to tools'),
        hasCrisisLink: Boolean(crisisLink),
        crisisHref: crisisLink?.href || null,
      };
    })()`);
  } finally {
    await safety.close();
  }

  const start = await newPage(`${BASE_URL}/start`);
  try {
    await start.waitFor(`document.body.innerText.includes('Anxious')`);
    results.startEmotionSet = await start.evaluate(`(() => {
      const expected = [
        'Anxious',
        'Sad / Low',
        'Angry',
        'Overwhelmed',
        'Shame / Guilt',
        'Grief / Loss',
        'Numb / Disconnected',
        'Lonely',
        'Stressed / Burned Out',
        'Scared / Fearful',
        'Stuck / Lost',
        'Self-Destructive',
      ];
      const text = document.body.innerText;
      return {
        expectedCount: expected.length,
        foundCount: expected.filter((item) => text.includes(item)).length,
        allPresent: expected.every((item) => text.includes(item)),
      };
    })()`);

    await start.clickByText('Anxious');
    await start.waitFor(`document.body.innerText.includes('How intense does it feel?')`);
    await start.setInputValue('input[type="range"]', 8);
    await start.clickByText('Next');
    await start.waitFor(`document.body.innerText.includes('How much time do you have?')`);
    await start.clickByText('Quick');
    await start.clickByText('See my tools');
    await start.waitFor(`document.body.innerText.includes('5-4-3-2-1 Sensory Grounding')`);
    results.recommendations = await start.evaluate(`(() => {
      return [...document.querySelectorAll('a[href]')]
        .filter((a) => a.getAttribute('href')?.includes('/intervention/'))
        .map((a) => ({
          href: a.getAttribute('href'),
          text: a.textContent.replace(/\\s+/g, ' ').trim(),
        }))
        .slice(0, 6);
    })()`);

    await start.clickHrefContains('/intervention/grounding-54321');
    await start.waitFor(`document.body.innerText.includes('Before we start')`);
    await start.clickBySelector('[aria-label="Rate as Okay"]');
    await start.clickByText('Let’s begin');
    await start.waitFor(`document.body.innerText.includes(\"Let's ground you in the present moment\")`);
    await start.clickByText('Begin grounding');

    const groups = [5, 4, 3, 2, 1];
    for (const count of groups) {
      await start.waitFor(`document.querySelectorAll('input[type="text"]').length === ${count}`);
      const values = Array.from({ length: count }, (_, index) => `item ${count}-${index + 1}`);
      await start.fillVisibleFields(values);
      await start.clickByText(count === 1 ? 'See your grounding' : 'Next sense');
    }

    await start.waitFor(`document.body.innerText.includes("You're here. You're grounded. You're safe.")`);
    await start.clickByText('Continue');
    await start.waitFor(`document.body.innerText.includes('How are you feeling now?')`);
    await start.clickBySelector('[aria-label="Rate as Good"]');
    await start.clickByText('See my results');
    await start.waitFor(`document.body.innerText.includes('Your Mood Shift')`);

    results.receipt = await start.evaluate(`(() => {
      const text = document.body.innerText;
      const workbookLink = [...document.querySelectorAll('a[href]')].find((a) => a.href.includes('gumroad.com'));
      return {
        hasReceipt: text.includes('Your Mood Shift'),
        hasCopy: text.includes('Copy to clipboard'),
        hasDownload: text.includes('Download card'),
        hasSendCalm: text.includes('Send Calm'),
        hasPremiumCTA: text.includes('Start Premium trial'),
        hasWorkbookCTA: Boolean(workbookLink),
        workbookHref: workbookLink?.href || null,
      };
    })()`);

    results.localStorage = await start.evaluate(`(() => {
      const raw = window.localStorage.getItem('aiforj_sessions');
      const parsed = raw ? JSON.parse(raw) : [];
      const latest = parsed[parsed.length - 1] || null;
      return {
        hasSessions: Array.isArray(parsed) && parsed.length > 0,
        count: parsed.length,
        latest,
      };
    })()`);
  } finally {
    await start.close();
  }

  const garden = await newPage(`${BASE_URL}/garden`);
  try {
    await garden.waitFor(`document.readyState === 'complete'`);
    await delay(4000);
    const gardenText = await garden.textSnapshot();
    results.gardenTextSample = gardenText.slice(0, 1200);
    results.garden = await garden.evaluate(`(() => {
      const text = document.body.innerText;
      const lower = text.toLowerCase();
      const startLinks = [...document.querySelectorAll('a[href]')].filter((a) => a.getAttribute('href') === '/start').length;
      return {
        title: document.title,
        hasHero: text.includes('Mood Garden') && lower.includes('private progress landscape'),
        hasBiome: lower.includes('emotional biome'),
        hasSeasonStory: lower.includes('season story'),
        hasRecentPath: lower.includes('recent path'),
        hasDailyCheckin: lower.includes('daily check-in'),
        hasExport: lower.includes('export your raw data'),
        hasMilestones: lower.includes('milestones'),
        hasLatestSession: text.includes('5-4-3-2-1 Sensory Grounding'),
        hasSessionCount: /sessions planted\\s+\\d+/i.test(text),
        hasCompanionLink: [...document.querySelectorAll('a[href]')].some((a) => a.getAttribute('href') === '/companion'),
        startLinks,
      };
    })()`);
  } finally {
    await garden.close();
  }

  const sigh = await newPage(`${BASE_URL}/intervention/physiological-sigh?emotion=anxious&intensity=7&time=quick`);
  try {
    await sigh.waitFor(`document.body.innerText.includes('Before we start')`);
    await sigh.clickBySelector('[aria-label="Rate as Okay"]');
    await sigh.clickByText('Let’s begin');
    await sigh.waitFor(`document.body.innerText.includes('fastest evidence-backed way to calm your nervous system')`);
    await sigh.clickByText('Begin breathing');
    await sigh.waitFor(`document.body.innerText.includes("That's it. Three physiological sighs.")`, 45000);
    results.physiologicalSigh = await sigh.evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasCompletion: text.includes("That's it. Three physiological sighs."),
        hasEvidence: text.includes('Huberman Lab / Stanford, 2023'),
        hasParasympatheticCopy: text.includes('parasympathetic nervous system'),
      };
    })()`);
    await sigh.clickByText('Continue');
    await sigh.waitFor(`document.body.innerText.includes('How are you feeling now?')`);
    await sigh.clickBySelector('[aria-label="Rate as Good"]');
    await sigh.clickByText('See my results');
    await sigh.waitFor(`document.body.innerText.includes('Your Mood Shift')`);
    results.physiologicalSigh.hasReceipt = true;
  } finally {
    await sigh.close();
  }

  const story = await newPage(`${BASE_URL}/intervention/name-the-story?emotion=anxious&intensity=7&time=quick`);
  try {
    await story.waitFor(`document.body.innerText.includes('Before we start')`);
    await story.clickBySelector('[aria-label="Rate as Okay"]');
    await story.clickByText('Let’s begin');
    await story.waitFor(`document.body.innerText.includes('Your mind is telling you a story right now')`);
    await story.clickByText("Let's start");
    await story.waitFor(`document.querySelectorAll('textarea').length === 1`);
    await story.fillVisibleFields(['Something terrible is going to happen']);
    await story.clickByText('Next');
    await story.waitFor(`document.querySelectorAll('input[type="text"]').length === 1`);
    await story.fillVisibleFields(['Everything Falls Apart: Part 47']);
    await story.clickByText('See the poster');
    await story.waitFor(`document.body.innerText.includes('Directed by:') && document.body.innerText.includes('Everything Falls Apart: Part 47')`);
    const posterCheck = await story.evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasPoster: text.includes('Directed by:') && text.includes('Everything Falls Apart: Part 47'),
      };
    })()`);
    await story.clickByText('Practice the distance');
    await story.waitFor(`document.body.innerText.toLowerCase().includes('the raw thought:') || document.body.innerText.toLowerCase().includes('creating distance')`);
    await story.clickByText('Add more distance');
    await story.clickByText('Add more distance');
    results.nameTheStory = await story.evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasPoster: ${JSON.stringify(true)},
        hasDefusion: text.includes('I notice my mind is playing'),
        hasPracticeCopy: text.includes("It loses power every time."),
      };
    })()`);
    results.nameTheStory.hasPoster = posterCheck.hasPoster;
    await story.clickByText('Continue');
    await story.waitFor(`document.body.innerText.includes('How are you feeling now?')`);
    await story.clickBySelector('[aria-label="Rate as Good"]');
    await story.clickByText('See my results');
    await story.waitFor(`document.body.innerText.includes('Your Mood Shift')`);
    results.nameTheStory.hasReceipt = true;
  } finally {
    await story.close();
  }

  console.log(JSON.stringify(results, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
