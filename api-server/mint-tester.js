const axios = require('axios');

const url = 'http://localhost:5000/ice/mintToken/0/0x10e6eb4974841956c6f9ada4ab58277ff6ccc33c';

// Put your auth token here
const authToken = '';
const numberOfTokensToMint = 300;

[...Array(numberOfTokensToMint)].forEach((_, i) => {
    console.log('mint:', i);

    axios.get(url, {headers: {'authorization': authToken}})
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`Error fetching ${url}: ${response.statusText}`);
            }
            console.log(response.data);
        });
});

