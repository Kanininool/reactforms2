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

const sample = {
  "Name": "Mark",
  "Age": 50,
  "Skills": "React",
  "Company": "Infosys"
};

function transformSample(config, sample) {
  const result = {};

  for (const section in config) {
    result[section] = {};
    for (const key in config[section]) {
      if (sample.hasOwnProperty(key)) {
        result[section][key] = sample[key];
      }
    }
  }

  return result;
}

const transformed = transformSample(config, sample);
console.log(JSON.stringify(transformed, null, 2));
