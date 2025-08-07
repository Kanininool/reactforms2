const axios = require('axios');

const inputJson = [
  { "Name": "Name", "Fields": "", "Url": "" },
  { "Name": "Age", "Fields": "", "Url": "" },
  { "Name": "Skills", "Fields": "PrimarySkill", "Url": "<api url>" },
  { "Name": "Country", "Fields": "Country", "Url": "<api url>" }
];

async function fetchDataAndFormat(input) {
  const output = [];

  for (const item of input) {
    const { Name, Fields, Url } = item;
    let data = [];

    if (Url) {
      try {
        const response = await axios.get(Url);
        const apiData = response.data;

        // Extract the field if specified
        if (Fields && Array.isArray(apiData)) {
          data = apiData.map(entry => entry[Fields]).filter(Boolean);
        }
      } catch (error) {
        console.error(`Error fetching data for ${Name}:`, error.message);
      }
    }

    output.push({ column: Name, data });
  }

  return output;
}

// Run the function
fetchDataAndFormat(inputJson).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
