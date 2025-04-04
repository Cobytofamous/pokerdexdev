function showGameSetup() {
    document.getElementById("setupForm").style.display = "block";
}

async function createTable() {
    const solToToken = document.getElementById('solToToken').value;
    const smallBlind = document.getElementById('smallBlind').value;
    const bigBlind = document.getElementById('bigBlind').value;
    const gameType = document.getElementById('gameType').value;

    // Generate a unique table ID (you might want to use a more robust method)
    const tableId = Math.random().toString(36).substr(2, 8); // Generate unique table ID
        // Calculate minimum and maximum buy-ins based on game type
    const minBuyIn = bigBlind * 10; // Minimum buy-in is always 10x the big blind
    let maxBuyIn = gameType === "limit" ? bigBlind * 100 : null; // Max buy-in for limit game, no limit for "No Limit"

    try {
const response = await fetch('https://pokerdexdev-server.onrender.com/registerTable', {  //  ✅  Full backend URL
    method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableId, solToToken, smallBlind, bigBlind, gameType })
        });

        if (!response.ok) {
            throw new Error('Failed to create table');
        }

        // Table created successfully, generate the game URL
        const tableUrl = `${window.location.origin}/game.html?table=${tableId}`;;
        document.getElementById('tableUrl').value = tableUrl;
        document.getElementById('tableLink').style.display = 'block';
    } catch (error) {
        console.error('Error creating table:', error);
        alert('Error creating table.');
    }
}

function joinTable() {
    const tableId = prompt("Enter the table ID:");
    if (tableId) {
        window.location.href = `${window.location.origin}/game.html?table=${tableId}`;
    }
}

function copyLink() {
    const tableUrl = document.getElementById("tableUrl");
    tableUrl.select();
    navigator.clipboard.writeText(tableUrl.value)
        .then(() => alert("Link copied!"))
        .catch(err => console.error("Failed to copy:", err));
}

// Automatically load table settings when joining a game
function loadTableSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get("table");

    if (tableId) {
        fetch(`https://pokerdexdev-server.onrender.com/getTableSettings?tableId=${tableId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Table not found:", data.error);
                    return;
                }

                // Store settings for game.js to use
                sessionStorage.setItem("solToToken", data.solToToken);
                sessionStorage.setItem("smallBlind", data.smallBlindAmount);  // Corrected field name
                sessionStorage.setItem("bigBlind", data.bigBlindAmount);  // Corrected field name
                sessionStorage.setItem("gameType", data.gameType);
                sessionStorage.setItem("minBuyIn", data.minBuyIn);
                sessionStorage.setItem("maxBuyIn", data.maxBuyIn);
                
                console.log("Loaded table settings:", data);

                // Optionally, you can also display these settings in the UI to check if they are correctly loaded
                document.getElementById("solToTokenDisplay").innerText = data.solToToken;
                document.getElementById("smallBlindDisplay").innerText = data.smallBlindAmount;
                document.getElementById("bigBlindDisplay").innerText = data.bigBlindAmount;
                document.getElementById("buyInDisplay").innerText = 
                    `Buy-In Limits: ${data.gameType === "limit" ? data.minBuyIn + " SOL (min) to " + data.maxBuyIn + " SOL (max)" : "No limit"}`;
            })
            .catch(err => console.error("Error fetching table settings:", err));
    }
}
