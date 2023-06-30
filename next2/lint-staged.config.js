let files;
const gitAdd = 'git add ';
const envProd = 'cross-env NODE_ENV=production';

// Function Task to control lint-staged
module.exports = {
  '*.{tsx,jsx,html,js,json,md}': filenames => {
    // Auto format all .html or JSX containing files with Prettier

    console.log(filenames);
    const hasFiles = filenames.length > 0;
    if (hasFiles) {
      // Wrap each filename in double quotes so it won't break the command in case the path contains a space
      files = filenames.map(filename => `"${filename}"`).join(' ');

      // This returns the command to run all the files as a single command, and it's very fast.
      const command = `${envProd} prettier --write -- ${files}`;
      console.log('Running command: ', command);

      return [command, gitAdd + files];
    } else {
      return ''; // Must return <string | string[] | Promise<string | string[]>
    }

    // This returns the command to run each file as an individual command, but it very slow.
    // return filenames.map((filename) => `prettier --write -- ${filename}`);
  },
  '*.{tsx,ts,jsx}': filenames => {
    // Autofix for TypeScript/JavaScript files

    const hasFiles = filenames.length > 0;
    if (hasFiles) {
      // Wrap each filename in double quotes so it won't break the command in case the path contains a space
      files = filenames.map(filename => `"${filename}"`).join(' ');

      // This returns the command to run all the files as a single command, and it's very fast.
      const command = `${envProd} eslint --cache --fix -- ${files}`;
      console.log('Running command: ', command);

      return [command, gitAdd + files];
    } else {
      return ''; // Must return <string | string[] | Promise<string | string[]>
    }
    // return filenames.map((filename) => `eslint --cache --fix ${filename}`);
  }
  // ,'*.{scss,css,sass}': filenames => {
  //   // Auto format all .html files with Prettier
  //
  //   const hasFiles = filenames.length > 0;
  //   if (hasFiles) {
  //     const files = filenames.map(filename => `"${filename}"`).join(' ');
  //
  //     // This returns the command to run all the files as a single command, and it's very fast.
  //     const command = `${envProd} stylelint --fix ${files}`;
  //     console.log('Running command: ', command);
  //
  //     return [command, gitAdd + files];
  //   } else {
  //     return ''; // Must return <string | string[] | Promise<string | string[]>
  //   }
  //
  //   // This returns the command to run each file as an individual command, but it very slow.
  //   // return filenames.map((filename) => `${envProd} prettier --write -- ${filename}`);
  // }
};
