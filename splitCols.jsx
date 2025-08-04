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

const samples = [
  { "Name": "Mark", "Age": 50, "Skills": "React", "Company": "Infosys" },
  { "Name": "Jane", "Age": 30, "Skills": "Angular", "Company": "TCS" },
  { "Name": "John", "Age": 45, "Skills": "Vue", "Company": "Wipro" },
  { "Name": "Alice", "Age": 28, "Skills": "Node.js", "Company": "IBM" },
  { "Name": "Bob", "Age": 35, "Skills": "Python", "Company": "Accenture" },
  { "Name": "Sara", "Age": 32, "Skills": "Java", "Company": "Capgemini" },
  { "Name": "Tom", "Age": 40, "Skills": "Go", "Company": "Cognizant" },
  { "Name": "Emma", "Age": 29, "Skills": "Ruby", "Company": "HCL" },
  { "Name": "Leo", "Age": 38, "Skills": "PHP", "Company": "Tech Mahindra" },
  { "Name": "Nina", "Age": 27, "Skills": "Swift", "Company": "Mindtree" }
];

function transformSamples(config, samples) {
  const result = {};

  // Initialize arrays for each section
  for (const section in config) {
    result[section] = [];
  }

  // Populate each section with respective data
  samples.forEach(sample => {
    for (const section in config) {
      const sectionData = {};
      for (const key in config[section]) {
        if (sample.hasOwnProperty(key)) {
          sectionData[key] = sample[key];
        }
      }
      result[section].push(sectionData);
    }
  });

  return result;
}

const transformed = transformSamples(config, samples);
console.log(JSON.stringify(transformed, null, 2));
