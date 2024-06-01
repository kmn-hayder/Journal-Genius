document.addEventListener('DOMContentLoaded', () => {    const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');
const startGameButton = document.getElementById('startGameButton');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const leaderboardTable = document.querySelector('#leaderboard tbody');
const gameArea = document.getElementById('gameArea');
const dropArea = document.getElementById('dropArea');
const pointsDrDisplay = document.getElementById('pointsDr');
const pointsCrDisplay = document.getElementById('pointsCr');
const resultScreen = document.getElementById('resultScreen');
const resultMessage = document.getElementById('resultMessage');
const pointsSummary = document.getElementById('pointsSummary');
const retryButton = document.getElementById('retryButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let playerName = '';
let tableA = [];
let tableB = [];
let tableDr = [];
let tableCr = [];
const accountList1 = [
    'Accounts Payable', 'Notes Payable', 'Accrued Liabilities', 'Unearned Revenue', 'Interest Payable',
    'Wages Payable', 'Taxes Payable', 'Bonds Payable'
];
const accountList2 = [
    'Cash', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Land', 'Buildings', 'Equipment',
    'Supplies', 'Intangible Assets'
];
let currentLevel = 1;
let currentBox = null;
let currentBoxData = null;

startButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        addPlayerToLeaderboard(playerName);
        playerNameInput.value = '';
        document.getElementById('nameInputScreen').style.display = 'none';
        leaderboardScreen.style.display = 'block';
    } else {
        alert('Please enter your name.');
    }
});

startGameButton.addEventListener('click', () => {
    console.log("Start game button clicked");
    leaderboardScreen.style.display = 'none';
    gameArea.style.display = 'block';
    generateRandomData();
    startGame();
});

retryButton.addEventListener('click', () => {
    console.log("Retry button clicked");
    resultScreen.style.display = 'none';
    gameArea.style.display = 'block';
    generateRandomData();
    startGame();
});

nextLevelButton.addEventListener('click', () => {
    console.log("Next level button clicked");
    resultScreen.style.display = 'none';
    gameArea.style.display = 'block';
    currentLevel++;
    generateRandomData();
    startGame();
});

leftButton.addEventListener('click', () => {
    if (currentBox) {
        moveBox('left');
    }
});

rightButton.addEventListener('click', () => {
    if (currentBox) {
        moveBox('right');
    }
});

function addPlayerToLeaderboard(name) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = name;
    row.appendChild(cell);
    leaderboardTable.appendChild(row);
}

function generateRandomData() {
    console.log("Generating random data");
    tableA = [];
    tableB = [];

    // Generate 5 entries for tableA
    for (let i = 0; i < 5; i++) {
        let A = getRandomAccountFromList(accountList1);
        let M = getRandomNumber();
        tableA.push({ account: A, value: M });
    }

    // Generate 5 entries for tableB
    for (let i = 0; i < 5; i++) {
        let B = getRandomAccountFromList(accountList2);
        let N = calculateN(tableA[i].value); // Get the corresponding value from tableA
        tableB.push({ account: B, value: N });
    }

    console.log("Generated tableA:", tableA);
    console.log("Generated tableB:", tableB);
    updatePointsDisplay();
}

function calculateN(M) {
    if (M > 0) return M;
    if (M < 0) return M; // Change this line
    return 0;
}

function getRandomAccountFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomNumber() {
    let num;
    do {
        num = Math.floor(Math.random() * 200001) - 100000;
    } while (num === 0);
    return num;
} // Missing closing bracket here

function startGame() {
    console.log("Starting game");
    tableDr = [];
    tableCr = [];
    updatePointsDisplay();
    runGameLoop();
}

// Rest of the code...

function runGameLoop() {
    console.log("Running game loop");
    if (tableA.length === 0 && tableB.length === 0) {
        endGame();
        return;
    }

    const availableTables = [];
    if (tableA.length > 0) {
        availableTables.push(tableA);
    }
    if (tableB.length > 0) {
        availableTables.push(tableB);
    }

    if (availableTables.length === 0) {
        // Both tables are empty, end the game
        endGame();
        return;
    }

    const sourceTableIndex = Math.floor(Math.random() * availableTables.length);
    const sourceTable = availableTables[sourceTableIndex];

    currentBoxData = sourceTable.shift();
    console.log("Displaying dropping box:", currentBoxData);
    displayDroppingBox(currentBoxData)
        .then(continueGameLoop);
}

function continueGameLoop() {
    console.log("Box dropped, running game loop again");
    setTimeout(runGameLoop, 100); // Delay the next loop iteration by 100 milliseconds
}

function displayDroppingBox(boxData) {
    return new Promise((resolve) => {
        currentBox = document.createElement('div');
        currentBox.classList.add('droppingBox');
        currentBox.textContent = `${boxData.account}: ${boxData.value}`;
        currentBox.style.top = '0';
        currentBox.style.left = 'calc(50% - 50px)'; // Center the box initially
        dropArea.appendChild(currentBox);

        setTimeout(() => {
            currentBox.style.top = 'calc(100% - 100px)';
            setTimeout(() => {
                finalizeBoxPosition();
                resolve();
            }, 3000);
        }, 2000);
    });
}

function moveBox(direction) {
    if (direction === 'left') {
        currentBox.style.left = '0';
    } else if (direction === 'right') {
        currentBox.style.left = 'calc(100% - 100px)';
    }
}

function finalizeBoxPosition() {
    const leftPosition = parseFloat(currentBox.style.left); // Convert from string to number
    console.log('Box position:', leftPosition, 'Drop area width:', dropArea.clientWidth);

    if (leftPosition < dropArea.clientWidth / 2) {
        tableDr.push(currentBoxData);
    } else {
        tableCr.push(currentBoxData);
    }
    dropArea.removeChild(currentBox);
    currentBox = null;
    currentBoxData = null;
    updatePointsDisplay();
}

function updatePointsDisplay() {
    const sumDr = tableDr.reduce((acc, entry) => acc + Math.abs(entry.value), 0);
    const sumCr = tableCr.reduce((acc, entry) => acc + Math.abs(entry.value), 0);
    pointsDrDisplay.textContent = sumDr;
    pointsCrDisplay.textContent = sumCr;
}

function endGame() {
    console.log("Ending game");
    const sumDr = tableDr.reduce((acc, entry) => acc + Math.abs(entry.value), 0);
    const sumCr = tableCr.reduce((acc, entry) => acc + Math.abs(entry.value), 0);

    gameArea.style.display = 'none';
    resultScreen.style.display = 'block';

    pointsSummary.textContent = `Dr: ${sumDr}, Cr: ${sumCr}`;

    if (sumDr !== sumCr) {
        resultMessage.textContent = 'Life is Unfair. Level Failed 🙁';
        retryButton.style.display = 'block';
        nextLevelButton.style.display = 'none';
    } else {
        if (currentLevel === 3) {
            resultMessage.textContent = 'Thik hain! Game Finished!';
            nextLevelButton.style.display = 'none';
            retryButton.style.display = 'none';
            showLeaderboard();
        } else {
            resultMessage.textContent = 'Thik hain! Level Up!';
            nextLevelButton.style.display = 'block';
            retryButton.style.display = 'none';
            // Call runGameLoop after a delay to start the next level
            setTimeout(() => {
                runGameLoop();
            }, 3000); // Adjust the delay as needed
        }
    }
}

function showLeaderboard() {
    leaderboardScreen.style.display = 'block';
}
});
