/**
 * AlgoVision — Main JS Engine
 * Author: Saksham Sharma
 */
document.addEventListener('DOMContentLoaded', () => {

    // ─── Slider fill (live gradient) ───────────────────────────────
    // Drives an indigo→slate two-tone fill that moves with the thumb.
    function syncSlider(slider) {
        const min = parseFloat(slider.min)  || 0;
        const max = parseFloat(slider.max)  || 100;
        const pct = ((parseFloat(slider.value) - min) / (max - min)) * 100;
        slider.style.background =
            `linear-gradient(to right, #4f46e5 0%, #818cf8 ${pct}%, #1e293b ${pct}%, #1e293b 100%)`;
    }

    // Initialise all range inputs and wire live updates
    document.querySelectorAll('input[type="range"]').forEach(s => {
        syncSlider(s);
        s.addEventListener('input', () => syncSlider(s));
    });

    // ─── DOM References ────────────────────────────────────────────
    const sidebarNav         = document.getElementById('sidebarNav');
    const algoTitle          = document.getElementById('algoTitle');
    const algoCategory       = document.getElementById('algoCategory');
    const algoTime           = document.getElementById('algoTime');
    const algoSpace          = document.getElementById('algoSpace');
    const cppSourceCode      = document.getElementById('cppSourceCode');
    const theoryText         = document.getElementById('theoryText');
    const pseudocodeText     = document.getElementById('pseudocodeText');
    const controlsPanel      = document.getElementById('controlsPanel');
    const customInput        = document.getElementById('customInput');
    const targetInput        = document.getElementById('targetInput');
    const targetGroup        = document.getElementById('targetGroup');
    const runBtn             = document.getElementById('runBtn');
    const randomizeBtn       = document.getElementById('randomizeBtn');
    const speedSlider        = document.getElementById('speedSlider');
    const visualizerContainer = document.getElementById('visualizerContainer');
    const visualizerLogs     = document.getElementById('visualizerLogs');

    // DS Controls
    const standardControls   = document.getElementById('standardControls');
    const dsControls         = document.getElementById('dsControls');
    const dsValueInput       = document.getElementById('dsValueInput');
    const dsInputLabel       = document.getElementById('dsInputLabel');
    const dsSpeedSlider      = document.getElementById('dsSpeedSlider');
    const stackBtns          = document.getElementById('stackBtns');
    const pushBtn            = document.getElementById('pushBtn');
    const popBtn             = document.getElementById('popBtn');
    const queueBtns          = document.getElementById('queueBtns');
    const enqBtn             = document.getElementById('enqBtn');
    const deqBtn             = document.getElementById('deqBtn');
    const infixBtns          = document.getElementById('infixBtns');
    const runInfixBtn        = document.getElementById('runInfixBtn');
    const sllBtns            = document.getElementById('sllBtns');
    const sllInsertStartBtn  = document.getElementById('sllInsertStartBtn');
    const sllInsertEndBtn    = document.getElementById('sllInsertEndBtn');
    const sllDeleteStartBtn  = document.getElementById('sllDeleteStartBtn');

    // Tabs
    const tabBtns     = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // ─── State ──────────────────────────────────────────────────────
    let currentAlgo = null;
    let isVisualizing = false;
    let dsState = [];

    const getDelay   = () => 501 - parseInt(speedSlider.value);
    const getDSDelay = () => 501 - parseInt(dsSpeedSlider.value);
    const sleep      = ms  => new Promise(r => setTimeout(r, ms));

    // ─── Tabs ───────────────────────────────────────────────────────
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
            });
            tabContents.forEach(c => {
                c.classList.remove('active');
            });
            btn.classList.add('active');
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            if (target) target.classList.add('active');
        });
    });

    // ─── Logger ─────────────────────────────────────────────────────
    const log = (msg, type = 'info') => {
        const span = document.createElement('span');
        span.className = `log-line log-${type}`;
        span.innerHTML = `&gt; ${msg}`;
        visualizerLogs.appendChild(span);
        visualizerLogs.scrollTop = visualizerLogs.scrollHeight;
    };
    const clearLogs = () => { visualizerLogs.innerHTML = ''; };

    // ─── Sidebar Rendering ──────────────────────────────────────────
    function renderSidebar(algorithms) {
        sidebarNav.innerHTML = '';
        const groups = {};
        Object.values(algorithms).forEach(algo => {
            if (!groups[algo.category]) groups[algo.category] = [];
            groups[algo.category].push(algo);
        });

        // Category icon mapping
        const icons = {
            'Sorting': `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/></svg>`,
            'Searching': `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
            'Linear Data Structures': `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="7" width="18" height="10" rx="1"/></svg>`,
            'Linked Lists': `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
            'Expression Parsing': `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`
        };

        for (const [category, algos] of Object.entries(groups)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'sidebar-group';

            const label = document.createElement('div');
            label.className = 'sidebar-group-label';
            label.innerHTML = `${icons[category] || ''} ${category}`;
            groupDiv.appendChild(label);

            algos.forEach(algo => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-item';
                btn.innerHTML = `<span class="sidebar-indicator"></span>${algo.name}`;
                btn.onclick = () => {
                    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    loadAlgorithm(algo.id);
                };
                groupDiv.appendChild(btn);
            });
            sidebarNav.appendChild(groupDiv);
        }
    }

    // ─── API Load ───────────────────────────────────────────────────
    async function fetchAlgorithms() {
        try {
            const res = await fetch('/api/algorithms');
            const data = await res.json();
            renderSidebar(data);
        } catch (e) {
            sidebarNav.innerHTML = `<div style="padding:1rem; color:#f87171; font-size:0.78rem;">⚠ Error loading API. Run the Flask server.</div>`;
        }
    }

    async function loadAlgorithm(id) {
        if (isVisualizing) {
            log('Visualization in progress — please wait.', 'warn');
            return;
        }
        visualizerContainer.innerHTML = `<div class="viz-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="width:36px;height:36px;animation:pulse 1.5s infinite"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg><span>Loading...</span></div>`;
        clearLogs();
        log(`Loading ${id}...`);

        try {
            const res = await fetch(`/api/algorithm/${id}`);
            const data = await res.json();
            currentAlgo = data;

            algoTitle.textContent = data.name;
            algoCategory.textContent = data.category;
            algoTime.textContent = `Time: ${data.timeComplexity}`;
            algoSpace.textContent = `Space: ${data.spaceComplexity}`;

            cppSourceCode.textContent = data.sourceCode;
            theoryText.textContent = data.theory;
            pseudocodeText.textContent = data.pseudocode;
            hljs.highlightElement(cppSourceCode);

            controlsPanel.classList.add('visible');
            populateInput(data);
            log(`${data.name} loaded — ready to visualize.`, 'success');

        } catch (e) {
            log(`Failed to load: ${e.message}`, 'error');
        }
    }

    // ─── Input Population ───────────────────────────────────────────
    function showStandardControls() {
        standardControls.style.display = 'flex';
        dsControls.style.display       = 'none';
    }
    function showDSControls() {
        standardControls.style.display = 'none';
        dsControls.style.display       = 'flex';
        stackBtns.style.display  = 'none';
        queueBtns.style.display  = 'none';
        infixBtns.style.display  = 'none';
        sllBtns.style.display    = 'none';
    }

    function populateInput(data) {
        if (!data) return;
        dsState = [];
        if (dsValueInput) dsValueInput.value = '';

        const cat = data.category;
        if (cat === 'Linear Data Structures' || cat === 'Linked Lists' || cat === 'Expression Parsing') {
            showDSControls();
            visualizerContainer.innerHTML = '';

            if (data.id === 'stack') {
                stackBtns.style.display = 'flex';
                dsValueInput.placeholder = 'Value to Push';
                dsValueInput.value = '42';
                dsInputLabel.textContent = 'Value';
                drawNodes(dsState, 'Stack — Right = Top');
            } else if (data.id === 'queue') {
                queueBtns.style.display = 'flex';
                dsValueInput.placeholder = 'Value to Enqueue';
                dsValueInput.value = '42';
                dsInputLabel.textContent = 'Value';
                drawNodes(dsState, 'Queue — Left = Front');
            } else if (data.id.startsWith('sll_')) {
                sllBtns.style.display = 'flex';
                dsValueInput.placeholder = 'Value to Insert';
                dsValueInput.value = '10';
                dsInputLabel.textContent = 'Value';
                drawNodes(dsState, 'Singly Linked List');
            } else if (data.id === 'infix_postfix') {
                infixBtns.style.display = 'flex';
                dsValueInput.placeholder = 'Expression, e.g. A+B*C';
                dsValueInput.value = 'A+B*C';
                dsInputLabel.textContent = 'Expression';
            }
            return;
        }

        showStandardControls();
        targetGroup.style.display = cat === 'Searching' ? 'flex' : 'none';

        if (cat === 'Sorting') {
            const count = (data.id === 'merge' || data.id === 'quick') ? 50 : 25;
            customInput.value = Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 5).join(', ');
        } else if (cat === 'Searching') {
            const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 5).sort((a, b) => a - b);
            customInput.value = arr.join(', ');
            targetInput.value = arr[Math.floor(Math.random() * arr.length)];
        } else {
            customInput.value = '10, 20, 30';
        }
        drawInitial();
    }

    // ─── Drawing Utilities ──────────────────────────────────────────
    const drawBars = (arr) => {
        visualizerContainer.innerHTML = '';
        const maxVal = Math.max(...arr) || 1;
        arr.forEach((val, i) => {
            const bar = document.createElement('div');
            bar.className = 'graph-bar';
            bar.style.height = `${(val / maxVal) * 100}%`;
            bar.id = `bar-${i}`;
            if (arr.length <= 40) bar.textContent = val;
            visualizerContainer.appendChild(bar);
        });
    };

    const drawNodes = (arr, title = 'Structure') => {
        visualizerContainer.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.75rem;">
                <div style="font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#475569;">${title}</div>
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; justify-content:center;" id="nodeContainer"></div>
            </div>`;
        const container = document.getElementById('nodeContainer');
        arr.forEach((val, i) => {
            const node = document.createElement('div');
            node.className = 'ds-node';
            node.id = `node-${i}`;
            node.textContent = val;
            node.style.animationDelay = `${i * 0.04}s`;
            container.appendChild(node);
            if (currentAlgo && currentAlgo.category === 'Linked Lists' && i < arr.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'ds-arrow';
                container.appendChild(arrow);
            }
        });
    };

    function drawInitial() {
        if (!currentAlgo) return;
        let arr = [];
        try { arr = customInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)); } catch (e) {}
        if (arr.length) drawBars(arr);
    }

    // ─── Randomize ──────────────────────────────────────────────────
    randomizeBtn.addEventListener('click', () => {
        populateInput(currentAlgo);
        log('Array randomized.', 'info');
    });

    // ─── DS Interaction Listeners ───────────────────────────────────
    pushBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Pushed <strong>${val}</strong> to stack`);
        drawNodes(dsState, 'Stack — Right = Top');
    });
    popBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        if (!dsState.length) { log('Stack Underflow!', 'error'); return; }
        const val = dsState.pop();
        log(`Popped <strong>${val}</strong> from stack`, 'success');
        drawNodes(dsState, 'Stack — Right = Top');
    });
    enqBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Enqueued <strong>${val}</strong>`);
        drawNodes(dsState, 'Queue — Left = Front');
    });
    deqBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        if (!dsState.length) { log('Queue Underflow!', 'error'); return; }
        const val = dsState.shift();
        log(`Dequeued <strong>${val}</strong>`, 'success');
        drawNodes(dsState, 'Queue — Left = Front');
    });
    sllInsertStartBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.unshift(val);
        log(`Inserted <strong>${val}</strong> at start of SLL`);
        drawNodes(dsState, 'Singly Linked List');
    });
    sllInsertEndBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        const val = dsValueInput.value.trim() || 'X';
        dsState.push(val);
        log(`Inserted <strong>${val}</strong> at end of SLL`);
        drawNodes(dsState, 'Singly Linked List');
    });
    sllDeleteStartBtn.addEventListener('click', () => {
        if (isVisualizing) return;
        if (!dsState.length) { log('List is empty!', 'error'); return; }
        const val = dsState.shift();
        log(`Deleted <strong>${val}</strong> from SLL`, 'success');
        drawNodes(dsState, 'Singly Linked List');
    });
    runInfixBtn.addEventListener('click', async () => {
        if (isVisualizing) return;
        const expr = dsValueInput.value.trim().toUpperCase();
        if (!expr) return;
        await visInfixPostfix(expr);
    });

    // ─── Infix → Postfix Visualizer ─────────────────────────────────
    async function visInfixPostfix(expr) {
        isVisualizing = true;
        clearLogs();
        visualizerContainer.innerHTML = '';

        const stackCont = document.createElement('div');
        stackCont.style.cssText = 'display:flex;flex-direction:column;gap:4px;align-items:center;margin-right:2rem;min-width:80px;';
        const stackTitle = document.createElement('div');
        stackTitle.textContent = 'Stack';
        stackTitle.style.cssText = 'font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#475569;margin-bottom:6px;';
        stackCont.appendChild(stackTitle);

        const outputCont = document.createElement('div');
        outputCont.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;max-width:65%;';
        const outputTitle = document.createElement('div');
        outputTitle.textContent = 'Output';
        outputTitle.style.cssText = 'font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#475569;width:100%;margin-bottom:4px;';
        outputCont.appendChild(outputTitle);

        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;width:100%;align-items:flex-start;justify-content:center;padding-top:1.5rem;';
        wrap.appendChild(stackCont);
        wrap.appendChild(outputCont);
        visualizerContainer.appendChild(wrap);

        let stack = [];
        let output = '';

        function precedence(c) {
            if (c === '^') return 3;
            if (c === '/' || c === '*') return 2;
            if (c === '+' || c === '-') return 1;
            return -1;
        }

        function renderStackVis(arr) {
            while (stackCont.childNodes.length > 1) stackCont.removeChild(stackCont.lastChild);
            for (let i = arr.length - 1; i >= 0; i--) {
                const node = document.createElement('div');
                node.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,0.12);border:1.5px solid rgba(99,102,241,0.4);border-radius:8px;color:#a5b4fc;font-weight:700;font-size:0.85rem;animation:nodeIn 0.25s ease both;';
                node.textContent = arr[i];
                stackCont.appendChild(node);
            }
        }

        for (let i = 0; i < expr.length; i++) {
            let c = expr[i];
            if (c === ' ') continue;
            log(`Processing '${c}'`);
            await sleep(getDSDelay());

            if (/[a-zA-Z0-9]/.test(c)) {
                output += c;
                const node = document.createElement('div');
                node.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,0.12);border:1.5px solid rgba(99,102,241,0.4);border-radius:6px;color:#a5b4fc;font-weight:700;font-size:0.85rem;animation:nodeIn 0.25s ease both;';
                node.textContent = c;
                outputCont.appendChild(node);
                log(`Operand '${c}' → output`);
            } else if (c === '(') {
                stack.push(c);
                renderStackVis(stack);
                log(`'(' → stack`);
            } else if (c === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    let op = stack.pop();
                    output += op;
                    const node = document.createElement('div');
                    node.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,0.12);border:1.5px solid rgba(16,185,129,0.4);border-radius:6px;color:#6ee7b7;font-weight:700;font-size:0.85rem;animation:nodeIn 0.25s ease both;';
                    node.textContent = op;
                    outputCont.appendChild(node);
                    renderStackVis(stack);
                    await sleep(getDSDelay());
                }
                if (stack.length > 0) { stack.pop(); renderStackVis(stack); }
            } else {
                while (stack.length > 0 && precedence(c) <= precedence(stack[stack.length - 1])) {
                    let op = stack.pop();
                    output += op;
                    const node = document.createElement('div');
                    node.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,0.12);border:1.5px solid rgba(16,185,129,0.4);border-radius:6px;color:#6ee7b7;font-weight:700;font-size:0.85rem;animation:nodeIn 0.25s ease both;';
                    node.textContent = op;
                    outputCont.appendChild(node);
                    renderStackVis(stack);
                    await sleep(getDSDelay());
                }
                stack.push(c);
                renderStackVis(stack);
                log(`Operator '${c}' → stack`);
            }
            await sleep(getDSDelay());
        }

        while (stack.length > 0) {
            let op = stack.pop();
            output += op;
            const node = document.createElement('div');
            node.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,0.12);border:1.5px solid rgba(16,185,129,0.4);border-radius:6px;color:#6ee7b7;font-weight:700;font-size:0.85rem;animation:nodeIn 0.25s ease both;';
            node.textContent = op;
            outputCont.appendChild(node);
            renderStackVis(stack);
            await sleep(getDSDelay());
        }
        log(`✓ Postfix Result: <strong>${output}</strong>`, 'success');
        isVisualizing = false;
    }

    // ─── Sorting Visualizers ────────────────────────────────────────
    async function visBubbleSort(arr) {
        drawBars(arr);
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                const b1 = document.getElementById(`bar-${j}`);
                const b2 = document.getElementById(`bar-${j + 1}`);
                b1.classList.add('comparing'); b2.classList.add('comparing');
                await sleep(getDelay());
                if (arr[j] > arr[j + 1]) {
                    log(`Swapping ${arr[j]} ↔ ${arr[j + 1]}`);
                    b1.classList.add('swapping'); b2.classList.add('swapping');
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    b1.style.height = `${(arr[j] / Math.max(...arr)) * 100}%`;     b1.textContent = arr.length <= 40 ? arr[j] : '';
                    b2.style.height = `${(arr[j + 1] / Math.max(...arr)) * 100}%`; b2.textContent = arr.length <= 40 ? arr[j + 1] : '';
                    await sleep(getDelay());
                    b1.classList.remove('swapping'); b2.classList.remove('swapping');
                }
                b1.classList.remove('comparing'); b2.classList.remove('comparing');
            }
            document.getElementById(`bar-${n - i - 1}`).classList.add('sorted');
        }
        document.getElementById(`bar-0`).classList.add('sorted');
        log('✓ Bubble Sort complete!', 'success');
    }

    async function visSelectionSort(arr) {
        drawBars(arr);
        let n = arr.length;
        for (let i = 0; i < n; i++) {
            let minIdx = i;
            document.getElementById(`bar-${i}`).classList.add('swapping');
            for (let j = i + 1; j < n; j++) {
                const bJ = document.getElementById(`bar-${j}`);
                bJ.classList.add('comparing');
                await sleep(getDelay());
                if (arr[j] < arr[minIdx]) {
                    if (minIdx !== i) document.getElementById(`bar-${minIdx}`).classList.remove('swapping');
                    minIdx = j;
                    document.getElementById(`bar-${minIdx}`).classList.add('swapping');
                }
                bJ.classList.remove('comparing');
            }
            if (minIdx !== i) {
                log(`Min = ${arr[minIdx]}, swapping with position ${i}`);
                const bI   = document.getElementById(`bar-${i}`);
                const bMin = document.getElementById(`bar-${minIdx}`);
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                const maxV = Math.max(...arr);
                bI.style.height   = `${(arr[i] / maxV) * 100}%`;   bI.textContent   = arr.length <= 40 ? arr[i] : '';
                bMin.style.height = `${(arr[minIdx] / maxV) * 100}%`; bMin.textContent = arr.length <= 40 ? arr[minIdx] : '';
                bMin.classList.remove('swapping');
                await sleep(getDelay() * 2);
            }
            document.getElementById(`bar-${i}`).classList.remove('swapping');
            document.getElementById(`bar-${i}`).classList.add('sorted');
        }
        log('✓ Selection Sort complete!', 'success');
    }

    async function visInsertionSort(arr) {
        drawBars(arr);
        let n = arr.length;
        document.getElementById(`bar-0`).classList.add('sorted');
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            const bKey = document.getElementById(`bar-${i}`);
            bKey.classList.add('swapping');
            await sleep(getDelay());
            while (j >= 0 && arr[j] > key) {
                log(`Moving ${arr[j]} right`);
                const bNext = document.getElementById(`bar-${j + 1}`);
                const bCurr = document.getElementById(`bar-${j}`);
                arr[j + 1] = arr[j];
                bNext.style.height = bCurr.style.height;
                bNext.textContent  = arr.length <= 40 ? arr[j + 1] : '';
                bNext.classList.add('comparing');
                await sleep(getDelay());
                bNext.classList.remove('comparing');
                bNext.classList.add('sorted');
                j--;
            }
            arr[j + 1] = key;
            const bIns = document.getElementById(`bar-${j + 1}`);
            bIns.style.height = `${(key / Math.max(...arr)) * 100}%`;
            bIns.textContent  = arr.length <= 40 ? key : '';
            bIns.classList.remove('swapping');
            bIns.classList.add('sorted');
            for (let k = 0; k <= i; k++) document.getElementById(`bar-${k}`).classList.add('sorted');
        }
        log('✓ Insertion Sort complete!', 'success');
    }

    async function visMergeSort(arr) {
        drawBars(arr);
        const maxVal = Math.max(...arr) || 1;
        async function merge(l, m, r) {
            let L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
            let i = 0, j = 0, k = l;
            while (i < L.length && j < R.length) {
                const b = document.getElementById(`bar-${k}`);
                b.classList.add('comparing');
                await sleep(getDelay());
                arr[k] = L[i] <= R[j] ? L[i++] : R[j++];
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent  = arr.length <= 40 ? arr[k] : '';
                b.classList.remove('comparing'); b.classList.add('sorted');
                k++;
            }
            while (i < L.length) {
                arr[k] = L[i++];
                const b = document.getElementById(`bar-${k}`);
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent  = arr.length <= 40 ? arr[k] : '';
                b.classList.add('sorted'); k++;
                await sleep(getDelay());
            }
            while (j < R.length) {
                arr[k] = R[j++];
                const b = document.getElementById(`bar-${k}`);
                b.style.height = `${(arr[k] / maxVal) * 100}%`;
                b.textContent  = arr.length <= 40 ? arr[k] : '';
                b.classList.add('sorted'); k++;
                await sleep(getDelay());
            }
        }
        async function ms(l, r) {
            if (l >= r) return;
            const m = l + Math.floor((r - l) / 2);
            await ms(l, m); await ms(m + 1, r); await merge(l, m, r);
        }
        log('Starting Merge Sort...');
        await ms(0, arr.length - 1);
        log('✓ Merge Sort complete!', 'success');
    }

    async function visQuickSort(arr) {
        drawBars(arr);
        const maxVal = Math.max(...arr) || 1;
        async function partition(lo, hi) {
            let pivot = arr[hi];
            const bP = document.getElementById(`bar-${hi}`);
            bP.classList.add('swapping');
            let i = lo - 1;
            for (let j = lo; j < hi; j++) {
                const bJ = document.getElementById(`bar-${j}`);
                bJ.classList.add('comparing');
                await sleep(getDelay());
                if (arr[j] < pivot) {
                    i++;
                    log(`Swapping ${arr[i]} ↔ ${arr[j]}`);
                    const bI = document.getElementById(`bar-${i}`);
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    bI.style.height = `${(arr[i] / maxVal) * 100}%`; bI.textContent = arr.length <= 40 ? arr[i] : '';
                    bJ.style.height = `${(arr[j] / maxVal) * 100}%`; bJ.textContent = arr.length <= 40 ? arr[j] : '';
                }
                bJ.classList.remove('comparing');
            }
            [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
            const bFinal = document.getElementById(`bar-${i + 1}`);
            bFinal.style.height = `${(arr[i + 1] / maxVal) * 100}%`; bFinal.textContent = arr.length <= 40 ? arr[i + 1] : '';
            bP.style.height = `${(arr[hi] / maxVal) * 100}%`; bP.textContent = arr.length <= 40 ? arr[hi] : '';
            bP.classList.remove('swapping');
            bFinal.classList.add('sorted');
            await sleep(getDelay());
            return i + 1;
        }
        async function qs(lo, hi) {
            if (lo < hi) {
                let pi = await partition(lo, hi);
                await qs(lo, pi - 1); await qs(pi + 1, hi);
            } else if (lo === hi) {
                document.getElementById(`bar-${lo}`).classList.add('sorted');
            }
        }
        log('Starting Quick Sort...');
        await qs(0, arr.length - 1);
        document.querySelectorAll('.graph-bar').forEach(b => b.classList.add('sorted'));
        log('✓ Quick Sort complete!', 'success');
    }

    // ─── Search Visualizers ─────────────────────────────────────────
    async function visLinearSearch(arr, target) {
        drawBars(arr);
        for (let i = 0; i < arr.length; i++) {
            const b = document.getElementById(`bar-${i}`);
            b.classList.add('comparing');
            log(`Checking index ${i}: ${arr[i]} == ${target}?`);
            await sleep(getDelay());
            if (arr[i] === target) {
                b.classList.remove('comparing');
                b.classList.add('sorted');
                log(`✓ Found ${target} at index ${i}!`, 'success');
                return;
            }
            b.classList.remove('comparing');
            b.style.opacity = '0.3';
        }
        log(`✗ Target ${target} not found.`, 'warn');
    }

    async function visBinarySearch(arr, target) {
        drawBars(arr);
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            log(`Bounds [${low}..${high}] → mid = ${mid} (val=${arr[mid]})`);
            document.querySelectorAll('.graph-bar').forEach((b, idx) => {
                b.classList.remove('swapping');
                if (idx >= low && idx <= high) b.style.opacity = '1';
                else b.style.opacity = '0.2';
            });
            const bMid = document.getElementById(`bar-${mid}`);
            bMid.classList.add('comparing');
            await sleep(getDelay() * 1.5);
            if (arr[mid] === target) {
                bMid.classList.remove('comparing'); bMid.classList.add('sorted');
                log(`✓ Found ${target} at index ${mid}!`, 'success');
                return;
            } else if (arr[mid] < target) {
                log(`${arr[mid]} < ${target} → search right half`);
                bMid.classList.add('swapping'); low = mid + 1;
            } else {
                log(`${arr[mid]} > ${target} → search left half`);
                bMid.classList.add('swapping'); high = mid - 1;
            }
            await sleep(getDelay());
        }
        log(`✗ Target ${target} not found.`, 'warn');
    }

    // ─── Generic Fallback ───────────────────────────────────────────
    async function visGeneric(arr) {
        log('Running simulated visualization.', 'warn');
        if (currentAlgo && (currentAlgo.category === 'Linked Lists' || currentAlgo.category === 'Linear Data Structures')) {
            drawNodes(arr, currentAlgo.name);
        } else {
            drawBars(arr);
            await sleep(getDelay() * 2);
            arr.sort((a, b) => a - b);
            drawBars(arr);
            document.querySelectorAll('.graph-bar').forEach(b => b.classList.add('sorted'));
            log('Array sorted (simulated).', 'success');
        }
    }

    // ─── Run Button ─────────────────────────────────────────────────
    runBtn.addEventListener('click', async () => {
        if (!currentAlgo || isVisualizing) return;
        isVisualizing = true;
        runBtn.disabled = true;
        clearLogs();

        let arr = [];
        try {
            arr = customInput.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (!arr.length) throw new Error();
        } catch {
            log('Invalid input — enter comma-separated numbers.', 'error');
            isVisualizing = false;
            runBtn.disabled = false;
            return;
        }

        log(`Starting ${currentAlgo.name}...`);
        try {
            switch (currentAlgo.id) {
                case 'bubble':              await visBubbleSort(arr); break;
                case 'selection':           await visSelectionSort(arr); break;
                case 'insertion':           await visInsertionSort(arr); break;
                case 'merge':               await visMergeSort(arr); break;
                case 'quick':               await visQuickSort(arr); break;
                case 'linear_search': {
                    const t = parseInt(targetInput.value);
                    if (isNaN(t)) throw new Error('Invalid target');
                    await visLinearSearch(arr, t); break;
                }
                default:
                    if (currentAlgo.id.includes('binary_search')) {
                        const t = parseInt(targetInput.value);
                        if (isNaN(t)) throw new Error('Invalid target');
                        await visBinarySearch(arr, t);
                    } else {
                        await visGeneric(arr);
                    }
            }
        } catch (err) {
            log(`Error: ${err.message}`, 'error');
        }

        isVisualizing = false;
        runBtn.disabled = false;
    });

    // ─── Init ────────────────────────────────────────────────────────
    fetchAlgorithms();
});
