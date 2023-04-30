import { useRouter } from 'next/router';

import React, { useState } from 'react';

function ImportStudentData() {
  const router = useRouter();
  const [file, setFile] = useState();
  const [array, setArray] = useState<{}[]>([]);

  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    console.log(e.target.files[0], 'e.target.files[0]');

    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string: any) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map((i: any) => {
      const values = i.split(',');
      const obj = csvHeader.reduce(
        (object: any, header: any, index: number) => {
          object[header] = values[index];
          return object;
        },
        {}
      );
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target?.result;
        if (text) {
          csvFileToArray(text as string);
        }
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));
  return (
    <div className="flex-row  justify-self-center place-self-center ">
      <p className=" text-3xl font-semibold uppercase mt-10">
        Import Student Data from CSV
      </p>
      <p className=" text-3 mt-3 mb-10">
        Choose a CSV file from your computer and then click on import to see the
        structured data
      </p>
      <div>
        <form>
          <input
            type={'file'}
            id={'csvFileInput'}
            accept={'.csv'}
            onChange={handleOnChange}
          />

          <button
            onClick={(e) => {
              handleOnSubmit(e);
            }}
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 mb-2"
          >
            import
          </button>
        </form>
        <br />
      </div>
      {array.length > 0 && (
        <div className="">
          <p>
            check that your data is correct and then click on
            <button
              type="button"
              className="ml-3 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2 text-center mr-2 mb-2"
            >
              Confirm upload
            </button>{' '}
            to confirm saving import onto Whitecliffe's database
          </p>

          <table>
            <thead>
              <tr key={'header'}>
                {headerKeys.map((key) => (
                  <th>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {array.map((item: any) => (
                <tr key={item.id}>
                  {Object.values(item).map((val: any) => (
                    <td>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ImportStudentData;
