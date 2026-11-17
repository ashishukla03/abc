import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('Testing server connection at http://localhost:3000...');
  try {
    const res = await get('http://localhost:3000');
    console.log(`Server responded with HTTP ${res.statusCode}`);
    if (res.body.includes('<div id="root"></div>') || res.body.includes('Gramin PocketLab')) {
      console.log('Root HTML verified successfully!');
    }
  } catch (err) {
    console.error('Server check failed:', err.message);
  }
}

verify();
