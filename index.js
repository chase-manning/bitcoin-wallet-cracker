import fs from "fs";
import readline from "readline";
import { runInThisContext } from "vm";

const include = (path) => {
  const code = fs.readFileSync(path, "utf-8");
  runInThisContext(code, path);
};
include("lib/crypto.js");

const LINES = 1_493_677_782;
const BACKUP =
  "1dMO9KjdMNuHreZ6x3QLqJR8WHjVjpb+XAOAJh7EKmP7PRMPSs/BRTjowVb0tAzZ9hu/sBRngEoQjYfdFcVDIXP/I4fRu9WxEfiR/76nqQ2qt7Ro2gisZ9RaRBI8oQTfdNjLJxK2P4iF1EtNPqeyJvh21uQOtZQuhxoAuUkKDJlrjOY1akKzth3rw+orQ8L7v1u74toHaIDFSyrMk6e3JiX/6C2e3QVzAkwD6yIh0mNppnoijDSVsbIpaOAyzurE1Pz7SAmTvKMz8igAXSXgGwhtyV+5UMJg4eVcIr+2M623SesaqWqMatYDqNIHKDFs/0ZRxpwzfU1mw+csq+FyunV68xiZKR28g1ZIWg5halhk064nU2QRiM7OzTLm7IXNuztjkWNC4deZgNcYCNFJXKsVaK1N+ch2BHDJx/UW+etAb2YN/tOkSHHPjJ4XLeVsyaU1ztla0t28x+IUyjn6ZL+7KtE+f7IGxEuO762qYQzZB25Z4xjI2Srd8P7d+qLaAhjVVjaM2dl+WEhixs0x65Fc139+j+w6vQc23XaPqJN1lV7laoqSGqMnAcyHLtuIMS5yuTHHTuV+CyaWHaCmZLuNvsWATJ0rhCUZbcvWK8r3XrCUhjzuu8xyaerBrzddy0WNH9HVUmocSyimJR6VzTKwQ0nnFplMFsPf+eC3Qp9o4DepZSk+gyIjolc/LTRW";

const decrypt = (password) => {
  try {
    const mode = new Crypto.mode.CBC(Crypto.pad.iso10126);
    const decoded = Crypto.AES.decrypt(BACKUP, password, {
      mode: mode,
      iterations: 10,
    });
    if (decoded) return decoded;
  } catch (e) {}
  return null;
};

const rl = readline.createInterface({
  input: fs.createReadStream("test-passwords.txt", "utf8"),
});

let count = 0;

rl.on("line", (line) => {
  const percent = (count / LINES) * 100;
  if (count % 10000 === 0) {
    console.log(percent + "%");
  }
  count++;
  const result = decrypt(line);
  if (result) {
    console.log("FOUND");
    console.log("Password: " + line);
    process.exit(0);
  }
});
