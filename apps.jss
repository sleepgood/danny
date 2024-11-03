const canvas = document.getElementById('price-chart');
const ctx = canvas.getContext('2d');
const rider = document.getElementById('rider');
const prices = [];
const maxDataPoints = 30;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const data = await response.json();
        return data.bpi.USD.rate_float;
    } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
        return null;
    }
}

function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;

    ctx.beginPath();
    prices.forEach((price, index) => {
        const x = (index / (maxDataPoints - 1)) * canvas.width;
        const y = canvas.height - ((price - minPrice) / (maxPrice - minPrice)) * canvas.height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        if (index === prices.length - 1) {
            rider.style.left = `${x}px`;
            rider.style.top = `${y}px`;
        }
    });
    ctx.stroke();
}

async function updateChart() {
    const price = await fetchBitcoinPrice();
    if (price) {
        prices.push(price);
        if (prices.length > maxDataPoints) prices.shift();

        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);

        drawChart();
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Service Worker Registered"));
}

setInterval(updateChart, 10000);
updateChart();
