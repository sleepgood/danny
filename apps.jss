const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = Recharts;

const BitcoinHeadChart = () => {
  const [data, setData] = useState([]);
  const [latestPrice, setLatestPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const fetchHistorical = async () => {
      try {
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=USD&limit=60'
        );
        const result = await response.json();
        if (result.Data?.Data) {
          const historicalData = result.Data.Data.map(point => ({
            time: new Date(point.time * 1000).toLocaleTimeString(),
            price: point.close
          }));
          
          const prices = historicalData.map(d => d.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const padding = (max - min) * 0.02;
          
          setPriceRange({
            min: Math.floor(min - padding),
            max: Math.ceil(max + padding)
          });
          
          setData(historicalData);
          setLatestPrice(historicalData[historicalData.length - 1].price);
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistorical();
    const histInterval = setInterval(fetchHistorical, 60000); // Update every minute
    return () => clearInterval(histInterval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#1a1a2e', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ color: 'white', fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
        Bitcoin Price: ${latestPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 100px)' }}>
        <img 
          src="images/IMG_3457.png" 
          alt="Floating head" 
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            top: `${100 - ((latestPrice - priceRange.min) / (priceRange.max - priceRange.min) * 100)}%`,
            left: 'calc(100% - 32px)',
            transition: 'all 0.5s ease-out',
            transform: 'translateY(-50%)'
          }}
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              stroke="#fff"
              tick={{ fill: '#fff' }}
            />
            <YAxis 
              domain={[priceRange.min, priceRange.max]}
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickFormatter={value => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1a1a2e', 
                border: '1px solid #fff',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#00ff00" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BitcoinHeadChart />);