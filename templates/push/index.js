const {genPackageJSON} = require('./genPackageJSON')

const template = {
    genMain: (name) => `
import http from "ky";
const URL = "http://demo.com/api";

export const sync_to_remote = async (data, { projectId, SecretKey }) => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([JSON.stringify(data)], {
      type: "application/json"
    })
  );
  const response = await http
    .post(URL, {
      headers: {},
      body: formData
    })
    .json();
  return response;
};
    `,
    genPackageJSON
}

module.exports = template