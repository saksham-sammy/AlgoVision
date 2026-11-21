document.addEventListener('DOMContentLoaded', () => {
    const algoSelect = document.getElementById('algoSelect');
    const targetWrapper = document.getElementById('targetWrapper');
    const runBtn = document.getElementById('runBtn');
    const inputArrayEl = document.getElementById('inputArray');
    const targetValueEl = document.getElementById('targetValue');
    const outputConsole = document.getElementById('outputConsole');
    const timeMetric = document.getElementById('timeMetric');

    // Toggle target input visibility based on algo type
    algoSelect.addEventListener('change', (e) => {
        if (e.target.value.includes('Search')) {
            targetWrapper.classList.remove('hidden');
        } else {
            targetWrapper.classList.add('hidden');
        }
    });

    const printToConsole = (msg, color = 'text-slate-300') => {
        const span = document.createElement('span');
        span.className = color;
        span.innerHTML = `> ${msg}<br>`;
        outputConsole.appendChild(span);
        outputConsole.scrollTop = outputConsole.scrollHeight;
    };

    const clearConsole = () => {
        outputConsole.innerHTML = '';
    };

    // ALGORITHMS (Ported from the C++ Sem 3 curriculum)

    const bubbleSort = (arr) => {
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    };

    const quickSort = (arr) => {
        if (arr.length <= 1) return arr;
        let pivot = arr[arr.length - 1];
        let left = [];
        let right = [];
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] < pivot) left.push(arr[i]);
            else right.push(arr[i]);
        }
        return [...quickSort(left), pivot, ...quickSort(right)];
    };

    const mergeSort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        
        let result = [], i = 0, j = 0;
        while(i < left.length && j < right.length) {
            if (left[i] < right[j]) result.push(left[i++]);
            else result.push(right[j++]);
        }
        return result.concat(left.slice(i)).concat(right.slice(j));
    };

    const binarySearch = (arr, target) => {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    };

    const linearSearch = (arr, target) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === target) return i;
        }
        return -1;
    };

    // Execution Engine
    runBtn.addEventListener('click', () => {
        clearConsole();
        const algo = algoSelect.value;
        const rawInput = inputArrayEl.value;
        const target = parseInt(targetValueEl.value, 10);

        printToConsole(`Initializing ${algo}...`, 'text-blue-400');

        let arr;
        try {
            arr = rawInput.split(',').map(item => parseInt(item.trim(), 10)).filter(n => !isNaN(n));
            if(arr.length === 0) throw new Error("Empty array");
        } catch (e) {
            printToConsole(`Error: Invalid input array format. Please use comma-separated numbers.`, 'text-red-400');
            return;
        }

        printToConsole(`Input size: ${arr.length} elements`);
        
        const startTime = performance.now();
        let result;
        let msg = '';

        try {
            switch(algo) {
                case 'bubbleSort':
                    result = bubbleSort([...arr]);
                    msg = `Sorted Array: [${result.join(', ')}]`;
                    break;
                case 'quickSort':
                    result = quickSort([...arr]);
                    msg = `Sorted Array: [${result.join(', ')}]`;
                    break;
                case 'mergeSort':
                    result = mergeSort([...arr]);
                    msg = `Sorted Array: [${result.join(', ')}]`;
                    break;
                case 'binarySearch':
                    // Binary search needs sorted array
                    const sortedForBs = mergeSort([...arr]);
                    printToConsole(`Note: Array sorted for Binary Search: [${sortedForBs.join(', ')}]`, 'text-yellow-400');
                    result = binarySearch(sortedForBs, target);
                    msg = result !== -1 ? `Target ${target} found at index ${result}` : `Target ${target} not found`;
                    break;
                case 'linearSearch':
                    result = linearSearch(arr, target);
                    msg = result !== -1 ? `Target ${target} found at index ${result}` : `Target ${target} not found`;
                    break;
            }
        } catch(err) {
            printToConsole(`Execution Error: ${err.message}`, 'text-red-400');
            return;
        }

        const endTime = performance.now();
        const execTime = (endTime - startTime).toFixed(3);
        
        printToConsole(`Execution successful.`, 'text-emerald-400');
        printToConsole(msg);
        
        timeMetric.textContent = `${execTime} ms`;
        timeMetric.classList.remove('hidden');
    });
});
