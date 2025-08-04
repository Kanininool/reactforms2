const config = {
  "Personal Info": {
    "Name": "String",
    "Age": "Number"
  },
  "Work Info": {
    "Skills": "String",
    "Company": "String"
  }
};

const samples1 = [
  { "Name": "Mark", "Age": 50 },
  { "Name": "Jane", "Age": 30 },
  { "Name": "Mark1", "Age": 50 },
  { "Name": "Jane1", "Age": 30 }
];

const samples2 = [
  { "Skills": "React", "Company": "Infosys" },
  { "Skills": "Angular", "Company": "TCS" }
];

const sampleArrays = [samples1, samples2];

function getSectionForSample(sample, config) {
  for (const section in config) {
    const keys = Object.keys(config[section]);
    if (keys.every(key => key in sample)) {
      return section;
    }
  }
  return null;
}

function transformSamples(config, sampleArrays) {
  const result = {};

  // Initialize result structure
  for (const section in config) {
    result[section] = [];
  }

  // Process each sample array
  sampleArrays.forEach(samples => {
    samples.forEach(sample => {
      const section = getSectionForSample(sample, config);
      if (section) {
        const sectionData = {};
        for (const key in config[section]) {
          if (sample.hasOwnProperty(key)) {
            sectionData[key] = sample[key];
          }
        }
        result[section].push(sectionData);
      }
    });
  });

  return result;
}

const transformedSample = transformSamples(config, sampleArrays);
console.log(JSON.stringify(transformedSample, null, 2));
