const { genPackageJSON } = require("./genPackageJSON");

const template = {
  genMain: () => `
  export const sync_to_remote = async (data) => {
    const formData = new FormData()
    formData.append(
      'file',
      new Blob([JSON.stringify(data)], {
        type: 'application/json'
      })
    )
  
    const response = await fetch('http://demo.foo.com/api', {
      method: 'POST',
      headers: { },
      body: formData
    })
    return await response.json()
  }
    `,
  genPackageJSON,
};

module.exports = template;
