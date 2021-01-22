import fs from "fs";
import readline from "readline";
import { runInThisContext } from "vm";

const include = (path) => {
  const code = fs.readFileSync(path, "utf-8");
  runInThisContext(code, path);
};
include("lib/crypto.js");

const BACKUP =
  "1dMO9KjdMNuHreZ6x3QLqJR8WHjVjpb+XAOAJh7EKmP7PRMPSs/BRTjowVb0tAzZ9hu/sBRngEoQjYfdFcVDIXP/I4fRu9WxEfiR/76nqQ2qt7Ro2gisZ9RaRBI8oQTfdNjLJxK2P4iF1EtNPqeyJvh21uQOtZQuhxoAuUkKDJlrjOY1akKzth3rw+orQ8L7v1u74toHaIDFSyrMk6e3JiX/6C2e3QVzAkwD6yIh0mNppnoijDSVsbIpaOAyzurE1Pz7SAmTvKMz8igAXSXgGwhtyV+5UMJg4eVcIr+2M623SesaqWqMatYDqNIHKDFs/0ZRxpwzfU1mw+csq+FyunV68xiZKR28g1ZIWg5halhk064nU2QRiM7OzTLm7IXNuztjkWNC4deZgNcYCNFJXKsVaK1N+ch2BHDJx/UW+etAb2YN/tOkSHHPjJ4XLeVsyaU1ztla0t28x+IUyjn6ZL+7KtE+f7IGxEuO762qYQzZB25Z4xjI2Srd8P7d+qLaAhjVVjaM2dl+WEhixs0x65Fc139+j+w6vQc23XaPqJN1lV7laoqSGqMnAcyHLtuIMS5yuTHHTuV+CyaWHaCmZLuNvsWATJ0rhCUZbcvWK8r3XrCUhjzuu8xyaerBrzddy0WNH9HVUmocSyimJR6VzTKwQ0nnFplMFsPf+eC3Qp9o4DepZSk+gyIjolc/LTRW";
//   "cNjkUjYNIVTsp/BrmflwBzJDCEFJb9TKmyWtoQcc9N3seBhu4jEtzGLSTsDk5bkVzqDW98jEJatDIjbDKp93V++9tU1UdMFTNsZtZDmMBURqw1IvgBI94fD78BgE0IOJifEfHOG3NIR9brSGOSARqdit2w5J/e5V4JmXXfbxuKYmsuO2SXKnExZPHM5ZvKWE8PmV0yBTFwuMMC93ZPGDFf8vwfBfx2fyBdhYZKi+quuNxjh9MWA/TugOCc8NwKdohr0qkYdkNDkVYRJmcQCxAFl4SYD73yupPXa7lL4N0hBYgsVVb1pidrL17/oYanMxjQFr3t6qxMpsk1Y4WeWFzhCNt9/d771bdWKkdXPUUVyGNRtqO55/no5PfQNCy3Eij4jrJ+O3mVe/WOjMbmU99QZzo7eN2qZvlG5tpdjsYL9RNlHaBs+LwztdYLUi16BYLsi3NFA+fXStkbPnTiccEbWgY0e6rWq/vTVy8bifoD2N5oPV4wLEAQAD8eucEXJg";

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
  input: fs.createReadStream("passwords.txt", "utf8"),
});

rl.on("line", (line) => {
  const result = decrypt(line);
  if (result) {
    console.log("Password: " + line);
  }
});
